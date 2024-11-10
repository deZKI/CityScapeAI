import json
from typing import Dict, Any, List

import pandas as pd
import geopandas as gpd
from fastapi import APIRouter, HTTPException

from models.district_data import DistrictData, DistrictBuildingData, BuildingTypeData
from models.district_request import DistrictRequest
from models.graph_data_output import GraphDataOutput
from models.people_distribution import PeopleDistribution
from models.residential_complex_input import ResidentialComplexInput
from services.graph_manager import GraphManager
from services.infrastructure_analyzer import InfrastructureAnalyzer
from services.pedestrian_flow_predictor import PedestrianFlowPredictor
from services.traffic import fetch_traffic_data

router = APIRouter()


@router.post("/predict-pedestrian-flow/")
def predict_pedestrian_flow(request: DistrictRequest):
    """ Предсказазаение загруженности """
    # Пути к файлам данных
    dataset_path = 'data/good_dataset.csv'
    coefficients_path = 'data/coefficients.csv'

    try:
        district_features = pd.read_csv(dataset_path)
        coefficients = pd.read_csv(coefficients_path)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Ошибка при загрузке данных.")

    # Создание экземпляра предиктора
    predictor = PedestrianFlowPredictor(district_features, coefficients)

    try:
        result = predictor.predict(
            district=request.district,
            new_buildings_info=request.new_buildings_info
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return result.to_dict(orient='records')


@router.get("/traffic-data/")
async def get_traffic_data():
    """
    Асинхронный эндпоинт для получения данных трафика.
    Данные получаются из внешнего API с использованием aiohttp.
    """
    data = await fetch_traffic_data()
    return data


@router.get("/infrastructure-map-data", response_model=Dict[str, Any])
async def get_infrastructure_map_data(
        population_year: int = 2024,
        building_type: str = "school",
        grid_size: int = 25,
        buffer_distance: float = 500.0
):
    """
    Эндпоинт для получения данных для визуализации инфраструктуры на карте.
    """
    try:
        analyzer = InfrastructureAnalyzer(
            buildings_path='data/building-polygon.gpkg',
            boundary_path='data/boundary-polygon-lvl8.gpkg',
            transport_path='data/public-transport-point.gpkg',
            population_path='data/population.xlsx'
        )

        analyzer.load_data()
        analyzer.preprocess_data()
        analyzer.analyze_population(population_year=population_year)
        analyzer.perform_spatial_analysis(building_type=building_type)
        analyzer.convert_buildings_to_points()
        analyzer.merge_infrastructure()

        data = analyzer.prepare_map_data(grid_size=grid_size, district_field='district')
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/load_people", response_model=List[DistrictData])
async def load_people():
    def prepare_district_data() -> List[DistrictData]:
        results = []
        data_path = 'data/new_combined_df.xlsx'
        data = pd.read_excel(data_path)

        for _, row in data.iterrows():
            # Проверяем, что 'district_ru' не None
            if pd.notna(row['district_ru']):
                # Заменяем NaN значения на None вручную
                district_info = DistrictData(
                    district=str(row['district_ru']),
                    load_people=row['load_people'] if not pd.isna(row['load_people']) else None,
                    people_distribution=PeopleDistribution(
                        children_and_pensioners=row['children_and_pensioners'] if not pd.isna(row['children_and_pensioners']) else None,
                        adults_private_transport=row['adults_private_transport'] if not pd.isna(row['adults_private_transport']) else None,
                        adults_public_transport=row['adults_public_transport'] if not pd.isna(row['adults_public_transport']) else None,
                        adults_carsharing_SIM=row['adults_carsharing_SIM'] if not pd.isna(row['adults_carsharing_SIM']) else None
                    ),
                    geometry=json.loads(row['geometry'].to_json()) if isinstance(row['geometry'], gpd.geoseries.GeoSeries) else None
                )
                results.append(district_info)
        return results

    data = prepare_district_data()
    return data


@router.get("/load_building_info", response_model=List[DistrictBuildingData])
async def load_building_info():
    def prepare_building_info() -> List[DistrictBuildingData]:
        results = []
        data_path = 'data/BUILDING.xlsx'

        # Чтение данных из Parquet файла
        data = pd.read_excel(data_path)

        # Группировка данных по району и типу строения с подсчетом количества зданий
        district_building_counts = data.groupby(['district_ru', 'BUILDING'])['Building_Count'].sum()

        # Создаем структуру данных по районам
        district_data = {}
        for (district, building_type), count in district_building_counts.items():
            if district not in district_data:
                district_data[district] = []
            district_data[district].append(BuildingTypeData(building_type=building_type, building_count=count))

        # Формирование итогового списка районов с вложенной структурой типов строений
        for district, buildings in district_data.items():
            results.append(DistrictBuildingData(district_name=district, buildings=buildings))

        return results

    # Получение данных и возврат
    data = prepare_building_info()
    return data


graph_manager = GraphManager()


@router.post("/add_residential_complex", response_model=GraphDataOutput)
def add_residential_complex(input_data: ResidentialComplexInput):
    graph_manager.add_residential_complex(input_data.year, input_data.location)
    edges_gdf, jc_polygons, new_edges, edges_removed = graph_manager.get_graph_for_year(input_data.year)

    if edges_gdf is None:
        raise HTTPException(status_code=404, detail=f"Граф для года {input_data.year} не найден")

    # Извлекаем координаты ЖК
    jc_coordinates = [(polygon.centroid.x, polygon.centroid.y) for polygon in jc_polygons]

    # Извлекаем координаты новых рёбер
    new_edge_coords = [
        ((edge['geometry'].coords[0][0], edge['geometry'].coords[0][1]),
         (edge['geometry'].coords[-1][0], edge['geometry'].coords[-1][1]))
        for _, _, edge in new_edges
    ]

    # Извлекаем координаты удалённых рёбер
    removed_edge_coords = [
        ((edge['geometry'].coords[0][0], edge['geometry'].coords[0][1]),
         (edge['geometry'].coords[-1][0], edge['geometry'].coords[-1][1]))
        for _, _, edge in edges_removed
    ]

    # Извлекаем координаты всех рёбер
    edge_coords = [
        ((edge['geometry'].coords[0][0], edge['geometry'].coords[0][1]),
         (edge['geometry'].coords[-1][0], edge['geometry'].coords[-1][1]))
        for _, edge in edges_gdf.iterrows()
    ]

    return GraphDataOutput(
        year=input_data.year,
        edges_count=len(edges_gdf),
        residential_complex_count=len(jc_polygons),
        new_edges_count=len(new_edges),
        removed_edges_count=len(edges_removed),
        residential_complex_coordinates=jc_coordinates,
        new_edge_coordinates=new_edge_coords,
        removed_edge_coordinates=removed_edge_coords,
        edge_coordinates=edge_coords
    )


@router.get("/graph/{year}", response_model=GraphDataOutput)
def get_graph_for_year(year: int):
    edges_gdf, jc_polygons, new_edges, edges_removed = graph_manager.get_graph_for_year(year)

    if edges_gdf is None:
        raise HTTPException(status_code=404, detail=f"Граф для года {year} не найден")

    # Извлекаем координаты ЖК
    jc_coordinates = [(polygon.centroid.x, polygon.centroid.y) for polygon in jc_polygons]

    # Извлекаем координаты новых рёбер
    new_edge_coords = [
        ((edge['geometry'].coords[0][0], edge['geometry'].coords[0][1]),
         (edge['geometry'].coords[-1][0], edge['geometry'].coords[-1][1]))
        for _, _, edge in new_edges
    ]

    # Извлекаем координаты удалённых рёбер
    removed_edge_coords = [
        ((edge['geometry'].coords[0][0], edge['geometry'].coords[0][1]),
         (edge['geometry'].coords[-1][0], edge['geometry'].coords[-1][1]))
        for _, _, edge in edges_removed
    ]

    # Извлекаем координаты всех рёбер
    edge_coords = [
        ((edge['geometry'].coords[0][0], edge['geometry'].coords[0][1]),
         (edge['geometry'].coords[-1][0], edge['geometry'].coords[-1][1]))
        for _, edge in edges_gdf.iterrows()
    ]

    return GraphDataOutput(
        year=year,
        edges_count=len(edges_gdf),
        residential_complex_count=len(jc_polygons),
        new_edges_count=len(new_edges),
        removed_edges_count=len(edges_removed),
        residential_complex_coordinates=jc_coordinates,
        new_edge_coordinates=new_edge_coords,
        removed_edge_coordinates=removed_edge_coords,
        edge_coordinates=edge_coords
    )

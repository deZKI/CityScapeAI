import json
from typing import Dict, Any, List

import pandas as pd
import geopandas as gpd
from fastapi import APIRouter, HTTPException

from models.district_data import DistrictData, DistrictBuildingData, BuildingTypeData
from models.district_request import DistrictRequest
from models.people_distribution import PeopleDistribution
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
        data_path = 'data/new_combined_df.parquet'
        data = pd.read_parquet(data_path)
        for _, row in data.iterrows():
            district_info = DistrictData(
                district=row['district'],
                load_people=row['load_people'],
                people_distribution=PeopleDistribution(
                    children_and_pensioners=row['children_and_pensioners'],
                    adults_private_transport=row['adults_private_transport'],
                    adults_public_transport=row['adults_public_transport'],
                    adults_carsharing_SIM=row['adults_carsharing_SIM']
                ),
                geometry=json.loads(row['geometry'].to_json()) if isinstance(row['geometry'],
                                                                             gpd.geoseries.GeoSeries) else None
            )
            results.append(district_info)
        return results

    data = prepare_district_data()
    return data


@router.get("/load_building_info", response_model=List[DistrictBuildingData])
async def load_building_info():
    def prepare_building_info() -> List[DistrictBuildingData]:
        results = []
        data_path = 'data/BUILDING.parquet'

        # Чтение данных из Parquet файла
        data = pd.read_parquet(data_path)

        # Группировка данных по району и типу строения с подсчетом количества зданий
        district_building_counts = data.groupby(['district', 'BUILDING'])['Building_Count'].sum()

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

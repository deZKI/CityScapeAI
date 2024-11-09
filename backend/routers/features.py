from typing import Dict, Any

import pandas as pd
from fastapi import APIRouter, HTTPException

from models.district_request import DistrictRequest
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

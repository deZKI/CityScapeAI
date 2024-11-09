import pandas as pd
from fastapi import APIRouter, HTTPException

from models.district_request import DistrictRequest
from services.pedestrian_flow_predictor import PedestrianFlowPredictor
from services.traffic import fetch_traffic_data

router = APIRouter()


@router.post("/predict-pedestrian-flow/")
def predict_pedestrian_flow(request: DistrictRequest):
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

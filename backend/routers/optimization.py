from fastapi import APIRouter
from models import OptimizationRequest
from services.optimization import optimization as ai_optimization

router = APIRouter()


@router.post("/")
async def optimization(request: OptimizationRequest):
    max_value, max_dots = ai_optimization(
        request.age_from,
        request.age_to,
        request.name,
        request.income,
        request.gender,
        request.number_dots,
        request.iterations
    )
    max_dots = [tuple(x) for x in max_dots[['lat', 'lon']].itertuples(index=False, name=None)]
    return {'max_value': max_value, 'max_dots': max_dots}

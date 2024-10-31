from pydantic import BaseModel


class OptimizationRequest(BaseModel):
    age_from: int
    age_to: int
    name: str
    income: str
    gender: str
    iterations: int
    number_dots: int

from typing import Tuple

from pydantic import BaseModel


class ResidentialComplexInput(BaseModel):
    year: int
    location: Tuple[float, float]

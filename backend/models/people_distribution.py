from typing import Optional

from pydantic import BaseModel


class PeopleDistribution(BaseModel):
    children_and_pensioners: Optional[float]
    adults_private_transport: Optional[float]
    adults_public_transport: Optional[float]
    adults_carsharing_SIM: Optional[float]

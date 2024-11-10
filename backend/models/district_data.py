from typing import Optional

from pydantic import BaseModel

from models.people_distribution import PeopleDistribution


class DistrictData(BaseModel):
    district: str
    load_people: Optional[float]
    people_distribution: PeopleDistribution
    geometry: Optional[dict]

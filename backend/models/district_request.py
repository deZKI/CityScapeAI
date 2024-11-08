from pydantic import BaseModel

from models.building_info import BuildingInfo


class DistrictRequest(BaseModel):
    district: str
    new_buildings_info: list[BuildingInfo]

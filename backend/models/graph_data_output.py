from typing import List, Tuple

from pydantic import BaseModel


class GraphDataOutput(BaseModel):
    year: int
    edges_count: int
    residential_complex_count: int
    new_edges_count: int
    removed_edges_count: int
    residential_complex_coordinates: List[Tuple[float, float]]
    new_edge_coordinates: List[Tuple[Tuple[float, float], Tuple[float, float]]]
    removed_edge_coordinates: List[Tuple[Tuple[float, float], Tuple[float, float]]]
    edge_coordinates: List[Tuple[Tuple[float, float], Tuple[float, float]]]
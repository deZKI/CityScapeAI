import geopandas as gpd
from shapely.geometry import Point


def is_point_intersects_vegetation_and_water(point: Point, VEGETATION_POLYGON, WATER_POLYGON) -> bool:
    """
    !!! работает пока только с Москвой
    Проверяет, пересекается ли данная точка со слоем растительности или воды.

    Аргументы:
        точка: Объект shapely Point, представляющий проверяемое местоположение.

    Возвращает:
        True, если точка пересекается со слоем растительности или воды, иначе False.
    """
    if not isinstance(point, Point):
        raise TypeError("Input 'point' must be a shapely Point object.")

    intersecting_vegetation = VEGETATION_POLYGON[VEGETATION_POLYGON.intersects(point)]

    intersecting_water = WATER_POLYGON[WATER_POLYGON.intersects(point)]

    return not intersecting_vegetation.empty or not intersecting_water.empty


def all_points_on_water_or_vegetation(points: list[Point]) -> bool:
    # Данные по Москве
    # Поменять путь до файлов
    VEGETATION_POLYGON = gpd.read_file("data/msk-polygons/vegetation-polygon.gpkg")
    WATER_POLYGON = gpd.read_file("data/msk-polygons/water-polygon.gpkg")

    return all(is_point_intersects_vegetation_and_water(point=Point(point['lon'], point['lat']),
                                                        VEGETATION_POLYGON=VEGETATION_POLYGON,
                                                        WATER_POLYGON=WATER_POLYGON) for point in points)

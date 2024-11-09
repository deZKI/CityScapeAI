import json

import pandas as pd
import geopandas as gpd
from shapely.geometry import Polygon
from shapely.ops import unary_union
from itertools import product
import numpy as np
import logging
from typing import Dict, Any

# Настройка логирования
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


class InfrastructureAnalyzer:
    def __init__(self, buildings_path: str, boundary_path: str, transport_path: str, population_path: str):
        """
        Инициализирует анализатор инфраструктуры с путями к данным.

        Аргументы:
            buildings_path (str): Путь к GeoPackage с полигонами зданий.
            boundary_path (str): Путь к GeoPackage с полигонами границ.
            transport_path (str): Путь к GeoPackage с точками общественного транспорта.
            population_path (str): Путь к Excel файлу с данными о населении.
        """
        self.buildings_path = buildings_path
        self.boundary_path = boundary_path
        self.transport_path = transport_path
        self.population_path = population_path

        # Инициализация переменных для данных
        self.buildings = None
        self.boundary = None
        self.transport = None
        self.population_data = None
        self.merged_gdf = None
        self.filtered_buildings = None
        self.schools_points = None
        self.combined_infra = None
        self.grid = None
        self.no_infra = None

    def load_data(self):
        """
        Загружает все необходимые данные и сохраняет их в атрибутах класса.
        """
        self.buildings = self._load_geospatial_data(self.buildings_path)
        self.boundary = self._load_geospatial_data(self.boundary_path)
        self.transport = self._load_geospatial_data(self.transport_path)
        self.population_data = self._load_population_data(self.population_path)
        logging.info("Все данные успешно загружены.")

    def _load_geospatial_data(self, path: str) -> gpd.GeoDataFrame:
        """
        Загружает геопространственные данные из указанного пути к файлу.

        Аргументы:
            path (str): Путь к файлу с геоданными.

        Возвращает:
            gpd.GeoDataFrame: Загруженный GeoDataFrame.
        """
        logging.info(f"Загрузка геопространственных данных из {path}...")
        data = gpd.read_file(path)
        logging.info(f"Данные из {path} успешно загружены.")
        return data

    def _load_population_data(self, path: str) -> pd.DataFrame:
        """
        Загружает и предобрабатывает данные о населении из Excel файла.

        Аргументы:
            path (str): Путь к Excel файлу с данными о населении.

        Возвращает:
            pd.DataFrame: Предобработанные данные о населении.
        """
        logging.info("Загрузка данных о населении...")
        data = pd.read_excel(path)
        data["district"] = self._clean_text(data["district"])
        logging.info("Данные о населении загружены и очищены.")
        return data

    def _clean_text(self, series: pd.Series) -> pd.Series:
        """
        Очищает текстовые данные, убирая лишние символы и приводя текст к нижнему регистру.

        Аргументы:
            series (pd.Series): Серия pandas с текстовыми данными.

        Возвращает:
            pd.Series: Очищенные текстовые данные.
        """
        logging.debug("Очистка текстовых данных...")
        cleaned = series.astype(str).str.strip().str.lower().str.replace(r'[^a-zа-яё\s]', '', regex=True)
        logging.debug("Текстовые данные очищены.")
        return cleaned

    def preprocess_data(self):
        """
        Предобрабатывает данные о границах и населении.
        """
        self.boundary = self._preprocess_boundary(self.boundary)
        # Обработка дубликатов в population_data
        if self.population_data['district'].duplicated().any():
            logging.warning("Обнаружены дубликаты в population_data['district']. Они будут объединены.")
            self.population_data = self.population_data.groupby('district', as_index=False).sum()

    def _preprocess_boundary(self, boundary_gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
        """
        Предобрабатывает GeoDataFrame с границами, переименовывая и очищая названия районов.

        Аргументы:
            boundary_gdf (gpd.GeoDataFrame): GeoDataFrame с данными о границах.

        Возвращает:
            gpd.GeoDataFrame: Предобработанные данные о границах.
        """
        logging.info("Предобработка данных о границах...")
        boundary_gdf = boundary_gdf.rename(columns={'NAME': 'district'})
        boundary_gdf['district'] = boundary_gdf['district'].str.replace('район', '', regex=False)
        boundary_gdf['district'] = self._clean_text(boundary_gdf['district'])
        logging.info("Данные о границах предобработаны.")

        # Обработка дубликатов в boundary
        if boundary_gdf['district'].duplicated().any():
            logging.warning("Обнаружены дубликаты в boundary['district']. Они будут удалены.")
            boundary_gdf = boundary_gdf.drop_duplicates(subset='district', keep='first')

        return boundary_gdf

    def analyze_population(self, population_year: int = 2024):
        """
        Анализирует изменение населения и объединяет данные с GeoDataFrame границ.

        Аргументы:
            population_year (int): Год для данных о населении (по умолчанию 2024).
        """
        logging.info("Анализ изменения населения...")
        if population_year not in self.population_data.columns:
            raise ValueError(f"Данные за {population_year} год отсутствуют.")

        self.population_data['people'] = self.population_data[population_year]

        # Слияние данных
        self.merged_gdf = self.boundary.merge(self.population_data[['district', 'people']], on='district', how='left')
        self.merged_gdf['people'] = self.merged_gdf['people'].fillna(0)
        logging.info("Анализ изменения населения завершен.")

    def perform_spatial_analysis(self, building_type: str = "school"):
        """
        Выполняет пространственное объединение между зданиями и границами, фильтруя по типу здания.

        Аргументы:
            building_type (str): Тип здания для фильтрации (по умолчанию "school").
        """
        logging.info(f"Выполнение пространственного объединения для зданий типа '{building_type}'...")
        buildings_with_district = gpd.sjoin(self.buildings, self.merged_gdf, how="left", predicate='within')
        self.filtered_buildings = buildings_with_district[buildings_with_district["BUILDING"] == building_type][
            ["people", "district", "geometry"]]
        logging.info(
            f"Пространственное объединение завершено. Количество зданий типа '{building_type}': {len(self.filtered_buildings)}")

    def convert_buildings_to_points(self):
        """
        Преобразует геометрию зданий в точки (центроиды).
        """
        logging.info("Преобразование геометрии зданий в точки (центроиды)...")
        self.filtered_buildings['geometry'] = self.filtered_buildings.geometry.centroid
        self.schools_points = gpd.GeoDataFrame(self.filtered_buildings, geometry='geometry')
        logging.info(f"Преобразование завершено. Количество точек: {len(self.schools_points)}")

    def merge_infrastructure(self):
        """
        Объединяет точки школ и остановок транспорта в один GeoDataFrame.
        """
        logging.info("Объединение точек школ и остановок транспорта...")
        self.schools_points['type'] = 'school'
        self.transport['type'] = 'transport_stop'

        # Выбор необходимых столбцов
        schools_selected = self.schools_points[['type', 'geometry']]
        transport_selected = self.transport[['type', 'geometry']]

        # Обеспечение согласованности CRS
        target_crs = self.boundary.crs
        if schools_selected.crs != target_crs:
            logging.info("Преобразование CRS школ к целевому CRS...")
            schools_selected = schools_selected.to_crs(target_crs)
        if transport_selected.crs != target_crs:
            logging.info("Преобразование CRS транспорта к целевому CRS...")
            transport_selected = transport_selected.to_crs(target_crs)

        # Объединение данных
        combined_points = pd.concat([schools_selected, transport_selected], ignore_index=True)
        self.combined_infra = gpd.GeoDataFrame(combined_points, geometry='geometry', crs=target_crs)
        logging.info("Инфраструктурные точки успешно объединены.")

    def create_grid(self, grid_size: int = 100):
        """
        Создает сетку (Grid) поверх области интереса.

        Аргументы:
            grid_size (int): Количество ячеек по одной оси (по умолчанию 100).
        """
        logging.info("Создание сетки поверх области границ...")
        all_districts = unary_union(self.boundary.geometry)
        xmin, ymin, xmax, ymax = all_districts.bounds
        logging.debug(f"Границы области: xmin={xmin}, ymin={ymin}, xmax={xmax}, ymax={ymax}")

        x_edges = np.linspace(xmin, xmax, grid_size + 1)
        y_edges = np.linspace(ymin, ymax, grid_size + 1)

        grid_cells = [
            Polygon([
                (x_edges[x], y_edges[y]),
                (x_edges[x + 1], y_edges[y]),
                (x_edges[x + 1], y_edges[y + 1]),
                (x_edges[x], y_edges[y + 1]),
                (x_edges[x], y_edges[y])
            ])
            for x, y in product(range(grid_size), range(grid_size))
        ]

        grid = gpd.GeoDataFrame({'geometry': grid_cells})
        grid.crs = self.boundary.crs
        logging.info(f"Сетка создана с {len(grid)} ячейками.")

        # Обрезка сетки по границам районов
        logging.info("Обрезка сетки по границам районов...")
        self.grid = gpd.overlay(grid, self.boundary, how='intersection')
        logging.info(f"Сетка после обрезки: {len(self.grid)} ячеек.")

    def count_infrastructure(self):
        """
        Подсчитывает количество инфраструктурных точек в каждой ячейке сетки.
        """
        logging.info("Подсчет инфраструктурных точек в каждой ячейке сетки...")
        self.grid['count'] = self.grid.geometry.apply(lambda cell: self.combined_infra.within(cell).sum())
        logging.info("Подсчет инфраструктуры завершен.")

    def identify_missing_infrastructure(self):
        """
        Идентифицирует ячейки сетки без инфраструктуры.
        """
        logging.info("Идентификация ячеек без инфраструктуры...")
        self.no_infra = self.grid[self.grid['count'] == 0]
        logging.info(f"Найдено {len(self.no_infra)} ячеек без инфраструктуры.")

    def prepare_map_data(self, grid_size: int = 100, district_field: str = 'district') -> Dict[str, Any]:
        """
        Подготавливает данные для передачи на фронтенд для визуализации карты.

        Аргументы:
            grid_size (int): Размер сетки для пространственного анализа.
            district_field (str): Имя поля для названий районов в GeoDataFrame границ.

        Возвращает:
            Dict[str, Any]: Словарь с данными инфраструктуры, ячейками без инфраструктуры и границами районов.
        """
        # Создание сетки
        self.create_grid(grid_size)

        # Подсчет инфраструктуры в каждой ячейке сетки
        self.count_infrastructure()

        # Идентификация ячеек без инфраструктуры
        self.identify_missing_infrastructure()

        # Подготовка данных для передачи на фронтенд
        # Конвертируем GeoDataFrames в формат GeoJSON (строки)
        infrastructure_geojson_str = self.combined_infra.to_crs(epsg=4326).to_json()
        no_infra_geojson_str = self.no_infra.to_crs(epsg=4326).to_json()
        boundary_geojson_str = self.boundary.to_crs(epsg=4326).to_json()

        # Преобразуем строки JSON обратно в объекты Python
        infrastructure_geojson = json.loads(infrastructure_geojson_str)
        no_infra_geojson = json.loads(no_infra_geojson_str)
        boundary_geojson = json.loads(boundary_geojson_str)

        result = {
            "infrastructure": infrastructure_geojson,
            "no_infrastructure": no_infra_geojson,
            "boundaries": boundary_geojson,
            "district_field": district_field
        }

        return result

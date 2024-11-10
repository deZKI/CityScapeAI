import osmnx as ox
import geopandas as gpd
import pandas as pd

from shapely.geometry import box, Point


class GraphManager:
    def __init__(self):
        print("Загрузка данных...")
        roads = gpd.read_file('data/highway-line.gpkg')
        # buildings = gpd.read_file('data/building-polygon.gpkg')
        crossroads = gpd.read_file('data/highway-crossing-point.gpkg')
        crossroads = crossroads.set_index('OSM_ID')
        crossroads['x'] = crossroads.geometry.x
        crossroads['y'] = crossroads.geometry.y
        print("Данные загружены.")

        roads_footway = roads[roads['HIGHWAY'] == 'footway'].copy()
        roads_footway['start_point'] = roads_footway.geometry.apply(lambda geom: Point(geom.coords[0]))
        roads_footway['end_point'] = roads_footway.geometry.apply(lambda geom: Point(geom.coords[-1]))
        all_points = pd.concat([roads_footway['start_point'], roads_footway['end_point']], ignore_index=True)
        nodes_df = pd.DataFrame({'x': [point.x for point in all_points],
                                 'y': [point.y for point in all_points]}).drop_duplicates().reset_index(drop=True)
        nodes_df['OSM_ID'] = nodes_df.index
        nodes_gdf = gpd.GeoDataFrame(nodes_df, geometry=gpd.points_from_xy(nodes_df['x'], nodes_df['y']),
                                     crs=roads_footway.crs)

        coord_to_osmid = {(row['x'], row['y']): row['OSM_ID'] for idx, row in nodes_gdf.iterrows()}

        roads_footway['u'] = roads_footway['start_point'].apply(lambda p: coord_to_osmid.get((p.x, p.y)))
        roads_footway['v'] = roads_footway['end_point'].apply(lambda p: coord_to_osmid.get((p.x, p.y)))
        edges_gdf = roads_footway[['u', 'v', 'geometry']].copy()
        edges_gdf['length'] = edges_gdf.geometry.length
        edges_gdf['key'] = edges_gdf.groupby(['u', 'v']).cumcount()
        edges_gdf = edges_gdf.set_index(['u', 'v', 'key'])
        G = ox.graph_from_gdfs(nodes_gdf, edges_gdf, graph_attrs={'crs': roads_footway.crs})

        for _, row in nodes_gdf.iterrows():
            G.nodes[row['OSM_ID']]['geometry'] = row['geometry']
            G.nodes[row['OSM_ID']]['x'] = row['x']
            G.nodes[row['OSM_ID']]['y'] = row['y']

        self.graph_versions = {}
        self.user_inputs = []
        self.G_base = G
        self.jc_polygons_by_year = {}
        self.new_edges_by_year = {}
        self.edges_removed_by_year = {}
        self.nodes_gdf = nodes_gdf

    def add_residential_complex(self, year, location):
        center_x, center_y = location
        jc_polygon = self.__create_square_polygon(center_x, center_y, size=200)
        edges_gdf = ox.graph_to_gdfs(self.G_base, nodes=False, edges=True)
        edges_to_remove = edges_gdf[edges_gdf.intersects(jc_polygon)].index
        cut_edges = [(u, v) for u, v, key in edges_to_remove]
        G_temp = self.G_base.copy()
        G_temp.remove_edges_from(edges_to_remove)
        self.G_base = G_temp
        self.graph_versions[year] = G_temp
        self.jc_polygons_by_year[year] = [jc_polygon]
        self.new_edges_by_year[year] = cut_edges

    def get_graph_for_year(self, year):
        if year not in self.graph_versions:
            return None, None, None, None
        G = self.graph_versions[year]
        jc_polygons = self.jc_polygons_by_year.get(year, [])
        edges_gdf = ox.graph_to_gdfs(G, nodes=False, edges=True)
        return edges_gdf, jc_polygons, [], self.new_edges_by_year.get(year, [])

    def __create_square_polygon(self, center_x, center_y, size=200):
        meter_in_degree = 1 / 111000
        half_size_deg = (size / 2) * meter_in_degree
        minx = center_x - half_size_deg
        miny = center_y - half_size_deg
        maxx = center_x + half_size_deg
        maxy = center_y + half_size_deg
        polygon = box(minx, miny, maxx, maxy)
        return polygon

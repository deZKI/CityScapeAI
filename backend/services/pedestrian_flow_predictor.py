import pandas as pd
import numpy as np

from fastapi import HTTPException

from models.building_info import BuildingInfo


class PedestrianFlowPredictor:
    def __init__(self, district_features: pd.DataFrame, coefficients: pd.DataFrame):
        self.district_features = district_features.copy()
        self.coefficients = coefficients.copy()
        self._prepare_data()

    def _prepare_data(self):
        """
        Prepares the initial data by removing unnecessary columns and calculating
        the initial pedestrian flow.
        """
        columns_to_remove = ['road_count_pedestrian', 'road_length_pedestrian_km', 'pedestrian_flow_combined']
        self.district_features.drop(columns=columns_to_remove, errors='ignore', inplace=True)
        self._calculate_new_pedestrian_flow()

    def _calculate_new_pedestrian_flow(self):
        """
        Calculates the new pedestrian flow based on available features.
        Formula:
        pedestrian_flow_combined_new = (population * building_count) / area_sqkm
        """
        required_columns = ['population', 'building_count', 'area_sqkm']
        missing_columns = [col for col in required_columns if col not in self.district_features.columns]
        if missing_columns:
            raise ValueError(f"Отсутствуют необходимые столбцы: {', '.join(missing_columns)}")

        self.district_features['pedestrian_flow_combined_new'] = (
                (self.district_features['population'] * self.district_features['building_count']) /
                self.district_features['area_sqkm']
        )

    def predict(
            self,
            district: str,
            new_buildings_info: list[BuildingInfo]
    ) -> pd.DataFrame:
        """
        Predicts the change in pedestrian flow for a specified district when new buildings are added
        and population changes occur.

        Parameters:
        - district: Name of the district to modify.
        - new_buildings_info: List of BuildingInfo objects containing information about new buildings.

        Returns:
        - DataFrame with the prediction results:
            - district
            - original_pedestrian_flow
            - new_pedestrian_flow
            - delta_pedestrian_flow
            - percent_change
        """
        if district not in self.district_features['district'].values:
            raise HTTPException(status_code=404, detail=f"Район '{district}' не найден в данных.")

        # Extract intercept and coefficients
        try:
            intercept = self.coefficients.loc[self.coefficients['Feature'] == 'Intercept', 'Coefficient'].values[0]
            beta = self.coefficients.set_index('Feature')['Coefficient'].to_dict()
            beta.pop('Intercept', None)  # Remove intercept if present
        except KeyError:
            raise ValueError("Коэффициенты модели некорректны или отсутствуют.")

        district_mask = self.district_features['district'] == district

        # Calculate totals from new buildings
        total_new_buildings = len(new_buildings_info)
        total_new_population = sum(b.population for b in new_buildings_info)
        total_new_residential = sum(1 for b in new_buildings_info if b.building_type == 'residential')
        new_building_levels = [b.levels for b in new_buildings_info]

        # Update district features
        df = self.district_features.loc[district_mask].copy()
        df['building_count'] += total_new_buildings
        df['population'] += total_new_population
        df['residential'] += total_new_residential

        # Update average building levels
        current_avg_levels = df['avg_b_levels'].values[0]
        current_building_count = df['building_count'].values[0] - total_new_buildings  # Before adding new buildings
        total_levels = current_avg_levels * current_building_count + sum(new_building_levels)
        updated_avg_levels = total_levels / (current_building_count + total_new_buildings)
        df['avg_b_levels'] = updated_avg_levels

        # Calculate new pedestrian flow using the regression model
        new_pedestrian_flow = intercept
        for feature, coef in beta.items():
            if feature not in df.columns:
                raise Exception(f"Отсутствует необходимый признак: {feature}")
            value = df[feature].values[0]
            new_pedestrian_flow += coef * value

        # Get the original pedestrian flow
        original_flow = self.district_features.loc[district_mask, 'pedestrian_flow_combined_new'].values[0]

        # Calculate the change in pedestrian flow
        delta_flow = new_pedestrian_flow - original_flow
        percent_change = (delta_flow / original_flow) * 100 if original_flow != 0 else np.nan

        # Logical constraint: If the change is negative, set it to 0
        if delta_flow < 0:
            delta_flow = 0
            new_pedestrian_flow = original_flow
            percent_change = 0

        # Prepare the result DataFrame
        result = pd.DataFrame({
            'district': [district],
            'original_pedestrian_flow': [original_flow],
            'new_pedestrian_flow': [new_pedestrian_flow],
            'delta_pedestrian_flow': [delta_flow],
            'percent_change': [percent_change]
        })

        return result

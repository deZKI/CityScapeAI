import pandas as pd
import json
import joblib
from services.dataset_creator import DatasetCreator
from utils.encoding_utils import apply_onehotencoding
from utils.consts import REQUIRED_COLUMNS
from utils.filters import all_points_on_water_or_vegetation


class DataProcessor:
    def __init__(self):
        self.dataset_creator = DatasetCreator()

    def process_data(self, df: pd.DataFrame) -> pd.DataFrame:
        if 'points' in df.columns and isinstance(df['points'].iloc[0], str):
            df['points'] = df['points'].apply(lambda x: json.loads(x.replace("'", "\"")))

        if 'targetAudience' in df.columns and isinstance(df['targetAudience'].iloc[0], str):
            df['targetAudience'] = df['targetAudience'].apply(lambda x: json.loads(x.replace("'", "\"")))

        if 'targetAudience' in df.columns:
            df = pd.concat([df, pd.json_normalize(df['targetAudience'])], axis=1)
            df.drop('targetAudience', axis=1, inplace=True)

        if 'targetAudience.id' in df.columns:
            df.drop('targetAudience.id', axis=1, inplace=True)

        new_columns = {col: col.replace('targetAudience.', '') for col in df.columns if 'targetAudience.' in col}
        df.rename(columns=new_columns, inplace=True)

        config = {'min_xval': 55.55, 'max_xval': 55.95, 'min_yval': 37.3, 'max_yval': 37.9, 'x_ngroups': 3,
                  'y_ngroups': 3}
        dataset = pd.DataFrame(self.dataset_creator.create_dataset(config, df))

        columns_to_encode = ['income', 'name', 'gender']
        df_encoded = apply_onehotencoding(df, columns_to_encode)
        df_filtered = df_encoded.iloc[:, 2:]

        dataset = dataset.join(df_filtered)

        for column in REQUIRED_COLUMNS:
            if column not in dataset.columns:
                dataset[column] = 0
        X = dataset

        # Загружаем модель CatBoost
        loaded_model = joblib.load('ai/catboost_model.pkl')

        # Прогнозируем с помощью модели CatBoost
        predictions = loaded_model.predict(X)

        predictions_df = pd.DataFrame(predictions, columns=['prediction'])
        result_df = pd.concat([df.reset_index(drop=True), predictions_df], axis=1)

        # Устанавливаем prediction в 0, если все точки находятся на воде или в зелени - такая фильтрация на зону

        result_df.loc[result_df['points'].apply(all_points_on_water_or_vegetation), 'prediction'] = 0
        return result_df

    @staticmethod
    def add_gigachat_description(row):
        from services.gigachat import GigaChatService
        return GigaChatService.add_gigachat_description(row)

    @staticmethod
    def add_type(row):
        value = float(row['prediction'])
        if value > 80:
            return 'high'
        if value > 50:
            return 'middle'
        return 'low'

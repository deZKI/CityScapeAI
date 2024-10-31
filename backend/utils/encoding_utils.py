import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from typing import List


def apply_onehotencoding(df: pd.DataFrame, columns: List[str]) -> pd.DataFrame:
    df_encoded = df.copy()
    encoder = OneHotEncoder(drop='first')

    for column in columns:
        encoded_data = encoder.fit_transform(df_encoded[[column]])
        encoded_df = pd.DataFrame(encoded_data.toarray(), columns=encoder.get_feature_names_out([column]))
        df_encoded = pd.concat([df_encoded.drop(columns=[column]), encoded_df], axis=1)

    return df_encoded

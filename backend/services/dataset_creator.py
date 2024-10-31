import pandas as pd
import numpy as np
import json
from typing import Dict, Union
from utils.interval_utils import split_on_intervals, create_groups, sort_on_groups


class DatasetCreator:
    def create_dataset(self, config: Dict[str, Union[float, int]], df: pd.DataFrame) -> Dict[str, np.ndarray]:
        x_intervals = split_on_intervals(config['min_xval'], config['max_xval'], config['x_ngroups'])
        y_intervals = split_on_intervals(config['min_yval'], config['max_yval'], config['y_ngroups'])

        groups = create_groups(np.array(x_intervals), np.array(y_intervals))
        groups_values = []

        for i in range(len(df)):
            g = df.iloc[i]

            if isinstance(g['points'], str):
                try:
                    g['points'] = json.loads(g['points'].replace("'", "\""))
                except json.JSONDecodeError as e:
                    print(f"Ошибка декодирования JSON в строке {i}: {g['points']}")
                    continue

            points = np.array([[float(x['lat']), float(x['lon'])] for x in g['points']])

            group_values = sort_on_groups(points[:, 0], points[:, 1], np.array(x_intervals), np.array(y_intervals),
                                          groups.copy(), only_vals=True)
            groups_values.append(group_values)

        groups_values = np.array(groups_values)

        for i, key in enumerate(groups.keys()):
            groups[key] = groups_values[:, i]

        return groups

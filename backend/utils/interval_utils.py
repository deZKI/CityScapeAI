import numpy as np
from typing import List, Dict


def split_on_intervals(min_val: float, max_val: float, n: int) -> List[float]:
    step = (max_val - min_val) / n
    intervals = [min_val + (step * x) for x in range(n + 1)]
    return intervals


def create_groups(x_intervals: np.ndarray, y_intervals: np.ndarray) -> Dict[str, int]:
    groups = {}
    x_intervals = np.concatenate([[-np.inf], x_intervals, [np.inf]])
    y_intervals = np.concatenate([[-np.inf], y_intervals, [np.inf]])

    for x_i in range(len(x_intervals) - 1):
        for y_i in range(len(y_intervals) - 1):
            groups[
                f'x : {x_intervals[x_i]} - {x_intervals[x_i + 1]} | y : {y_intervals[y_i]} - {y_intervals[y_i + 1]}'] = 0

    return groups


def sort_on_groups(x_vals: np.ndarray, y_vals: np.ndarray, x_intervals: np.ndarray, y_intervals: np.ndarray,
                   groups: Dict[str, int], only_vals: bool = False):
    for x, y in zip(x_vals, y_vals):
        for x_i in range(len(x_intervals) - 1):
            for y_i in range(len(y_intervals) - 1):
                if (x_intervals[x_i] <= x < x_intervals[x_i + 1]) and (y_intervals[y_i] <= y < y_intervals[y_i + 1]):
                    groups[
                        f'x : {x_intervals[x_i]} - {x_intervals[x_i + 1]} | y : {y_intervals[y_i]} - {y_intervals[y_i + 1]}'] += 1

    if only_vals:
        return list(groups.values())

    return groups

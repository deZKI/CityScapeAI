import joblib
import pandas as pd
import pickle

loaded_model = joblib.load('ai/catboost_model.pkl')

df_csv = pd.read_parquet('ai/data.parquet')
all_name_columns = list(df_csv.columns)[2:104]
name_columns = list(df_csv.columns)[4:29]


def dots2sample(age_from, age_to, name, income, gender, x_y_dots):
    # принимает набор точек и параметры рекламной компании, возвращает сэмпл для модели
    # собираем сэмпл для модели как конструктор, правильная последовательность в all_name_columns
    all_list = [0 for i in range(102)]

    all_list[0] = age_from
    all_list[1] = age_to

    for i in range(len(x_y_dots)):
        all_list[i + 2] = x_y_dots[i]

    all_list[all_name_columns.index(name)] = 1
    all_list[all_name_columns.index(income)] = 1

    if gender != "All":
        all_list[all_name_columns.index(gender)] = 1

    return all_list


def optimization(age_from, age_to, name, income, gender, number_dots, iterations) -> (float, pd.DataFrame):
    with open('ai/ind_pred2.pkl', 'rb') as file:

        # Call load method to deserialze
        ind_pred = pickle.load(file)

    sort_dots = list(ind_pred.keys())  # список всех отсортированных точек

    list_dots = sort_dots[0:number_dots]  # нулевое решение
    max_value = loaded_model.predict(
        dots2sample(age_from, age_to, name, income, gender, list(df_csv.iloc[list_dots][name_columns].sum()))
    )  # считаем value нулевого решения

    for iteration in range(iterations):
        max_test_value = max_value
        adres_max_dot = 0
        for dot in range(number_dots):
            test_list_dots = list_dots.copy()
            test_list_dots[dot] = sort_dots[number_dots + iteration]  # меняем точку на новую

            test_value = loaded_model.predict(
                dots2sample(age_from, age_to, name, income, gender,
                            list(df_csv.iloc[test_list_dots][name_columns].sum()))
            )  # считаем value для этого набора

            if test_value > max_test_value:  # если Value больше максимального в переборе, сохраняем адрес и перезаписываем максимальное
                max_test_value = test_value
                adres_max_dot = dot

        if max_test_value > max_value:  # если нашли набор где value больше максимального, меняем точку и перезаписываем максимальное
            max_value = max_test_value
            list_dots[adres_max_dot] = sort_dots[number_dots + iteration]

    return max_value, df_csv.iloc[list_dots]

import asyncio
import json
import os
from typing import Dict, List


async def fetch_traffic_data() -> Dict[str, List[int]]:
    """
    !!!Заглушка. На данном этапе мы используем локальные данные загруженности дорог по районам Москвы.
    !!!В будущем планируется подключение к внешним API.

    Асинхронная функция для получения данных трафика.
    Возвращает словарь, где ключ — название района, значение — список значений трафика по часам.
    """
    file_path = 'data/road_traffic.json'

    # Проверяем, существует ли файл
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Файл {file_path} не найден.")

    try:
        # Используем асинхронное чтение файла
        loop = asyncio.get_event_loop()
        with open(file_path, 'r', encoding='utf-8') as f:
            data = await loop.run_in_executor(None, f.read)
        traffic_data = json.loads(data)
    except json.JSONDecodeError as e:
        # Обрабатываем ошибки парсинга JSON
        raise ValueError(f"Ошибка при разборе JSON из файла {file_path}: {e}")
    except Exception as e:
        # Обрабатываем другие возможные ошибки
        raise Exception(f"Ошибка при чтении файла {file_path}: {e}")

    return traffic_data


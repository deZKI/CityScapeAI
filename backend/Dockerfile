# Использование базового образа Debian
FROM python:3.12-slim

# Обновление пакетов и установка зависимостей для сборки
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    gfortran \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    libgtk2.0-dev \
    libv4l-dev \
    ffmpeg \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Обновление pip, setuptools и wheel
RUN pip install --upgrade pip setuptools wheel

# Установка numpy
RUN pip install numpy

# Установка остальных зависимостей
COPY requirements.txt /app/
RUN pip install -r /app/requirements.txt

# Установка рабочей директории в контейнере
WORKDIR /app

# Копирование всех файлов проекта
COPY . /app

# Делаем entrypoint скрипт исполняемым
RUN chmod +x entrypoint.sh
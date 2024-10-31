import pandas as pd
import io
from fastapi import APIRouter, UploadFile, File, Form
from services.data_processor import DataProcessor

router = APIRouter()
data_processor = DataProcessor()


@router.post("/")
async def advert(connect_gigachat: bool = Form(...), file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    processed_df = data_processor.process_data(df)

    if connect_gigachat:
        processed_df['description'] = processed_df.apply(lambda row: data_processor.add_gigachat_description(row),
                                                         axis=1)
    else:
        processed_df['description'] = "Описание"

    return processed_df.to_dict(orient='records')

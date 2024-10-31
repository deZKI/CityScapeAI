import os
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_community.chat_models.gigachat import GigaChat


class GigaChatService:
    gigachat = GigaChat(credentials=os.getenv('GIGACHAT'), verify_ssl_certs=False)

    @staticmethod
    def add_gigachat_description(row):
        messages = [
            SystemMessage(
                content="Ты - эксперт по рекламе с 10 летним опытом. Ты понимаешь, почему данная рекламная кампания полезна, и какую рекламу лучше предложить для размещения."
            ),
            HumanMessage(content=f"Опиши рекламную кампанию. Вот такие данные по ней:"
                                 f"Охват: {row['prediction']}"
                                 f"Массив точек: {row['points']}"
                                 f"Название целевой аудитории: {row['name']}"
                                 f"Пол целевой аудитории: {row['gender']}"
                                 f"Возраст целевой аудитории: от {row['ageFrom']} до {row['ageTo']}"
                                 f"Доход: {row['income']}")
        ]
        res = GigaChatService.gigachat.invoke(messages)
        return res.content

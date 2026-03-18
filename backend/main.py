from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from typing import List, Optional
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Создаем директорию для JSON файлов
JSON_DIR = "ics_accounts"
os.makedirs(JSON_DIR, exist_ok=True)

class IPConfig(BaseModel):
    ip: str

class ICSAccount(BaseModel):
    number: str
    username: str
    password: str
    staticAddress: bool = False
    aclAddress: bool = False
    address1: str = ""
    address2: str = ""
    priority: str = "0"
    priorityHandling: str = "disconnect"
    checkAvailability: bool = True
    checkFrequency: str = "60"
    sendRLF: bool = True
    customRLF: bool = False
    noiseSuppression: bool = False
    videoSupport: bool = False
    registerCalls: bool = False
    deactivated: bool = False
    proxy: bool = False
    selectedCodecs: List[str] = ["alaw"]
    availableCodecs: List[str] = ["speex", "speex16", "slaw", "siren7", "siren14", "alawdct"]
    selectedFragments: List[str] = []
    availableFragments: List[str] = ["CHIMEshort", "CHIME"]

@app.get('/')
def read_root():
    return {'message': 'Привет, Armtel!'}

@app.get('/api/settings')
def get_settings():
    return {
        'asteriskVersion': '18.20.0',
        'webVersion': '2.4.1',
        'ipConfig': '192.168.1.100'
    }

@app.post('/api/settings/ip')
def update_ip(data: IPConfig):
    return {
        'success': True, 
        'message': f'IP обновлён: {data.ip}', 
        'ip': data.ip
    }

@app.post('/api/ics/create')
async def create_ics_account(account: ICSAccount):
    try:
        # Создаём JSON файл с данными аккаунта
        filename = f"ics_{account.number}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        filepath = os.path.join(JSON_DIR, filename)
        
        account_dict = account.dict()
        account_dict['created_at'] = datetime.now().isoformat()
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(account_dict, f, ensure_ascii=False, indent=2)
        
        return {
            'success': True,
            'message': 'Учётная запись создана',
            'filename': filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Получение списка всех аккаунтов
@app.get('/api/ics/accounts')
def get_ics_accounts():
    try:
        accounts = []
        for filename in os.listdir(JSON_DIR):
            if filename.endswith('.json'):
                filepath = os.path.join(JSON_DIR, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        account_data = json.load(f)
                    accounts.append({
                        'filename': filename,
                        'data': account_data
                    })
                except:
                    # Пропускаем битые файлы
                    continue
        
        # Сортируем по дате создания (новые сверху)
        accounts.sort(key=lambda x: x['data'].get('created_at', ''), reverse=True)
        
        return {
            'success': True,
            'accounts': accounts
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Удаление аккаунта
@app.delete('/api/ics/accounts/{filename}')
def delete_ics_account(filename: str):
    try:
        filepath = os.path.join(JSON_DIR, filename)
        
        # Проверяем безопасность имени файла
        if '..' in filename or '/' in filename or '\\' in filename:
            raise HTTPException(status_code=400, detail='Некорректное имя файла')
        
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail='Файл не найден')
        
        os.remove(filepath)
        
        return {
            'success': True,
            'message': f'Аккаунт {filename} удалён'
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Получение конкретного аккаунта
@app.get('/api/ics/accounts/{filename}')
def get_ics_account(filename: str):
    try:
        filepath = os.path.join(JSON_DIR, filename)
        
        if '..' in filename or '/' in filename or '\\' in filename:
            raise HTTPException(status_code=400, detail='Некорректное имя файла')
        
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail='Файл не найден')
        
        with open(filepath, 'r', encoding='utf-8') as f:
            account_data = json.load(f)
        
        return {
            'success': True,
            'account': account_data
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
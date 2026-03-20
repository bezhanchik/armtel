# Веб-приложение с новым дизайном для Armtelics
**React** приложение. Проект собран на **Vite**

![Made by Arman](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4TL-IeVP7KAlCIhnysH5Rd16JRkvHfBMZ0w&s)

## Инструкция по загрузке проекта

1. Склонируйте **репозиторий** командой:
`gh repo clone bezhanchik/armtel `
2. или просто скачайте по ссылке: https://github.com/bezhanchik/armtel.git, нажав **Download ZIP**
3. Далее открываете скачанный репозиторий в любом редакторе кода

### Инструкция по установке нужных зависимостей

1. Для начала понадобиться установить необходимые программы: **Visual Studio Code**(либо любой редактор кода, который вы захотите), **NodeJS**, **nginx**
2. Начнём с VS Code
3. Скачайте версию .deb с официального сайта по ссылке: https://code.visualstudio.com/download
4. Откройте .deb пакет и установите **VS Code**.
5. Переходим к **NodeJS**.
6. Обновите пакеты командой `sudo apt update`
7. Откройте в редакторе nano файл по пути /etc/apt/sources.list командой `sudo nano /etc/apt/sources.list`
8. Закомментируйте первую строку, которая начинается с *def cdrom* и расскоментируйте остальные. 
9. Загружаем скрипт для настройки репозитория NodeSource: `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -`
10. Обновляем пакеты командой из 6-го пукнта и устанавливаем NodeJS: `sudo apt install -y nodejs`
11. После установки **NodeJS** нужно установить зависимости проекта, выполните в терминале папки проекта: `npm install`
> Важно! Если вы используете сеть компании, для установки нужных зависимостей вам нужно выключить проверку **SSL-сертификатов**. Делается это следующим 
образом, выполните команду в терминале: `npm config set strict-ssl false`.
1. Теперь установим nginx.
2. Устанавливаем командой: `sudo apt install -y nginx`

> По-прежнему, если вы работаете в сети компании, то вам так же нужно обойти проверку SSL. Для этого вернитесь к 7-ому пункту и там уже поменяйте все ссылки c *https* на *http*

3. Теперь настроим **nginx** для нашего проекта
4. Для этого соберите **build-версию** вашего проекта командой: `npm run build`
5. У вас появится папка dist. Копируете путь к ней и переходим к настройке конфига nginx.
6. Откройте файл конфига nginx по пути `/etc/nginx/sites-available/default`
7. Редактируя конфиг, находите вот эти строчки: 
```markdown
root var/www/html
index index.html index.htm index.nginx-debian.html;

server name _; // тут по-желанию можете укаазать имя сервера(например localhost)

try_files $uri $uri = index.html; // тут меняете на try_files $uri $uri / index.html
```
8. Далее скопируйте проект в *nginx* папку по умолчанию, командой: `sudo cp -r /home/User/Загрузки/project_name/dist/* /var/www/html/`
> 8-ой пункт не обязателен, но если вы скачали проект и оставили в директории *Загрузки*, то nginx не сможет прочитать содержимое вашего проекта. Если вам он не потребовался, то в файле конфига надо вставить свой путь!
9. Теперь запускаем *nginx*, командой: `sudo systemctl start nginx`
10. Проверяем состояние конфига: `sudo nginx -t` (все тесты должны быть пройдены)
11. Открываем проект в браузере по названию сервера *localhost* или адресу **127.0.0.1**
> При каждом изменении конфига **nginx**, необходимо перезапустить сервер: `sudo systemctl restart nginx`

### Настройка Back-end логики через Python FastAPI
1. Проверяем установлен ли **Python** на вашей ВМ - `python --version`
2. Если у вас он не установлен, сделайте это командой - `sudo apt install python3 python3-pip python3-dev python3-venv`
3. Создаём виртуальное окружение в папке с *back-end*, введите в терминале `python3 -m venv venv`
4. Активируем виртуальное окружение - `source venv/bin/activate`
5. Устанавливаем FastAPI и Uvicorn - `python -m pip install fastapi` || `python -m pip install uvicorn[all]`
6. Перенастроим конфигурацию **nginx** под наш *back-end*. Добавьте эти строки в файл вашей конфигурации.
```markdown
location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
```
7. Запустите FastAPI - `uvicorn main:app --reload`
> Каждый раз когда редактируете конфигурацию **nginx** - требуется его перезапустить. Сделайте это командой - `sudo systemctl restart nginx`


### Команды для работы с проектом
1. `npm run dev` - Запустить проект в режиме разработчика.
2. `npm run build` - Создать **build-версию** проекта.
3. `source venv/bin/activate` - Активировать **виртуальное** окружение.
4. `uvicorn main:app --reload` - Запустить сервер **FastAPI**

# store

Статический сайт без сборки. Публикуется на GitHub Pages.

## Структура

```
index.html          — страница
css/style.css       — стили
js/app.js           — скрипты
.github/workflows/deploy.yml — деплой
```

## Деплой

Workflow `deploy.yml` запускается на push в `main` и вручную (`workflow_dispatch`).
Артефактом выгружается корень репозитория как есть — сборки нет.

Один раз в настройках репозитория нужно выставить
**Settings → Pages → Build and deployment → Source: GitHub Actions**
(шаг `configure-pages` с `enablement: true` пытается включить это сам, но
на некоторых аккаунтах требуется ручное подтверждение).

Адрес сайта: https://omaul.github.io/store/

## Локально

Открыть `index.html` в браузере или поднять статику:

```bash
python3 -m http.server 8000
```

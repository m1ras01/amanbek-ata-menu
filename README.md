# Amanbek Ata — QR-меню

Веб-приложение QR-меню ресторана с поддержкой русского, казахского и узбекского языков.

## Быстрый старт

```bash
cd menu-app
npm install
npm run dev
```

Откройте:
- **Меню (для гостей):** http://localhost:3000
- **Админ-панель:** http://localhost:3000/panel-ata7k
- **QR меню:** http://localhost:3000/panel-ata7k/qr
- **QR входа:** http://localhost:3000/panel-ata7k/access

## Доступ в админку

| | |
|---|---|
| **Адрес** | `/panel-ata7k` (скрытый, `/admin` не работает) |
| **Логин** | `admin` |
| **Пароль** | `amanbek2026` |

Измените в `.env.local`:
```
ADMIN_PATH=panel-ata7k
NEXT_PUBLIC_ADMIN_PATH=panel-ata7k
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ваш_пароль
```

## Возможности

- Меню на 3 языках (RU / KZ / UZ)
- Переключение языка с сохранением в браузере
- Поиск по блюдам
- Категории, фото, цены, метки
- Админ-панель для управления меню
- Генерация и скачивание QR-кода

## Деплой

Рекомендуется [Vercel](https://vercel.com):

1. Загрузите проект на GitHub
2. Подключите к Vercel
3. Укажите переменные `ADMIN_PASSWORD` и `NEXT_PUBLIC_SITE_URL`
4. После деплоя скачайте QR из админки

## Структура

```
menu-app/
├── data/menu.json       # Данные меню
├── src/
│   ├── app/             # Страницы и API
│   ├── components/      # UI компоненты
│   └── lib/             # Утилиты
```

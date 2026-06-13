# Свадебное приглашение Данила и Натальи

Статический свадебный сайт на Vite + React. Размещается бесплатно на GitHub Pages, а ответы RSVP отправляются в Google Таблицу через бесплатный Google Apps Script.

## Быстрый запуск

На Windows:

```bat
start-site.bat
```

Файл сам проверит Node.js/npm, установит зависимости проекта, остановит старый сайт на порту `5173` и откроет браузер.

На macOS:

```bash
./start-site.command
```

Если macOS не даёт запустить файл, один раз выполните:

```bash
chmod +x start-site.command
```

Файл сам проверит Node.js/npm, установит зависимости проекта, остановит старый сайт на порту `5173` и откроет браузер. Если Node.js ещё не установлен, скрипт попробует поставить его через Homebrew или откроет страницу установки Node.js.

Вручную:

```bash
npm install
npm run dev -- --port 5173
npm run build
```

## Что менять заказчику

Основной способ настройки - таблицы в папке `content`. Их можно открыть в Excel или Google Sheets, отредактировать и сохранить обратно как CSV с разделителем `;`.

Тексты сайта:

- `content/site.csv` - имена, дата, главный текст, место, дресс-код, заголовки секций.
- `content/program.csv` - программа дня.
- `content/notes.csv` - блоки 18+, цветы, контакты.

Опросник RSVP:

- `content/survey-texts.csv` - текст модалки и ссылка `googleScriptUrl` для записи в Google Таблицу.
- `content/survey-fields.csv` - поля гостя, сейчас имя и фамилия.
- `content/survey-questions.csv` - вопросы, варианты ответов и типы вопросов.

Фотографии:

- `img/wedding-hero.png` - главный фон сайта и RSVP-модалки.
- `img/photo-1.jpg`
- `img/photo-2.jpg`
- `img/photo-3.jpg`
- `content/gallery.csv` - подписи к этим фото.

Чтобы заменить фото, положите новый файл в `img` с тем же именем. В `content/gallery.csv` пути пишутся как `/photo-1.jpg`, `/photo-2.jpg`, `/photo-3.jpg`.

После изменения CSV ничего вручную генерировать не нужно: `start-site.bat`, `start-site.command`, `npm run dev`, `npm run build` и `npm run test` сами обновляют конфиг сайта.

## Как менять вопросы

Откройте `content/survey-questions.csv` и редактируйте строки.

Пример строки вопроса:

```csv
attendance;Вы сможете быть с нами?;Нам важно заранее понимать количество гостей.;radio;true;Да, с радостью буду|Пока не уверен(а)|К сожалению, не смогу;
```

Поддерживаемые типы:

- `radio` - один вариант.
- `checkbox` - несколько вариантов.
- `select` - выпадающий список.
- `textarea` - свободный текст.

При добавлении новых вопросов сайт сам отправит их названия в Google Таблицу, а Apps Script добавит недостающие колонки после первого ответа.

## Как подключить ответы

1. Создайте Google Таблицу.
2. Откройте `Расширения -> Apps Script`.
3. Вставьте код из `deploy/google-sheets-apps-script.js`.
4. Нажмите `Deploy -> New deployment`.
5. Тип: `Web app`.
6. `Execute as`: `Me`.
7. `Who has access`: `Anyone`.
8. Скопируйте Web app URL.
9. Вставьте его в `content/survey-texts.csv` в строку `googleScriptUrl`.

После этого ответы гостей будут появляться в листе `RSVP` Google Таблицы. На сайте админки нет.

## Деплой бесплатно

Основной вариант: GitHub Pages.

1. Запушить проект в GitHub в ветку `master`.
2. Открыть `Settings -> Pages`.
3. Выбрать `Source: GitHub Actions`.
4. Workflow `.github/workflows/pages.yml` сам соберёт `dist` и опубликует сайт.

## Структура

- `src/App.jsx` - секции сайта и пошаговая RSVP-модалка.
- `src/styles.css` - внешний вид.
- `src/components/Aurora.jsx` - WebGL-фон, адаптирован из React Bits Aurora.
- `src/config/site.js` - импортирует корневые конфиги.
- `src/lib/rsvpStorage.js` - отправляет ответы в Google Sheets.
- `content/*.csv` - редактируемые таблицы для текстов, фото и опросов.
- `scripts/generate-config.mjs` - собирает CSV в `src/generated/siteContent.js`.
- `scripts/check-config.mjs` - проверяет картинки, вопросы и синтаксис Apps Script перед сборкой.
- `deploy/google-sheets-apps-script.js` - бесплатная запись ответов в таблицу.
- `start-site.bat` - локальный запуск с остановкой старого процесса на порту `5173`.
- `start-site.command` - локальный запуск на macOS с остановкой старого процесса на порту `5173`.

В проекте намеренно оставлены только рабочие файлы Vite/React-сайта. Старые папки исходного шаблона с jQuery, Sass, PSD и неиспользуемыми ассетами удалены, чтобы заказчик не путался.

## Проверка

```bash
npm run test
```

`npm run test` проверяет конфиги и выполняет production-сборку.

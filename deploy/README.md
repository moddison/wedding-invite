# Бесплатный деплой и сбор ответов

## GitHub Pages

1. Создайте репозиторий на GitHub.
2. Запушьте проект в ветку `master`.
3. Откройте `Settings -> Pages`.
4. В `Build and deployment` выберите `Source: GitHub Actions`.
5. После пуша workflow `.github/workflows/pages.yml` соберёт сайт и опубликует GitHub Pages.

## Google Таблица для RSVP

1. Создайте Google Таблицу.
2. Откройте `Расширения -> Apps Script`.
3. Удалите старый код и вставьте содержимое `deploy/google-sheets-apps-script.js`.
4. Нажмите `Deploy -> New deployment`.
5. Тип развертывания: `Web app`.
6. `Execute as`: `Me`.
7. `Who has access`: `Anyone`.
8. Нажмите `Deploy`.
9. Скопируйте Web app URL.
10. Вставьте URL в `content/survey-texts.csv` в строку `googleScriptUrl`.
11. Запустите `npm run build` и запушьте изменения.

После отправки формы на сайте в таблице появится лист `RSVP`.
Первые базовые колонки:

- `Дата`
- `Имя`
- `Фамилия`
- `ID`

Колонки под вопросы добавляются автоматически по названиям из `content/survey-questions.csv`.

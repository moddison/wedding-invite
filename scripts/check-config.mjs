import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { inviteConfig } from '../invite.config.js';
import { surveyConfig } from '../survey.config.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const supportedQuestionTypes = new Set(['radio', 'checkbox', 'select', 'textarea']);
const requiredContentFiles = [
  'site.csv',
  'program.csv',
  'notes.csv',
  'gallery.csv',
  'survey-texts.csv',
  'survey-fields.csv',
  'survey-questions.csv',
];

function fail(message) {
  throw new Error(message);
}

requiredContentFiles.forEach((fileName) => {
  const filePath = path.join(rootDir, 'content', fileName);
  if (!fs.existsSync(filePath)) {
    fail('Не найден файл настроек: ' + filePath);
  }
});

if (!fs.existsSync(path.join(rootDir, 'src', 'generated', 'siteContent.js'))) {
  fail('Не найден сгенерированный конфиг. Запустите npm run generate.');
}

const imagePaths = [
  inviteConfig.images.hero,
  ...inviteConfig.images.gallery,
].map((imagePath) => path.join(rootDir, 'img', imagePath.replace(/^\//, '')));

const missingImages = imagePaths.filter((imagePath) => !fs.existsSync(imagePath));
if (missingImages.length > 0) {
  fail('Не найдены картинки: ' + missingImages.join(', '));
}

const questionIds = surveyConfig.questions.map((question) => question.id);
const duplicateIds = questionIds.filter(
  (id, index) => questionIds.indexOf(id) !== index,
);
if (duplicateIds.length > 0) {
  fail('Дублируются id вопросов: ' + duplicateIds.join(', '));
}

const badQuestionTypes = surveyConfig.questions.filter(
  (question) => !supportedQuestionTypes.has(question.type),
);
if (badQuestionTypes.length > 0) {
  fail(
    'Неподдерживаемые типы вопросов: '
      + badQuestionTypes.map((question) => question.id).join(', '),
  );
}

surveyConfig.questions.forEach((question) => {
  const needsOptions = ['radio', 'checkbox', 'select'].includes(question.type);
  if (needsOptions && (!Array.isArray(question.options) || question.options.length === 0)) {
    fail('У вопроса ' + question.id + ' нет options');
  }
});

new Function(
  fs.readFileSync(path.join(rootDir, 'deploy', 'google-sheets-apps-script.js'), 'utf8'),
);

console.log(
  JSON.stringify(
    {
      images: imagePaths.length,
      questions: surveyConfig.questions.length,
      appsScriptSyntax: 'ok',
    },
    null,
    2,
  ),
);

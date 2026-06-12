import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(rootDir, 'content');
const outputDir = path.join(rootDir, 'src', 'generated');
const outputFile = path.join(outputDir, 'siteContent.js');

function readCsv(fileName) {
  const filePath = path.join(contentDir, fileName);
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);
  const usefulLines = lines[0]?.startsWith('sep=') ? lines.slice(1) : lines;
  const headers = splitCsvLine(usefulLines[0]).map((header) => header.trim());

  return usefulLines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  });
}

function splitCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ';' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result.map((value) => value.trim());
}

function keyValue(fileName) {
  return Object.fromEntries(readCsv(fileName).map((row) => [row.key, row.value]));
}

function bool(value) {
  return String(value).toLowerCase() === 'true';
}

function list(value) {
  if (!value) return [];
  return value.split('|').map((item) => item.trim()).filter(Boolean);
}

const site = keyValue('site.csv');
const surveyTexts = keyValue('survey-texts.csv');
const gallery = readCsv('gallery.csv');

const inviteConfig = {
  couple: {
    groom: site['couple.groom'],
    bride: site['couple.bride'],
    short: site['couple.short'],
    display: site['couple.display'],
  },
  date: {
    day: site['date.day'],
    month: site['date.month'],
    year: site['date.year'],
    full: site['date.full'],
  },
  images: {
    hero: '/wedding-hero.png',
    gallery: gallery.map((item) => item.image),
  },
  hero: {
    eyebrow: site['hero.eyebrow'],
    title: site['hero.title'],
    subtitle: site['hero.subtitle'],
    scrollLabel: site['hero.scrollLabel'],
  },
  intro: {
    label: site['intro.label'],
    title: site['intro.title'],
    text: site['intro.text'],
  },
  gallery: {
    label: site['gallery.label'],
    title: site['gallery.title'],
    text: site['gallery.text'],
    items: gallery,
  },
  location: {
    label: site['location.label'],
    title: site['location.title'],
    name: site['location.name'],
    address: site['location.address'],
    note: site['location.note'],
    mapUrl: site['location.mapUrl'],
  },
  program: {
    label: site['program.label'],
    title: site['program.title'],
    items: readCsv('program.csv'),
  },
  dressCode: {
    label: site['dressCode.label'],
    title: site['dressCode.title'],
    palette: list(site['dressCode.palette']),
    women: site['dressCode.women'],
    men: site['dressCode.men'],
  },
  notes: readCsv('notes.csv'),
  closing: site.closing,
};

const surveyConfig = {
  googleScriptUrl: surveyTexts.googleScriptUrl,
  intro: {
    label: surveyTexts.label,
    title: surveyTexts.title,
    deadline: surveyTexts.deadline,
    text: surveyTexts.text,
    openButtonText: surveyTexts.openButtonText,
    modalTitle: surveyTexts.modalTitle,
    modalText: surveyTexts.modalText,
    startButtonText: surveyTexts.startButtonText,
    submitButtonText: surveyTexts.submitButtonText,
    successText: surveyTexts.successText,
    errorText: surveyTexts.errorText,
    notConfiguredText: surveyTexts.notConfiguredText,
  },
  guestFields: readCsv('survey-fields.csv').map((field) => ({
    ...field,
    required: bool(field.required),
  })),
  questions: readCsv('survey-questions.csv').map((question) => ({
    id: question.id,
    title: question.title,
    description: question.description,
    type: question.type,
    required: bool(question.required),
    options: list(question.options),
    placeholder: question.placeholder,
  })),
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(
  outputFile,
  `export const inviteConfig = ${JSON.stringify(inviteConfig, null, 2)};\n\nexport const surveyConfig = ${JSON.stringify(surveyConfig, null, 2)};\n`,
);

console.log('Generated ' + path.relative(rootDir, outputFile));

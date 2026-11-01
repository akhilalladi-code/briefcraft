import { EMPTY_BRIEF, PRESETS, STORAGE_KEY, normalizeBrief, safeFileName, toMarkdown, validateBrief } from './core.js';

const $ = (selector) => document.querySelector(selector);
const form = $('#brief-form');
const preview = $('#brief-preview');
const status = $('#save-status');
const fields = [...form.querySelectorAll('[name]')];
let brief = loadBrief();
let saveTimer;

function loadBrief() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? normalizeBrief(JSON.parse(stored)) : { ...EMPTY_BRIEF };
  } catch {
    return { ...EMPTY_BRIEF };
  }
}

function setStatus(message) {
  status.textContent = message;
}

function applyBrief() {
  fields.forEach((field) => {
    field.value = brief[field.name] ?? '';
  });
  renderPreview();
}

function readForm() {
  fields.forEach((field) => { brief[field.name] = field.value; });
}

function persist() {
  clearTimeout(saveTimer);
  setStatus('Saving…');
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(brief));
      setStatus('Saved on this device');
    } catch {
      setStatus('Could not save in this browser');
    }
  }, 250);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function previewBlock(label, value, list = false) {
  const text = String(value ?? '').trim();
  if (!text) return '';
  const content = list
    ? `<ul>${text.split(/\r?\n/).map((item) => item.trim()).filter(Boolean).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : `<p>${escapeHtml(text).replace(/\n/g, '<br>')}</p>`;
  return `<section class="preview-section"><h3>${escapeHtml(label)}</h3>${content}</section>`;
}

function renderPreview() {
  const meta = [
    ['Type', brief.projectType], ['Brand', brief.brand], ['Owner', brief.owner], ['Due', brief.dueDate]
  ].filter(([, value]) => String(value || '').trim());
  preview.innerHTML = `
    <div class="preview-kicker">CREATIVE BRIEF</div>
    <h2>${escapeHtml(brief.projectName || 'Your project title')}</h2>
    ${meta.length ? `<div class="preview-meta">${meta.map(([key, value]) => `<span><b>${escapeHtml(key)}</b>${escapeHtml(value)}</span>`).join('')}</div>` : ''}
    ${previewBlock('Objective', brief.objective)}
    ${previewBlock('Target audience', brief.audience)}
    ${previewBlock('Key message', brief.keyMessage)}
    ${previewBlock('Deliverables', brief.deliverables, true)}
    ${previewBlock('Channels', brief.channels)}
    ${previewBlock('Tone of voice', brief.tone)}
    ${previewBlock('Visual direction', brief.visualDirection)}
    ${previewBlock('Must include', brief.mandatory)}
    ${previewBlock('Avoid', brief.avoid)}
    ${previewBlock('References', brief.references)}
    ${previewBlock('Budget', brief.budget)}
    ${previewBlock('Additional notes', brief.notes)}
  `;
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportMarkdown() {
  readForm();
  const errors = validateBrief(brief);
  if (errors.length) {
    $('#validation-message').textContent = errors.join(' ');
    $('#validation-message').focus();
    return;
  }
  $('#validation-message').textContent = '';
  download(`${safeFileName(brief.projectName)}.md`, toMarkdown(brief), 'text/markdown;charset=utf-8');
}

function exportJson() {
  readForm();
  download(`${safeFileName(brief.projectName)}.json`, `${JSON.stringify(brief, null, 2)}\n`, 'application/json;charset=utf-8');
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      brief = normalizeBrief(parsed);
      applyBrief();
      persist();
      $('#validation-message').textContent = 'Brief imported successfully.';
    } catch {
      $('#validation-message').textContent = 'That file is not a valid Briefcraft JSON export.';
    }
  };
  reader.readAsText(file);
}

form.addEventListener('input', () => {
  readForm();
  renderPreview();
  persist();
  $('#validation-message').textContent = '';
});

$('#preset-select').addEventListener('change', (event) => {
  const preset = PRESETS[event.target.value];
  if (!preset) return;
  const currentName = brief.projectName;
  const currentBrand = brief.brand;
  brief = { ...preset, projectName: currentName, brand: currentBrand };
  applyBrief();
  persist();
});

$('#export-md').addEventListener('click', exportMarkdown);
$('#export-json').addEventListener('click', exportJson);
$('#print-brief').addEventListener('click', () => window.print());
$('#import-json').addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (file) importJson(file);
  event.target.value = '';
});
$('#reset-brief').addEventListener('click', () => {
  if (!window.confirm('Clear this brief and start again?')) return;
  brief = { ...EMPTY_BRIEF };
  applyBrief();
  persist();
  $('#validation-message').textContent = 'A fresh brief is ready.';
});

applyBrief();
setStatus('Saved on this device');

import test from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_BRIEF, PRESETS, normalizeBrief, safeFileName, toMarkdown, validateBrief } from '../src/core.js';

test('empty brief reports the required fields', () => {
  assert.deepEqual(validateBrief(EMPTY_BRIEF), [
    'Add a project name.',
    'Describe the project objective.',
    'Define the target audience.'
  ]);
});

test('valid brief passes validation', () => {
  const brief = { ...EMPTY_BRIEF, projectName: 'Launch', objective: 'Introduce the product', audience: 'New customers' };
  assert.deepEqual(validateBrief(brief), []);
});

test('normalization drops unknown keys and fills missing values', () => {
  const brief = normalizeBrief({ projectName: 'Test', unexpected: 'discard me' });
  assert.equal(brief.projectName, 'Test');
  assert.equal(brief.objective, EMPTY_BRIEF.objective);
  assert.equal('unexpected' in brief, false);
});

test('preset templates include useful starter deliverables', () => {
  assert.match(PRESETS['Brand identity'].deliverables, /brand guidelines/i);
  assert.match(PRESETS['Video / motion'].deliverables, /thumbnail/i);
});

test('markdown export includes project details and list items', () => {
  const brief = {
    ...EMPTY_BRIEF,
    projectName: 'Spring Launch',
    brand: 'Northstar',
    objective: 'Increase product awareness',
    audience: 'First-time buyers',
    deliverables: 'Main poster\nStory adaptation'
  };
  const markdown = toMarkdown(brief);
  assert.match(markdown, /^# Spring Launch/m);
  assert.match(markdown, /\*\*Brand \/ client:\*\* Northstar/);
  assert.match(markdown, /- Main poster/);
  assert.match(markdown, /- Story adaptation/);
});

test('file names are URL and filesystem friendly', () => {
  assert.equal(safeFileName('Summer Launch 2026!'), 'summer-launch-2026');
  assert.equal(safeFileName('  '), 'creative-brief');
});

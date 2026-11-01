export const STORAGE_KEY = 'briefcraft.project.v1';

export const EMPTY_BRIEF = Object.freeze({
  projectType: 'Social campaign',
  projectName: '',
  brand: '',
  owner: '',
  dueDate: '',
  objective: '',
  audience: '',
  keyMessage: '',
  deliverables: 'Instagram post (1080 × 1350)\nInstagram story (1080 × 1920)',
  channels: 'Instagram',
  tone: 'Confident, clear, and approachable',
  visualDirection: '',
  mandatory: '',
  avoid: '',
  references: '',
  budget: '',
  notes: ''
});

export const PRESETS = {
  'Social campaign': {
    ...EMPTY_BRIEF,
    projectType: 'Social campaign',
    deliverables: 'Instagram post (1080 × 1350)\nInstagram story (1080 × 1920)',
    channels: 'Instagram, Facebook',
    tone: 'Confident, clear, and approachable'
  },
  'Brand identity': {
    ...EMPTY_BRIEF,
    projectType: 'Brand identity',
    deliverables: 'Primary logo\nSecondary logo\nColor palette\nTypography system\nMini brand guidelines',
    channels: 'Print, website, social media',
    tone: 'Distinctive, consistent, and memorable'
  },
  'Print design': {
    ...EMPTY_BRIEF,
    projectType: 'Print design',
    deliverables: 'Print-ready artwork\nWeb preview PDF',
    channels: 'Print',
    tone: 'Clear, legible, and production-ready'
  },
  'Video / motion': {
    ...EMPTY_BRIEF,
    projectType: 'Video / motion',
    deliverables: '16:9 master video\n9:16 social cutdown\nThumbnail / cover',
    channels: 'YouTube, Instagram',
    tone: 'Engaging, energetic, and on-brand'
  }
};

export function validateBrief(brief) {
  const errors = [];
  if (!String(brief.projectName || '').trim()) errors.push('Add a project name.');
  if (!String(brief.objective || '').trim()) errors.push('Describe the project objective.');
  if (!String(brief.audience || '').trim()) errors.push('Define the target audience.');
  if (!String(brief.deliverables || '').trim()) errors.push('List at least one deliverable.');
  return errors;
}

const clean = (value) => String(value ?? '').trim();
const lines = (value) => clean(value).split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

export function toMarkdown(brief) {
  const section = (title, value) => clean(value) ? `## ${title}\n\n${clean(value)}\n` : '';
  const listSection = (title, value) => {
    const items = lines(value);
    return items.length ? `## ${title}\n\n${items.map((item) => `- ${item}`).join('\n')}\n` : '';
  };
  const metadata = [
    ['Project type', brief.projectType],
    ['Brand / client', brief.brand],
    ['Owner', brief.owner],
    ['Due date', brief.dueDate],
    ['Channels', brief.channels],
    ['Budget', brief.budget]
  ].filter(([, value]) => clean(value));

  return [
    `# ${clean(brief.projectName) || 'Untitled creative brief'}`,
    '',
    metadata.length ? metadata.map(([label, value]) => `- **${label}:** ${clean(value)}`).join('\n') : '',
    '',
    section('Objective', brief.objective),
    section('Target audience', brief.audience),
    section('Key message', brief.keyMessage),
    listSection('Deliverables', brief.deliverables),
    section('Tone of voice', brief.tone),
    section('Visual direction', brief.visualDirection),
    section('Mandatory elements', brief.mandatory),
    section('Avoid', brief.avoid),
    section('References', brief.references),
    section('Additional notes', brief.notes)
  ].filter((part, index, all) => part || (index > 0 && all[index - 1] !== '')).join('\n').trim() + '\n';
}

export function normalizeBrief(input = {}) {
  const normalized = {};
  for (const key of Object.keys(EMPTY_BRIEF)) {
    const value = input[key];
    normalized[key] = typeof value === 'string' ? value : EMPTY_BRIEF[key];
  }
  if (!PRESETS[normalized.projectType]) normalized.projectType = 'Social campaign';
  return normalized;
}

export function safeFileName(name) {
  return clean(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'creative-brief';
}

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { loadCareerFacts } = require('./load-career-facts.cjs');

const root = path.resolve(__dirname, '..');
const templatePath = path.join(root, 'docs/resume/yousef-kakhki-resume.tex');

function texEscape(value) {
  const replacements = {
    '\\': '\\textbackslash{}',
    '{': '\\{',
    '}': '\\}',
    '$': '\\$',
    '&': '\\&',
    '#': '\\#',
    '_': '\\_',
    '%': '\\%',
    '~': '\\textasciitilde{}',
    '^': '\\textasciicircum{}',
    '–': '--',
    '—': '---',
    '·': '\\textperiodcentered{}',
  };
  return String(value).replace(/[\\{}$&#_%~^–—·]/g, character => replacements[character]);
}

function roleById(facts, id) {
  const role = facts.roles.find(item => item.id === id);
  if (!role) throw new Error(`missing canonical résumé role: ${id}`);
  if (!role.publish?.resume) throw new Error(`canonical role is not approved for résumé use: ${id}`);
  return role;
}

function educationByDegree(facts, prefix) {
  const education = facts.education.find(item => item.degree.startsWith(prefix));
  if (!education) throw new Error(`missing canonical résumé education: ${prefix}`);
  if (!education.publish?.resume) throw new Error(`education is not approved for résumé use: ${prefix}`);
  return education;
}

function languageByName(facts, name) {
  const language = facts.languages.find(item => item.name === name);
  if (!language?.publish) throw new Error(`language is not approved for résumé use: ${name}`);
  return language;
}

function buildReplacements(facts) {
  const honar = roleById(facts, 'honar-amoozesh');
  const capitalino = roleById(facts, 'capitalino');
  const avin = roleById(facts, 'avin-avisa');
  const batna = roleById(facts, 'batna');
  const azma = roleById(facts, 'azma-data-structure');
  const masters = educationByDegree(facts, 'M.Sc.');
  const bachelors = educationByDegree(facts, 'B.Sc.');
  const english = languageByName(facts, 'English');
  const persian = languageByName(facts, 'Persian');
  const website = new URL(facts.contact.website);
  const linkedin = new URL(facts.contact.linkedin);
  const absoluteResumeUrl = new URL(facts.resume.publicUrl, website).href;

  return {
    NAME: facts.identity.localizedName.en,
    PRIMARY_TITLE: facts.identity.primaryTitle.en,
    LOCATION: facts.contact.location,
    EMAIL: facts.contact.email,
    WEBSITE_URL: website.href,
    WEBSITE_LABEL: website.host,
    LINKEDIN_URL: linkedin.href,
    LINKEDIN_LABEL: linkedin.host + linkedin.pathname.replace(/\/$/, ''),
    BACKEND_EXPERIENCE: facts.metrics.backendExperience.value,
    HONAR_TITLE: honar.title.en,
    HONAR_COMPANY: honar.company,
    HONAR_DATE: honar.publicDate.en,
    HONAR_SUMMARY_1: honar.summary.en[0],
    HONAR_SUMMARY_2: honar.summary.en[1],
    CAPITALINO_TITLE: capitalino.title.en,
    CAPITALINO_COMPANY: capitalino.company,
    CAPITALINO_DATE: capitalino.publicDate.en,
    CAPITALINO_SUMMARY_1: capitalino.summary.en[1],
    CAPITALINO_SUMMARY_2: capitalino.summary.en[2],
    AVIN_TITLE: avin.title.en,
    AVIN_COMPANY: avin.company,
    AVIN_DATE: avin.publicDate.en,
    AVIN_SUMMARY_1: avin.summary.en[0],
    AVIN_SUMMARY_2: avin.summary.en[1],
    BATNA_TITLE: batna.title.en,
    BATNA_COMPANY: batna.company,
    BATNA_DATE: batna.publicDate.en,
    BATNA_SUMMARY_1: batna.summary.en[0],
    AZMA_TITLE: azma.title.en,
    AZMA_COMPANY: azma.company,
    AZMA_DATE: azma.publicDate.en,
    AZMA_SUMMARY_1: azma.summary.en[0],
    MSC_DEGREE: masters.degree,
    MSC_DATE: masters.publicDate,
    MSC_INSTITUTION: masters.institution,
    MSC_LOCATION: masters.location,
    MSC_DETAIL: masters.detail,
    BSC_DEGREE: bachelors.degree,
    BSC_DATE: bachelors.publicDate,
    BSC_INSTITUTION: bachelors.institution,
    BSC_LOCATION: bachelors.location,
    ENGLISH_LEVEL: english.level,
    PERSIAN_LEVEL: persian.level,
    RELOCATION_STATEMENT: facts.relocation.statement.en,
    RESUME_URL: absoluteResumeUrl,
    RESUME_LABEL: `${website.host}${facts.resume.publicUrl}`,
  };
}

function renderTemplate(template, replacements) {
  const rendered = template.replace(/@@([A-Z0-9_]+)@@/g, (token, key) => {
    if (!(key in replacements)) throw new Error(`missing résumé template value: ${key}`);
    return texEscape(replacements[key]);
  });
  const unresolved = rendered.match(/@@[A-Z0-9_]+@@/g);
  if (unresolved) throw new Error(`unresolved résumé template values: ${unresolved.join(', ')}`);
  return rendered;
}

function run() {
  const facts = loadCareerFacts(root);
  const template = fs.readFileSync(templatePath, 'utf8');
  const rendered = renderTemplate(template, buildReplacements(facts));
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'kakhki-resume-'));
  const renderedSource = path.join(temporaryDirectory, 'yousef-kakhki-resume.tex');
  const outputPath = path.join(root, 'public', facts.resume.publicUrl.replace(/^\//, ''));

  try {
    fs.writeFileSync(renderedSource, rendered);
    for (let pass = 0; pass < 2; pass += 1) {
      execFileSync('pdflatex', [
        '-interaction=nonstopmode',
        '-halt-on-error',
        '-output-directory',
        temporaryDirectory,
        renderedSource,
      ], { cwd: root, stdio: 'pipe' });
    }
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.copyFileSync(path.join(temporaryDirectory, 'yousef-kakhki-resume.pdf'), outputPath);
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }

  process.stdout.write(`generated ${path.relative(root, outputPath)} from canonical career facts\n`);
}

if (require.main === module) {
  try {
    run();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = { buildReplacements, renderTemplate, run, texEscape };

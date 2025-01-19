import gitChangelog from '@changesets/changelog-git';

const RELEASE_FOOTER = `

------
Each template has multiple variants available for download, with the filename format being \`{template}.{locale}.{field}.apkg\`

\`\`\`
template:
- mcq: Multiple choice question
- tf: True or false
- basic: Basic Q&A

locale:
- zh: 中文
- en: English

field:
- native: The native Anki field
- markdown: With markdown support, but larger size

\`\`\`


`;

async function getReleaseLine(...args) {
  return (await gitChangelog.getReleaseLine(...args)) + RELEASE_FOOTER;
}

async function getDependencyReleaseLine(...args) {
  return gitChangelog.getDependencyReleaseLine(...args);
}

export { getReleaseLine, getDependencyReleaseLine };

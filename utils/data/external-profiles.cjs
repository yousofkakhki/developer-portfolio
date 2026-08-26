const externalProfiles = Object.freeze({
  github: Object.freeze({
    id: 'github',
    url: 'https://github.com/yousofkakhki',
    approvedForGlobalBranding: false,
  }),
  linkedIn: Object.freeze({
    id: 'linkedin',
    url: 'https://www.linkedin.com/in/yousefkakhki/',
    approvedForGlobalBranding: true,
  }),
});

function getApprovedGlobalProfiles() {
  return Object.values(externalProfiles).filter(profile => profile.approvedForGlobalBranding);
}

module.exports = { externalProfiles, getApprovedGlobalProfiles };

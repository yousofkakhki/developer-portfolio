// Legacy data export kept for consumers outside the localized homepage.
// Public career facts are owned by career-facts.js.
import { careerFacts } from './career-facts';

export const experiences = careerFacts.roles.map((role) => ({
  id: role.id,
  title: role.title.en,
  company: role.company,
  duration: `(${role.publicDate.en})`,
  tech: role.technologies.join(', '),
  description: role.summary.en.slice(),
}));

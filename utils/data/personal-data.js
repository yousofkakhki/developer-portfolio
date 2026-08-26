import { careerFacts, localized } from './career-facts';
import profileConfig from './external-profiles.cjs';

const { externalProfiles } = profileConfig;

export const personalData = {
  name: "Yousef Kakhki",
  profile: '/profile.png',
  designation: localized(careerFacts.identity.primaryTitle, 'en'),
  title: "Distributed systems, real-time media, and backend platforms.",
  description: localized(careerFacts.identity.description, 'en'),
  about: `I am a hands-on senior backend engineer and technical lead with 10+ years of experience across distributed systems, real-time media, fintech, and embedded Linux. I work with Node.js, Go, Python, PostgreSQL, Kafka, NATS JetStream, WebRTC, LiveKit, and Linux.

My strongest work sits where architecture and implementation meet: defining ownership, failure modes, consistency requirements, and operational constraints before scaling the system. I have led engineering teams while continuing to contribute directly to production code.

I am currently targeting senior backend, platform, and technical-lead roles in the EU, with employer-supported relocation to Germany or the Netherlands and selected remote engineering or architecture engagements.`,
  email: 'me@kakhki.me',
  phone: '+989038158460',
  address: 'Tehran, Iran',
  github: externalProfiles.github.url,
  facebook: 'https://www.facebook.com/joseph_reborn/',
  linkedIn: externalProfiles.linkedIn.url,
  twitter: 'https://twitter.com/',
  stackOverflow: 'asdf',
  leetcode: "asdf",
  devUsername: "josef",
  resume: careerFacts.resume.publicUrl
};

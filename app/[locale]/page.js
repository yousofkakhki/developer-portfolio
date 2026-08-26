import AboutSection from "../components/homepage/about";
import Blog from "../components/homepage/blog";
import ContactSection from "../components/homepage/contact";
import Education from "../components/homepage/education";
import EngagementCta from "../components/homepage/engagement-cta";
import ERPExpertise from "../components/homepage/erp-expertise";
import Experience from "../components/homepage/experience";
import HeroSection from "../components/homepage/hero-section";
import Projects from "../components/homepage/projects";
import Skills from "../components/homepage/skills";
import { getLocalBlogs } from "@/utils/data/local-blogs";

export default async function Home({ params }) {
  const { locale } = await params;
  const blogs = getLocalBlogs(locale);

  return (
    <div suppressHydrationWarning className="brand-home min-h-screen">
      <HeroSection />
      <Projects />
      <Experience />
      <Blog blogs={blogs} />
      <AboutSection />
      <Skills />
      <ERPExpertise />
      <Education />
      <EngagementCta />
      <ContactSection />
    </div>
  );
}

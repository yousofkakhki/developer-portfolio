import AboutSection from "../components/homepage/about";
import Blog from "../components/homepage/blog";
import ContactSection from "../components/homepage/contact";
import Education from "../components/homepage/education";
import Experience from "../components/homepage/experience";
import HeroSection from "../components/homepage/hero-section";
import Projects from "../components/homepage/projects";
import Skills from "../components/homepage/skills";
import Testimonials from "../components/homepage/testimonials";
import { getLocalBlogs } from "@/utils/data/local-blogs";

export default async function Home({ params }) {
  const { locale } = await params;
  const blogs = getLocalBlogs(locale);

  return (
    <div suppressHydrationWarning>
      <HeroSection />
      <AboutSection />
      <Experience />
      <Skills />
      <Projects />
      <Testimonials />
      <Education />
      <Blog blogs={blogs} />
      <ContactSection />
    </div>
  );
}

import { personalData } from "@/utils/data/personal-data";
import AboutSection from "../components/homepage/about";
import Blog from "../components/homepage/blog";
import ContactSection from "../components/homepage/contact";
import Education from "../components/homepage/education";
import Experience from "../components/homepage/experience";
import HeroSection from "../components/homepage/hero-section";
import Projects from "../components/homepage/projects";
import Skills from "../components/homepage/skills";
import Testimonials from "../components/homepage/testimonials"; // 1. IMPORT THE NEW COMPONENT

async function getData() {
  try {
    const res = await fetch(`https://dev.to/api/articles?username=${personalData.devUsername}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!res.ok) {
      console.warn('Failed to fetch blog data from dev.to');
      return []; // Return empty array instead of throwing
    }

    const data = await res.json();
    const filtered = data.filter((item) => item?.cover_image).sort(() => Math.random() - 0.5);
    return filtered;
  } catch (error) {
    console.warn('Error fetching blog data:', error);
    return []; // Return empty array on error
  }
};

export default async function Home() {
  const blogs = await getData(); // 

  return (
    <div suppressHydrationWarning >
      <HeroSection />
      <AboutSection />
      <Experience />
      <Skills />
      <Projects />
      <Testimonials /> {/* 2. ADD THE COMPONENT HERE */}
      <Education />
      <Blog blogs={blogs} />
      <ContactSection />
    </div>
  )
};
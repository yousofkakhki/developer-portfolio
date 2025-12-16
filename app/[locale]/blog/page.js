// @flow strict
import { personalData } from "@/utils/data/personal-data";
import { getTranslations } from 'next-intl/server';
import BlogCard from "../../components/homepage/blog/blog-card";

async function getBlogs() {
  const res = await fetch(`https://dev.to/api/articles?username=${personalData.devUsername}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  const data = await res.json();
  return data;
};

async function page() {
  const blogs = await getBlogs();
  const t = await getTranslations('nav');

  return (
    <div className="py-8">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-gradient-to-r from-transparent to-[#1a1443]"></span>
          <span className="bg-gradient-to-br from-[#1a1443] to-[#25213b] w-fit text-white p-2 px-5 text-2xl rounded-md border border-[#16f2b3]/20 shadow-lg">
            {t('allBlogs') || 'All Blogs'}
          </span>
          <span className="w-24 h-[2px] bg-gradient-to-l from-transparent to-[#1a1443]"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
        {
          blogs.map((blog, i) => (
            blog?.cover_image &&
            <BlogCard blog={blog} key={i} />
          ))
        }
      </div>
    </div>
  );
}

export default page;
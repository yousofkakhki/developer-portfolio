"use client";

import { memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import { useLocale } from 'next-intl';

// Import Swiper styles (these are small and can be loaded eagerly)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * Optimized Swiper carousel component for project images with RTL support
 * @param {Object} props
 * @param {string[]} props.images - Array of image URLs
 * @param {string} props.projectName - Name of the project for alt text
 */
const ProjectCardSwiper = memo(function ProjectCardSwiper({ images, projectName }) {
  const locale = useLocale();
  const isRTL = locale === 'fa';

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      dir={isRTL ? 'rtl' : 'ltr'}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper h-full w-full"
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={img}
              alt={`${projectName} screenshot ${index + 1}`}
              width={1000}
              height={600}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110"
              loading={index === 0 ? "eager" : "lazy"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
              quality={85}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
});

ProjectCardSwiper.displayName = 'ProjectCardSwiper';

export default ProjectCardSwiper;


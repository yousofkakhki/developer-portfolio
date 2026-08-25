"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { useTranslations } from 'next-intl';

const DEFAULT_BTN_CLS =
  "brand-scroll-top fixed bottom-5 end-4 z-[100] flex min-h-[44px] min-w-[44px] items-center justify-center border p-0 transition-colors sm:bottom-8 sm:end-6";
const SCROLL_THRESHOLD = 480;

const ScrollToTop = () => {
  const t = useTranslations('common');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > Math.max(SCROLL_THRESHOLD, window.innerHeight * 0.75));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const onClickBtn = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      className={`${DEFAULT_BTN_CLS} ${isVisible ? '' : 'hidden'}`}
      onClick={onClickBtn}
      aria-label={t('scrollToTop')}
    >
      <FaArrowUp />
    </button>
  );
};

export default ScrollToTop;

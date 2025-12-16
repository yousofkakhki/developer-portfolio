"use client";

import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * Implements Intersection Observer API for performance
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Root margin for intersection
 * @param {boolean} options.triggerOnce - Whether to trigger only once
 * @returns {[React.RefObject, boolean]} - Ref and revealed state
 */
export function useScrollReveal(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
  } = options;

  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || (triggerOnce && isRevealed)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsRevealed(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce, isRevealed]);

  return [elementRef, isRevealed];
}

/**
 * Hook for staggered animations (for lists)
 */
export function useStaggerReveal(count, options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    staggerDelay = 100,
  } = options;

  const [revealedItems, setRevealedItems] = useState(new Set());
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setRevealedItems((prev) => {
                const newSet = new Set(prev);
                newSet.add(index);
                return newSet;
              });
            }, index * staggerDelay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const children = container.children;
    Array.from(children).forEach((child) => {
      observer.observe(child);
    });

    return () => {
      Array.from(children).forEach((child) => {
        observer.unobserve(child);
      });
    };
  }, [count, threshold, rootMargin, staggerDelay]);

  return [containerRef, revealedItems];
}


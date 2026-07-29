'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export function trackConversion(event, { source = '' } = {}) {
  if (typeof window === 'undefined') return;

  let referrerHost = '';
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname : '';
  } catch {
    referrerHost = '';
  }

  const locale = window.location.pathname.split('/')[1] === 'fa' ? 'fa' : 'en';
  const payload = {
    event,
    path: window.location.pathname,
    locale,
    source,
    referrerHost,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, conversion_source: source, page_path: payload.path, locale });

  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', new Blob([body], { type: 'application/json' }));
  } else {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}

export function ConversionView({ eventName, source }) {
  useEffect(() => {
    trackConversion(eventName, { source });
  }, [eventName, source]);
  return null;
}

export function ConversionLink({ eventName, source, href, children, ...props }) {
  const handleClick = () => trackConversion(eventName, { source });
  const external = href.startsWith('http') || href.startsWith('mailto:') || props.target === '_blank';

  if (external) {
    return <a href={href} onClick={handleClick} {...props}>{children}</a>;
  }

  return <Link href={href} onClick={handleClick} {...props}>{children}</Link>;
}

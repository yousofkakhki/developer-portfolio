// @flow strict
"use client";

import { personalData } from '@/utils/data/personal-data';
import { isValidEmail } from '@/utils/check-email';
import { useState, memo } from 'react';
import { useTranslations } from 'next-intl';
import { ConversionLink, trackConversion } from '../../analytics/conversion-link';
import { BiLogoLinkedin } from "react-icons/bi";
import { IoLogoGithub } from "react-icons/io";
import { MdAlternateEmail } from "react-icons/md";

const EMPTY_INPUT = { name: "", email: "", message: "" };

function ContactForm() {
  const t = useTranslations('contact');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [userInput, setUserInput] = useState(EMPTY_INPUT);

  const getFieldError = (field, value) => {
    const trimmed = value.trim();
    if (!trimmed) return t(`${field}Required`);
    if (field === 'email' && !isValidEmail(trimmed)) return t('emailInvalid');
    return '';
  };

  const validateField = (field, value) => {
    const fieldError = getFieldError(field, value);
    setErrors((current) => {
      if (fieldError) return { ...current, [field]: fieldError };
      const { [field]: _removed, ...remaining } = current;
      return remaining;
    });
    return fieldError;
  };

  const handleChange = (field, value) => {
    setUserInput((current) => ({ ...current, [field]: value }));
    if (errors[field]) validateField(field, value);
  };

  const handleSendMail = async (event) => {
    event.preventDefault();
    const nextErrors = Object.fromEntries(
      Object.entries(userInput)
        .map(([field, value]) => [field, getFieldError(field, value)])
        .filter(([, fieldError]) => fieldError)
    );

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setIsLoading(true);
      setStatus({ type: '', message: '' });
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInput),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || t('messageSendFailed'));

      setStatus({ type: 'success', message: t('messageSentSuccess') });
      trackConversion('contact_submit', { source: 'homepage_contact' });
      setUserInput(EMPTY_INPUT);
      setErrors({});
    } catch (error) {
      setStatus({ type: 'error', message: error.message || t('messageSendFailed') });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName = (field) => `w-full bg-slate-800 border rounded px-3 py-2 text-slate-100 focus:border-slate-400 focus:outline-none transition-colors ${
    errors[field] ? 'border-red-400' : 'border-slate-700'
  }`;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSendMail} className="space-y-4" noValidate aria-busy={isLoading}>
      {hasErrors && (
        <p role="alert" className="rounded border border-red-400/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          {t('formHasErrors')}
        </p>
      )}

      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm text-slate-400">
          {t('yourName')}
        </label>
        <input
          id="contact-name"
          name="name"
          className={inputClassName('name')}
          type="text"
          maxLength="100"
          required
          autoComplete="name"
          onChange={(event) => handleChange('name', event.target.value)}
          onBlur={(event) => validateField('name', event.target.value)}
          value={userInput.name}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
        />
        {errors.name && <p id="contact-name-error" className="mt-1 text-sm text-red-300">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-1 block text-sm text-slate-400">
          {t('yourEmail')}
        </label>
        <input
          id="contact-email"
          name="email"
          className={inputClassName('email')}
          type="email"
          maxLength="100"
          required
          autoComplete="email"
          onChange={(event) => handleChange('email', event.target.value)}
          onBlur={(event) => validateField('email', event.target.value)}
          value={userInput.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
        />
        {errors.email && <p id="contact-email-error" className="mt-1 text-sm text-red-300">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm text-slate-400">
          {t('yourMessage')}
        </label>
        <textarea
          id="contact-message"
          name="message"
          className={inputClassName('message')}
          maxLength="500"
          required
          autoComplete="off"
          onChange={(event) => handleChange('message', event.target.value)}
          onBlur={(event) => validateField('message', event.target.value)}
          rows="4"
          value={userInput.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
        />
        {errors.message && <p id="contact-message-error" className="mt-1 text-sm text-red-300">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex min-h-[44px] w-full items-center justify-center rounded bg-cyan-700 px-4 py-3 text-white transition-colors hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? t('sendingMessage') : t('sendMessage')}
      </button>

      {status.message && (
        <p role="status" aria-live="polite" className={`mt-3 text-sm ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {status.message}
        </p>
      )}
    </form>
  );
}

function Contact() {
  const t = useTranslations('contact');
  const tCommon = useTranslations('common');

  return (
    <section id="contact" className="px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-3xl font-semibold text-slate-100">{t('title')}</h2>
        <p className="mb-12 max-w-2xl text-slate-400">{t('description')}</p>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded border border-slate-700 bg-slate-800/50 p-6">
            <ContactForm />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-mono uppercase tracking-wide text-slate-400">{t('directContact')}</h3>
              <ConversionLink
                eventName="contact_email_click"
                source="homepage_contact"
                href={`mailto:${personalData.email}`}
                className="inline-flex min-h-[44px] items-center gap-3 text-slate-400 transition-colors hover:text-slate-200"
              >
                <MdAlternateEmail size={20} />
                <span>{personalData.email}</span>
              </ConversionLink>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-mono uppercase tracking-wide text-slate-400">{t('profiles')}</h3>
              <div className="flex items-center gap-3">
                {personalData.github && (
                  <ConversionLink
                    eventName="github_click"
                    source="homepage_contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={personalData.github}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-slate-400 transition-colors hover:text-slate-200"
                    aria-label={`${t('githubProfile')} (${tCommon('opensInNewTab')})`}
                  >
                    <IoLogoGithub size={24} />
                  </ConversionLink>
                )}
                {personalData.linkedIn && (
                  <ConversionLink
                    eventName="linkedin_click"
                    source="homepage_contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={personalData.linkedIn}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-slate-400 transition-colors hover:text-slate-200"
                    aria-label={`${t('linkedinProfile')} (${tCommon('opensInNewTab')})`}
                  >
                    <BiLogoLinkedin size={24} />
                  </ConversionLink>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-mono uppercase tracking-wide text-slate-400">{t('location')}</h3>
              <p className="text-slate-400">{t('locationValue')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Contact);

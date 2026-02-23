// @flow strict
"use client";

import { personalData } from '@/utils/data/personal-data';
import { isValidEmail } from '@/utils/check-email';
import axios from "axios";
import Link from 'next/link';
import { useState, memo } from 'react';
import { useTranslations } from 'next-intl';
import { BiLogoLinkedin } from "react-icons/bi";
import { IoLogoGithub } from "react-icons/io";
import { MdAlternateEmail } from "react-icons/md";
import { toast } from "react-toastify";

function ContactForm() {
  const t = useTranslations('contact');
  const [error, setError] = useState({ email: false, required: false });
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  const checkRequired = () => {
    if (userInput.email && userInput.message && userInput.name) {
      setError({ ...error, required: false });
    }
  };

  const handleSendMail = async (e) => {
    e.preventDefault();

    if (!userInput.email || !userInput.message || !userInput.name) {
      setError({ ...error, required: true });
      return;
    } else if (error.email) {
      return;
    } else {
      setError({ ...error, required: false });
    }

    try {
      setIsLoading(true);
      await axios.post('/api/contact', userInput);
      toast.success(t('messageSentSuccess'));
      setUserInput({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || t('messageSendFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSendMail} className="space-y-4" noValidate>
      <div>
        <label htmlFor="contact-name" className="block text-sm text-slate-400 mb-1">
          {t('yourName')}
        </label>
        <input
          id="contact-name"
          name="name"
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-slate-500 focus:outline-none transition-colors"
          type="text"
          maxLength="100"
          required
          autoComplete="name"
          onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
          onBlur={checkRequired}
          value={userInput.name}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm text-slate-400 mb-1">
          {t('yourEmail')}
        </label>
        <input
          id="contact-email"
          name="email"
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-slate-500 focus:outline-none transition-colors"
          type="email"
          maxLength="100"
          required
          autoComplete="email"
          value={userInput.email}
          onChange={(e) => setUserInput({ ...userInput, email: e.target.value })}
          onBlur={() => {
            checkRequired();
            setError({ ...error, email: !isValidEmail(userInput.email) });
          }}
        />
        {error.email && <p className="text-sm text-red-400 mt-1">{t('validEmail')}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm text-slate-400 mb-1">
          {t('yourMessage')}
        </label>
        <textarea
          id="contact-message"
          name="message"
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-slate-500 focus:outline-none transition-colors"
          maxLength="500"
          required
          autoComplete="off"
          onChange={(e) => setUserInput({ ...userInput, message: e.target.value })}
          onBlur={checkRequired}
          rows="4"
          value={userInput.message}
        />
      </div>

      {error.required && (
        <p className="text-sm text-red-400">{t('allFieldsRequired')}</p>
      )}

      <button
        type="submit"
        className="px-6 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded hover:bg-slate-600 transition-colors disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? t('sendingMessage') : t('sendMessage')}
      </button>
    </form>
  );
}

function ContactSection() {
  const t = useTranslations('contact');
  
  return (
    <section id="contact" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-slate-100 mb-8">
          {t('title')}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <p className="text-slate-400 mb-6">{t('description')}</p>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-mono text-slate-500 mb-3 uppercase tracking-wide">
                Direct Contact
              </h3>
              <a 
                href={`mailto:${personalData.email}`}
                className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <MdAlternateEmail size={20} />
                <span>{personalData.email}</span>
              </a>
            </div>

            <div>
              <h3 className="text-sm font-mono text-slate-500 mb-3 uppercase tracking-wide">
                Profiles
              </h3>
              <div className="flex items-center gap-4">
                {personalData.github && (
                  <Link 
                    target="_blank" 
                    href={personalData.github}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <IoLogoGithub size={24} />
                  </Link>
                )}
                {personalData.linkedIn && (
                  <Link 
                    target="_blank" 
                    href={personalData.linkedIn}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <BiLogoLinkedin size={24} />
                  </Link>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-mono text-slate-500 mb-3 uppercase tracking-wide">
                Location
              </h3>
              <p className="text-slate-400">{personalData.address}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(ContactSection);


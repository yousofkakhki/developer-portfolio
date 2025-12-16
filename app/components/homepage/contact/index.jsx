// @flow strict
"use client";

import { personalData } from '@/utils/data/personal-data';
import { isValidEmail } from '@/utils/check-email';
import axios from "axios";
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BiLogoLinkedin } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import { IoLogoGithub, IoMdCall } from "react-icons/io";
import { MdAlternateEmail } from "react-icons/md";
import { TbMailForward } from "react-icons/tb";
import { toast } from "react-toastify";

// This is the self-contained form component
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
    };

    try {
      setIsLoading(true);
      // NOTE: You will need to create an API route at /api/contact for this to work.
      const res = await axios.post('/api/contact', userInput);
      toast.success(t('messageSentSuccess'));
      setUserInput({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || t('messageSendFailed'));
    } finally {
      setIsLoading(false);
    };
  };

  return (
    <div>
      <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">{t('title')}</p>
      <div className="max-w-3xl text-white rounded-lg border border-[#464c6a] p-3 lg:p-5">
        <p className="text-sm text-[#d3d8e8]">{t('description')}</p>
        <form onSubmit={handleSendMail} className="mt-6 flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-name" className="text-base">{t('yourName')} </label>
            <input
              id="contact-name"
              name="name"
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
              type="text"
              maxLength="100"
              required={true}
              autoComplete="name"
              onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
              onBlur={checkRequired}
              value={userInput.name}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="contact-email" className="text-base">{t('yourEmail')} </label>
            <input
              id="contact-email"
              name="email"
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
              type="email"
              maxLength="100"
              required={true}
              autoComplete="email"
              value={userInput.email}
              onChange={(e) => setUserInput({ ...userInput, email: e.target.value })}
              onBlur={() => {
                checkRequired();
                setError({ ...error, email: !isValidEmail(userInput.email) });
              }}
            />
            {error.email && <p className="text-sm text-red-400">{t('validEmail')}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="contact-message" className="text-base">{t('yourMessage')} </label>
            <textarea
              id="contact-message"
              name="message"
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
              maxLength="500"
              required={true}
              autoComplete="off"
              onChange={(e) => setUserInput({ ...userInput, message: e.target.value })}
              onBlur={checkRequired}
              rows="4"
              value={userInput.message}
            />
          </div>
          <div className="flex flex-col items-center gap-3">
            {error.required && <p className="text-sm text-red-400">
              {t('allFieldsRequired')}
            </p>}
            <button
              type="submit"
              className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-5 md:px-12 py-2.5 md:py-3 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold"
              disabled={isLoading}
            >
              {
                isLoading ?
                <span>{t('sendingMessage')}</span>:
                <span className="flex items-center gap-1">
                  {t('sendMessage')}
                  <TbMailForward size={20} />
                </span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// This is the main section component, now cleaned up
function ContactSection() {
  const t = useTranslations('contact');
  
  return (
    <div id="contact" className="my-12 lg:my-16 relative mt-24 text-white">
      <div className="hidden lg:flex flex-col items-center absolute top-24 -end-8">
        <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">
          {t('sidebar')}
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <ContactForm />

        <div className="lg:w-3/4 ">
          <div className="flex flex-col gap-5 lg:gap-9">
            <a 
              href={`mailto:${personalData.email}`}
              className="text-sm md:text-xl flex items-center gap-3 hover:text-[#16f2b3] transition-colors duration-300"
            >
              <MdAlternateEmail
                className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                size={36}
              />
              <span>{personalData.email}</span>
            </a>
            <a 
              href={`tel:${personalData.phone}`}
              className="text-sm md:text-xl flex items-center gap-3 hover:text-[#16f2b3] transition-colors duration-300"
            >
              <IoMdCall
                className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                size={36}
              />
              <span>
                {personalData.phone}
              </span>
            </a>
            <p className="text-sm md:text-xl flex items-center gap-3">
              <CiLocationOn
                className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                size={36}
              />
              <span>
                {personalData.address}
              </span>
            </p>
          </div>
          <div className="mt-8 lg:mt-16 flex items-center gap-5 lg:gap-10">
            {personalData.github && (
              <Link target="_blank" href={personalData.github}>
                <IoLogoGithub
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                />
              </Link>
            )}
            {personalData.linkedIn && (
              <Link target="_blank" href={personalData.linkedIn}>
                <BiLogoLinkedin
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                />
              </Link>
            )}
            {/* The links for Twitter, Facebook, and Stack Overflow have been removed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;


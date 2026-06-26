import { useState, useEffect } from 'react';
import { getSocialLinks, getSettings } from '../services/api';

const faqs = [
  {
    question: 'What technologies do you work with?',
    answer: 'I primarily use React, Node.js, Express, and MongoDB for fullstack development. I also work with Tailwind CSS, Figma for design, and various modern tools.',
    icon: 'code',
  },
  {
    question: 'Are you available for freelance?',
    answer: 'Yes! I\'m currently open to freelance projects and collaborations. Feel free to reach out through the contact form or email me directly.',
    icon: 'work',
  },
  {
    question: 'How can I reach you?',
    answer: 'You can contact me via email at daniswara.ranggamukti@gmail.com, or connect with me on LinkedIn and GitHub. I usually respond within 24 hours.',
    icon: 'mail',
  },
  {
    question: 'What kind of projects do you take?',
    answer: 'I love working on web applications, portfolio sites, dashboards, and API development. I\'m especially passionate about projects that challenge me to learn something new.',
    icon: 'rocket_launch',
  },
];

const initialQuickLinks = [
  { label: 'Email', href: '#', icon: 'mail' },
  { label: 'GitHub', href: 'https://github.com/ranggamuktii', icon: 'code' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ranggamuktii', icon: 'person' },
];

function QuickContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [quickLinks, setQuickLinks] = useState(initialQuickLinks);

  useEffect(() => {
    Promise.all([getSettings(), getSocialLinks()]).then(([settingsData, socialData]) => {
      let emailLink = 'mailto:daniswara.ranggamukti@gmail.com';
      if (settingsData && settingsData.contact_email) {
        emailLink = `mailto:${settingsData.contact_email}`;
      }
      
      const newLinks = [
        { label: 'Email', href: emailLink, icon: 'mail' }
      ];

      const github = socialData.find(s => s.platform.toLowerCase() === 'github');
      if (github) newLinks.push({ label: 'GitHub', href: github.href, icon: 'code' });

      const linkedin = socialData.find(s => s.platform.toLowerCase() === 'linkedin');
      if (linkedin) newLinks.push({ label: 'LinkedIn', href: linkedin.href, icon: 'person' });

      setQuickLinks(newLinks);
    }).catch(console.error);
  }, []);

  const handleToggle = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
        setExpandedFaq(null);
      }, 250);
    } else {
      setIsOpen(true);
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={handleToggle}
        className="group fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white rounded-full shadow-2xl shadow-sky-500/30 transition-all duration-250 hover:scale-105 active:scale-[0.97] grid place-items-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-zinc-900 border border-white/20"
        aria-label={isOpen ? 'Close quick contact' : 'Open quick contact'}
        title={isOpen ? 'Close' : 'Quick Contact'}
      >
        <span className="material-symbols-rounded text-2xl transition-transform duration-250 ease-in-out">
          {isOpen ? 'close' : 'help'}
        </span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-24 sm:bottom-28 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-md bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-zinc-950/50 flex flex-col overflow-hidden ${
            isClosing ? 'animate-slideDownFade' : 'animate-slideUpFade'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="relative z-10">
              <h3 className="font-bold text-white text-lg">Quick Contact</h3>
              <p className="text-white/80 text-xs mt-0.5">FAQ & quick links</p>
            </div>
          </div>

          {/* FAQ items */}
          <div className="flex-1 p-4 space-y-2 overflow-y-auto max-h-80 sm:max-h-96 scrollbar-thin scrollbar-thumb-zinc-700/50 scrollbar-track-transparent">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center gap-3 p-3 bg-zinc-800/60 hover:bg-zinc-800 rounded-xl transition-colors text-left group"
                >
                  <span className="material-symbols-rounded text-sky-400 text-lg shrink-0">
                    {faq.icon}
                  </span>
                  <span className="text-sm text-zinc-200 flex-1">{faq.question}</span>
                  <span
                    className={`material-symbols-rounded text-zinc-500 text-lg transition-transform duration-200 ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="px-3 pb-3 pt-1 bg-zinc-800/30 mx-1 mb-1 rounded-b-lg">
                    <p className="text-xs text-zinc-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div className="px-4 py-3 border-t border-white/5 bg-zinc-900/50">
            <p className="text-xs font-semibold text-zinc-500 mb-2 flex items-center gap-1.5">
              <span className="material-symbols-rounded text-sm">link</span>
              Quick links
            </p>
            <div className="flex gap-2">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs bg-zinc-800/60 hover:bg-sky-500/20 border border-white/5 hover:border-sky-400/30 text-zinc-300 hover:text-sky-300 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <span className="material-symbols-rounded text-sm">{link.icon}</span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QuickContact;

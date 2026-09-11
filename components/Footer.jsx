"use client";

import React from "react";

function FacebookIcon(props) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
      <title>Facebook</title>
      <path d="M14,6h3a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H14A5,5,0,0,0,9,7v3H7a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1H9v7a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V14h2.22a1,1,0,0,0,1-.76l.5-2a1,1,0,0,0-1-1.24H13V7A1,1,0,0,1,14,6Z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
      <title>Instagram</title>
      <path d="M17.34,5.46h0a1.2,1.2,0,1,0,1.2,1.2A1.2,1.2,0,0,0,17.34,5.46Zm4.6,2.42a7.59,7.59,0,0,0-.46-2.43,4.94,4.94,0,0,0-1.16-1.77,4.7,4.7,0,0,0-1.77-1.15,7.3,7.3,0,0,0-2.43-.47C15.06,2,14.72,2,12,2s-3.06,0-4.12.06a7.3,7.3,0,0,0-2.43.47A4.78,4.78,0,0,0,3.68,3.68,4.7,4.7,0,0,0,2.53,5.45a7.3,7.3,0,0,0-.47,2.43C2,8.94,2,9.28,2,12s0,3.06.06,4.12a7.3,7.3,0,0,0,.47,2.43,4.7,4.7,0,0,0,1.15,1.77,4.78,4.78,0,0,0,1.77,1.15,7.3,7.3,0,0,0,2.43.47C8.94,22,9.28,22,12,22s3.06,0,4.12-.06a7.3,7.3,0,0,0,2.43-.47,4.7,4.7,0,0,0,1.77-1.15,4.85,4.85,0,0,0,1.16-1.77,7.59,7.59,0,0,0,.46-2.43c0-1.06.06-1.4.06-4.12S22,8.94,21.94,7.88ZM20.14,16a5.61,5.61,0,0,1-.34,1.86,3.06,3.06,0,0,1-.75,1.15,3.19,3.19,0,0,1-1.15.75,5.61,5.61,0,0,1-1.86.34c-1,.05-1.37.06-4,.06s-3,0-4-.06A5.73,5.73,0,0,1,6.1,19.8,3.27,3.27,0,0,1,5,19.05a3,3,0,0,1-.74-1.15A5.54,5.54,0,0,1,3.86,16c0-1-.06-1.37-.06-4s0-3,.06-4A5.54,5.54,0,0,1,4.21,6.1,3,3,0,0,1,5,5,3.14,3.14,0,0,1,6.1,4.2,5.73,5.73,0,0,1,8,3.86c1,0,1.37-.06,4-.06s3,0,4,.06a5.61,5.61,0,0,1,1.86.34A3.06,3.06,0,0,1,19.05,5,3.06,3.06,0,0,1,19.8,6.1,5.61,5.61,0,0,1,20.14,8c.05,1,.06,1.37.06,4S20.19,15,20.14,16ZM12,6.87A5.13,5.13,0,1,0,17.14,12,5.12,5.12,0,0,0,12,6.87Zm0,8.46A3.33,3.33,0,1,1,15.33,12,3.33,3.33,0,0,1,12,15.33Z" />
    </svg>
  );
}

function PinterestIcon(props) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
      <title>Pinterest</title>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
    </svg>
  );
}

function MapPinIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="M12 21s6-5.3 6-11a6 6 0 0 0-12 0c0 5.7 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

function WhatsAppIcon(props) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
      <title>WhatsApp</title>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const contactLinks = [
  {
    icon: <FacebookIcon className="h-5 w-5 text-[#858180]" />,
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100083338509379",
  },
  {
    icon: <InstagramIcon className="h-5 w-5 text-[#858180]" />,
    label: "Instagram",
    href: "https://www.instagram.com/montabox_vidros/",
  },
  {
    icon: <PinterestIcon className="h-5 w-5 text-[#858180]" />,
    label: "Pinterest",
    href: "https://br.pinterest.com/montabox_vidros/",
  },
  {
    icon: <MapPinIcon className="h-7 w-7 text-[#858180]" />,
    label: "Maps",
    href: "https://share.google/e7G9PhQQ1gHud9Q6f",
  },
  {icon: <WhatsAppIcon className="h-5 w-5 text-[#858180]" />, label: "WhatsApp", href: "https://wa.me/5516981984000"},
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative m-4 sm:m-8 overflow-hidden rounded-2xl sm:rounded-3xl border-t border-white/5 bg-[#0F0F11]/10">
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-12 sm:py-14 lg:px-20">
        <div className="grid grid-cols-1 gap-10 pb-10 sm:gap-12 sm:pb-12 md:grid-cols-3 md:gap-8 lg:gap-16">
          <div className="flex max-w-xs flex-col space-y-3 sm:space-y-4">
            <div className="flex flex-col">
              <span className="text-[1.65rem] sm:text-[2.0625rem] font-black uppercase leading-none tracking-tight text-white">
                Montabox
              </span>
              <span className="text-sm font-light uppercase tracking-tight text-[#acaba9]">
                Vidraçaria e Serralheria de Alumínio
              </span>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-[0.6rem] uppercase tracking-[0.3em] text-[#858180]">Contatos</h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {contactLinks.map(({icon, label, href}) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white transition-colors hover:text-[#3ca2fa]">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div className="text-[#d1d1d1]">
            <h2 className="mb-2 text-[0.7rem] uppercase tracking-[0.3em] text-[#858180]">Endereço</h2>
            <p className="text-[0.6rem] font-light uppercase tracking-widest text-[#acaba9] transition-colors duration-300">
              R. Virgílio Pedro Ribeiro, 70 - Planalto Itália, Jaboticabal - SP
              <br />
              CEP: 14890-448
            </p>
            <div className="mt-6">
              <h3 className="mb-2 text-[0.7rem] uppercase tracking-[0.3em] text-[#858180]">Horário</h3>
              <p className="text-[0.6rem] font-light uppercase tracking-widest text-[#acaba9] transition-colors duration-300">
                Das 07:30 às 17:30 — segunda a sexta
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-white/5 pt-6 sm:mt-12 sm:items-center sm:gap-6 md:flex-row md:pt-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-[#858180]">© {currentYear} Montabox</span>
            <span className="h-1 w-1 rounded-full bg-white/10" />
            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-[#858180]">Vidraçaria e Serralheria</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-[#858180]">Design by</span>
            <a
              href="https://www.instagram.com/bms_trafego/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#acaba9] transition-colors hover:text-white">
              BMS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

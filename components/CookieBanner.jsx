"use client";

import {useEffect, useState} from "react";
import Link from "next/link";

const STORAGE_KEY = "montabox-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function save(choice) {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // se o navegador bloquear o armazenamento, o banner apenas fecha
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="font-neuehaas fixed bottom-4 left-4 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-[5px] border border-[#2c2c2c] bg-[#121212]/55 p-4 text-[#eaeaea] shadow-[0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-sm">
      <p className="text-[0.7rem] leading-relaxed text-[#acaba9]">
        Usamos apenas o necessário para o site funcionar. Veja nossa{" "}
        <Link href="/privacidade" className="text-[#eaeaea] underline underline-offset-2">
          política de privacidade
        </Link>
        .
      </p>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => save("recusado")}
          className="border-[#acaba9]/40 bg-transparent px-4 py-2 text-[0.6rem] uppercase tracking-[0.16em] text-[#eaeaea] transition-colors hover:border-[#eaeaea]">
          Recusar
        </button>
        <button
          type="button"
          onClick={() => save("aceito")}
          className="rounded-tr-[99px] rounded-bl-[99px] rounded-br-[99px] bg-[#eaeaea] px-4 py-2 text-[0.6rem] uppercase tracking-[0.16em] text-[#000000] transition-opacity hover:opacity-85">
          Aceitar
        </button>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';

const KEY = 'mgb-console-signature';

/** Firma para quien abre las herramientas de desarrollo: repo del portfolio y contacto. Una vez por sesión. */
export function ConsoleSignature({
  hello,
  repo,
  fit,
  email,
}: {
  hello: string;
  repo: string;
  fit: string;
  email: string;
}) {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, '1');
    } catch {
      // sin sessionStorage (modo privado estricto): se firma igualmente
    }
    console.info(
      `%c${hello}%c ${repo}\n%c${fit}%c ${email}`,
      'font-weight:600',
      '',
      'font-weight:600',
      '',
    );
  }, [hello, repo, fit, email]);
  return null;
}

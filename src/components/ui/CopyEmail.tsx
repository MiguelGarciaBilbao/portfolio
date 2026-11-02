'use client';

import { useState } from 'react';

export function CopyEmail({ email, label, done }: { email: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <>
      <button
        type="button"
        className="btn btn--ghost"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2500);
          } catch {
            window.location.href = `mailto:${email}`;
          }
        }}
      >
        {label}
      </button>
      <span role="status" aria-live="polite" className="copy-status">
        {copied ? done : ''}
      </span>
    </>
  );
}

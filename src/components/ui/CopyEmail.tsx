'use client';

import { useState } from 'react';

export function CopyEmail({
  email,
  label,
  done,
  className = 'btn btn--ghost',
}: {
  email: string;
  label: string;
  done: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <>
      <button
        type="button"
        className={className}
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

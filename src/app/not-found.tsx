import Link from 'next/link';

// 404 para rutas fuera de cualquier locale (el proxy prefija casi todo).
export default function GlobalNotFound() {
  return (
    <html lang="es">
      <body style={{ background: '#05070f', color: '#E8F1FF', fontFamily: 'system-ui' }}>
        <main style={{ padding: '4rem 1.5rem' }}>
          <h1>404</h1>
          <p>
            <Link href="/es">Volver al inicio</Link> · <Link href="/en">Back to home</Link>
          </p>
        </main>
      </body>
    </html>
  );
}

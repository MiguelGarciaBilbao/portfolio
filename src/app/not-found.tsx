// 404 para rutas fuera de cualquier locale (el proxy prefija casi todo).
export default function GlobalNotFound() {
  return (
    <html lang="es">
      <body style={{ background: '#05070f', color: '#E8F1FF', fontFamily: 'system-ui' }}>
        <main style={{ padding: '4rem 1.5rem' }}>
          <h1>404</h1>
          <p>
            <a href="/es">Volver al inicio</a> · <a href="/en">Back to home</a>
          </p>
        </main>
      </body>
    </html>
  );
}

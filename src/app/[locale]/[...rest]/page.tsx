import { notFound } from 'next/navigation';

// Cualquier ruta desconocida dentro de un locale → not-found localizado.
export default function CatchAll() {
  notFound();
}

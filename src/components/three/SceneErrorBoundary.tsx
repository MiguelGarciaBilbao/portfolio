'use client';

import { Component, type ReactNode } from 'react';

/**
 * Aísla los fallos de una escena 3D (chunk que no carga, shader que no compila, contexto WebGL
 * que no se crea): en vez de tumbar la página, avisa a SceneCanvas y no pinta nada, de modo que
 * el fallback estático sigue a la vista. Regla 5: el texto nunca depende de WebGL.
 */
export class SceneErrorBoundary extends Component<
  { children: ReactNode; onError(): void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

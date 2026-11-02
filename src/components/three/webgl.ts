import { isSoftwareRenderer } from '@/lib/motion';

let cached: { ok: boolean; renderer?: string } | null = null;

/**
 * Sondea WebGL una sola vez. Devuelve el renderer (si el navegador lo expone) para clasificar la GPU.
 * Un rasterizador por software cuenta como "sin WebGL": la escena se queda en su fallback estático.
 */
export function probeWebGL(): { ok: boolean; renderer?: string } {
  if (cached) return cached;
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') ??
      canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return (cached = { ok: false });
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : undefined;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return (cached = { ok: !isSoftwareRenderer(renderer), renderer });
  } catch {
    return (cached = { ok: false });
  }
}

export function hasWebGL(): boolean {
  return probeWebGL().ok;
}

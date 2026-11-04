'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';

type Props = {
  image: string;
  width: number;
  height: number;
  video: { webm: string; mp4: string };
  alt: string;
};

/** Segundos antes del final en los que el vídeo empieza a disolverse sobre la foto fija. */
const SETTLE = 0.9;

/**
 * Retrato constelación. En reposo, la foto fija (alta calidad, con alt). Al llegar a Contacto,
 * un vídeo silencioso dibuja la constelación una vez encima y se disuelve de vuelta en la foto.
 * Con el ratón encima o con un toque, se repite. Con "reducir movimiento" o ahorro de datos,
 * el vídeo ni se pide.
 */
export function Portrait({ image, width, height, video, alt }: Props) {
  const reduced = useReducedMotion();
  const figureRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wantPlay = useRef(false);
  const [armed, setArmed] = useState(false);
  const [state, setState] = useState<'still' | 'playing'>('still');

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.currentTime = 0;
    v.play().catch(() => setState('still'));
  };

  useEffect(() => {
    const figure = figureRef.current;
    if (reduced || !figure || typeof IntersectionObserver === 'undefined') return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;

    let played = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          if (!played) {
            played = true;
            // el <video> se monta con este estado y arranca en cuanto pueda reproducirse
            wantPlay.current = true;
          }
        } else {
          videoRef.current?.pause();
          setState('still');
        }
      },
      { threshold: 0.5 },
    );
    io.observe(figure);
    return () => io.disconnect();
  }, [reduced]);

  const replay = () => {
    if (armed && state === 'still') play();
  };

  return (
    <figure
      ref={figureRef}
      className="portrait"
      data-testid="portrait"
      data-state={state}
      onPointerEnter={(e) => e.pointerType === 'mouse' && replay()}
      onPointerUp={(e) => e.pointerType !== 'mouse' && replay()}
    >
      <Image
        src={image}
        width={width}
        height={height}
        alt={alt}
        sizes="(min-width: 1024px) 440px, 64vw"
        className="portrait__still"
      />
      {armed && !reduced && (
        <video
          ref={videoRef}
          className="portrait__motion"
          aria-hidden="true"
          tabIndex={-1}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onCanPlay={() => {
            if (!wantPlay.current) return;
            wantPlay.current = false;
            play();
          }}
          onPlaying={() => setState('playing')}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration && v.currentTime > v.duration - SETTLE) setState('still');
          }}
          onEnded={() => setState('still')}
        >
          <source src={video.webm} type="video/webm" />
          <source src={video.mp4} type="video/mp4" />
        </video>
      )}
    </figure>
  );
}

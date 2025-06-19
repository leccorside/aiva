"use client";

import Image, { ImageProps } from "next/image";
import { useState, ImgHTMLAttributes } from "react";

/**
 * Mostra a imagem via `<Image>` sempre que possível.
 * – Se a `src` começar com "blob:" usamos `<img>` (o next/image não suporta blob).
 * – Quando ocorrer erro de carregamento cai para o `fallbackSrc`.
 */
interface Props extends Omit<ImageProps, "src" | "placeholder"> {
  /** URL da imagem principal */
  src: string;
  /** Caso a principal falhe ⇒ usa esta (padrão placeholder genérico) */
  fallbackSrc?: string;
  /** Alt obrigatória para acessibilidade */
  alt: string;
}

export default function ImageWithFallback({
  src,
  fallbackSrc = "/img/placeholder.jpg",
  alt,
  ...rest
}: Props) {
  const [errored, setErrored] = useState(false);

  // Extrai os atributos válidos para <img>
  const imgProps = rest as ImgHTMLAttributes<HTMLImageElement>;

  // Caso seja um blob, next/image não funciona – use <img>
  if (src.startsWith("blob:")) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img src={src} alt={alt} onError={() => setErrored(true)} {...imgProps} />
    );
  }

  // Quando ocorreu erro anteriormente, renderiza o fallback (via <img> simples)
  if (errored) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={fallbackSrc} alt={alt} {...imgProps} />;
  }

  // Fluxo normal com next/image
  return (
    <Image
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      // prioridade de carregamento opcional para thumbnails
      loading="lazy"
      {...rest}
    />
  );
}

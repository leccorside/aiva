"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

/**
 * Componente que tenta renderizar a imagem com Next/Image,
 * mas usa <img> em caso de erro ou se for blob.
 */
interface Props extends Omit<ImageProps, "src" | "placeholder"> {
  /** URL da imagem principal */
  src: string;
  /** Imagem de fallback, usada se a principal falhar */
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

  const handleError = () => setErrored(true);

  // Renderiza com <img> se for blob ou houve erro
  const shouldUseImgTag = errored || src.startsWith("blob:");

  if (shouldUseImgTag) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={errored ? fallbackSrc : src}
        alt={alt}
        onError={handleError}
        {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    );
  }

  // Fluxo padrão com next/image
  return (
    <Image src={src} alt={alt} onError={handleError} loading="lazy" {...rest} />
  );
}

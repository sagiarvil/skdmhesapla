type Props = {
  varyant: "header" | "footer";
  className?: string;
};

/**
 * SKDM + Hesapla ayrıştırılmış premium wordmark — header/footer koyu zemin.
 * GIF logo yanında; açık zeminlerde kullanılmaz (tasarım rehberi §2).
 */
export function MarkaWordmark({ varyant, className = "" }: Props) {
  const isFooter = varyant === "footer";

  return (
    <span
      className={`marka-wordmark ${isFooter ? "marka-wordmark--footer" : "marka-wordmark--header"} ${className}`}
    >
      <span className="marka-wordmark__line" aria-hidden="true">
        <span className="marka-wordmark__skdm">SKDM</span>
        <span className="marka-wordmark__hesapla">Hesapla</span>
      </span>
      <span className="sr-only">SKDMHesapla</span>
      <span className="marka-wordmark__bar" aria-hidden="true" />
      {isFooter ? (
        <span className="marka-wordmark__tag">CBAM · Denetime hazır dosya</span>
      ) : (
        <span className="marka-wordmark__tag marka-wordmark__tag--header hidden min-[420px]:inline">
          CBAM · Denetime hazır
        </span>
      )}
    </span>
  );
}

type Props = {
  yon?: "asagi" | "yukari";
  dolguSinif?: string;
  sinifAdi?: string;
};

/**
 * Çift katmanlı dalga ayırıcı:
 * - Önde: genliği ~2× beyaz/soft dolgu kavis
 * - Arkada: 72px mühür bandı — 3 paralel sinüs, brand-500, opacity 0.5, aralık 10px
 */
export function CiftDalga({
  yon = "asagi",
  dolguSinif = "text-white",
  sinifAdi = "h-28 sm:h-32",
}: Props) {
  const ters = yon === "yukari";
  return (
    <div
      className={`pointer-events-none relative w-full overflow-visible leading-[0] ${sinifAdi} ${
        ters ? "rotate-180" : ""
      }`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 72"
        className="absolute inset-x-0 bottom-[28%] z-0 h-[55%] w-full text-brand-500"
        preserveAspectRatio="none"
      >
        <path
          d="M0,26 C120,6 240,46 360,26 C480,6 600,46 720,26 C840,6 960,46 1080,26 C1200,6 1320,46 1440,26"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1.4"
        />
        <path
          d="M0,36 C120,16 240,56 360,36 C480,16 600,56 720,36 C840,16 960,56 1080,36 C1200,16 1320,56 1440,36"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1.1"
        />
        <path
          d="M0,46 C120,26 240,66 360,46 C480,26 600,66 720,46 C840,26 960,66 1080,46 C1200,26 1320,66 1440,46"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="0.8"
        />
      </svg>
      <svg
        viewBox="0 0 1440 96"
        className={`absolute inset-x-0 bottom-0 z-[1] h-[55%] w-full ${dolguSinif}`}
        preserveAspectRatio="none"
      >
        <path fill="currentColor" d="M0,48 C360,96 1080,0 1440,48 L1440,96 L0,96 Z" />
      </svg>
    </div>
  );
}

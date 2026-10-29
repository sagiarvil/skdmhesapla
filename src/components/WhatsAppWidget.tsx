"use client";

import React, { useEffect, useState } from "react";

interface WhatsAppWidgetProps {
  phone?: string;
  message?: string;
}

export function WhatsAppWidget({
  phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "",
  message = "Merhaba, web siteniz üzerinden iletişime geçiyorum.",
}: WhatsAppWidgetProps) {
  const [activePhone, setActivePhone] = useState(phone);

  useEffect(() => {
    const clean = (phone || "").replace(/\D/g, "");
    setActivePhone(clean);
  }, [phone]);

  const isValid = /^[1-9]\d{9,14}$/.test(activePhone);
  const href = isValid
    ? `https://wa.me/${activePhone}${message ? `?text=${encodeURIComponent(message)}` : ""}`
    : "#";

  return (
    <aside
      className="wa-premium"
      data-phone={activePhone}
      data-message={message}
      aria-label="WhatsApp üzerinden iletişim"
    >
      <a
        className="wa-premium__link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp üzerinden mesaj gönder"
        aria-disabled={!isValid ? "true" : undefined}
        onClick={(e) => {
          if (!isValid) {
            e.preventDefault();
          }
        }}
      >
        <span className="wa-premium__icon">
          <svg
            className="wa-premium__logo"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.148-.67-1.611-.916-2.206-.242-.579-.487-.5-.67-.51-.173-.009-.371-.011-.57-.011s-.52.074-.792.372c-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.003a9.85 9.85 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.647-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.437-9.886 9.893-9.886a9.83 9.83 0 0 1 6.99 2.895 9.82 9.82 0 0 1 2.893 6.993c-.003 5.45-4.437 9.889-9.893 9.889m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.333.157 11.893c0 2.096.547 4.14 1.588 5.945L.057 24l6.307-1.654a11.89 11.89 0 0 0 5.681 1.448h.005c6.557 0 11.894-5.334 11.897-11.893a11.82 11.82 0 0 0-3.483-8.413Z"
            />
          </svg>
        </span>
        <span className="wa-premium__body">
          <span className="wa-premium__title">WhatsApp'tan Yazın</span>
          <span className="wa-premium__subtitle">Size yardımcı olalım</span>
        </span>
      </a>
    </aside>
  );
}

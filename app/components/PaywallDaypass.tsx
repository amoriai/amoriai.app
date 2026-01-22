"use client";

import React from "react";

type Props = {
  badge?: string;

  title: string;
  text: string;

  daypassTitle: string;
  daypassText: string;
  daypassCta: string;
  daypassAltCta: string;
  daypassLoading: string;

  plusCta: string;
  seePlansLabel: string;
  pricingUrl: string;

  isLoadingDaypass: boolean;

  onDaypass: () => void;
  onPlus: () => void;
};

export function PaywallDaypass({
  badge = "PLUS",
  title,
  text,

  daypassTitle,
  daypassText,
  daypassCta,
  daypassAltCta,
  daypassLoading,

  plusCta,
  seePlansLabel,
  pricingUrl,

  isLoadingDaypass,

  onDaypass,
  onPlus,
}: Props) {
  return (
    <div className="paywall">
      <div className="badge">{badge}</div>

      {/* bloc principal paywall */}
      <p className="paywall__title">{title}</p>
      <p className="paywall__text">{text}</p>

      {/* bloc daypass 24h */}
      <div className="paywall__daypass">
        <p className="paywall__title" style={{ marginTop: 14 }}>
          {daypassTitle}
        </p>
        <p className="paywall__text" style={{ opacity: 0.9 }}>
          {daypassText}
        </p>

        <button
          type="button"
          className="pillBtn pillBtn--primary paywall__btn"
          onClick={onDaypass}
          disabled={isLoadingDaypass}
          aria-busy={isLoadingDaypass}
        >
          <span>{isLoadingDaypass ? daypassLoading : daypassCta}</span>
          <span aria-hidden="true">➜</span>
        </button>

        <button
          type="button"
          className="pillBtn pillBtn--ghost paywall__btn"
          onClick={onPlus}
          disabled={isLoadingDaypass}
        >
          <span>{daypassAltCta}</span>
          <span aria-hidden="true">➜</span>
        </button>
      </div>

      <a href={pricingUrl} className="paywall__link">
        {seePlansLabel}
      </a>
    </div>
  );
}

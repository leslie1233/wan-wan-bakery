"use client";

import { trackEvent } from "./Analytics";

type InstagramLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  eventLabel: string;
  ariaLabel?: string;
};

export default function InstagramLink({
  href,
  className,
  children,
  eventLabel,
  ariaLabel = "Follow us on Instagram",
}: InstagramLinkProps) {
  function handleClick() {
    trackEvent("instagram_click", {
      link_text: eventLabel,
    });
  }

  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

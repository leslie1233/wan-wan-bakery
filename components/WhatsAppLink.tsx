"use client";

import { openWhatsAppInNewTab } from "../lib/open-whatsapp";
import { trackEvent } from "./Analytics";

type WhatsAppLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  eventLabel: string;
  ariaLabel?: string;
};

export default function WhatsAppLink({
  href,
  className,
  children,
  eventLabel,
  ariaLabel,
}: WhatsAppLinkProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    event.stopPropagation();

    trackEvent("whatsapp_click", {
      link_text: eventLabel,
    });

    openWhatsAppInNewTab(href);
  }

  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      data-track="whatsapp"
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

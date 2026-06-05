"use client";

import { buildFacebookShareUrl } from "../lib/share";
import { openShareInNewTab } from "../lib/open-share";
import { trackEvent } from "./Analytics";

type FacebookShareLinkProps = {
  path?: string;
  className?: string;
  children: React.ReactNode;
  eventLabel: string;
  ariaLabel?: string;
};

export default function FacebookShareLink({
  path = "/",
  className,
  children,
  eventLabel,
  ariaLabel = "Share on Facebook",
}: FacebookShareLinkProps) {
  const href = buildFacebookShareUrl(path);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    event.stopPropagation();

    trackEvent("facebook_share_click", {
      link_text: eventLabel,
    });

    openShareInNewTab(href);
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getLogoImage } from "../lib/i18n/images";
import { localePath } from "../lib/i18n/paths";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLocale } from "./LocaleProvider";
import { useCart } from "./CartProvider";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const { locale, dict } = useLocale();

  const navItems = [
    { href: localePath(locale, "/"), label: dict.nav.home },
    { href: localePath(locale, "/products"), label: dict.nav.products },
    { href: localePath(locale, "/about"), label: dict.nav.about },
    { href: localePath(locale, "/faq"), label: dict.nav.faq },
    { href: localePath(locale, "/contact"), label: dict.nav.contact },
    { href: localePath(locale, "/account"), label: dict.nav.account },
  ];

  return (
    <header className="header">
      <a href="#main-content" className="skip-link">
        {dict.nav.skipToContent}
      </a>

      <div className="container nav">
        <Link
          className="logo logo-with-image"
          href={localePath(locale, "/")}
          onClick={() => setOpen(false)}
        >
          <Image
            src={getLogoImage()}
            alt="Wan Wan Bakery Logo"
            width={70}
            height={70}
            priority
          />
          <span>Wan Wan Bakery</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="sr-only">{dict.nav.toggleNav}</span>
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>

        <nav
          id="primary-navigation"
          className={`navlinks${open ? " open" : ""}`}
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link
            href={localePath(locale, "/cart")}
            className="cart-link"
            onClick={() => setOpen(false)}
          >
            {dict.nav.cart}
            {itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}

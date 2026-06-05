"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="header">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="container nav">
        <Link className="logo logo-with-image" href="/" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.jpg"
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
          <span className="sr-only">Toggle navigation</span>
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
          <Link href="/cart" className="cart-link" onClick={() => setOpen(false)}>
            Cart{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
        </nav>
      </div>
    </header>
  );
}

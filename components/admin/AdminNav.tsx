import Link from "next/link";
import { signOut } from "../../lib/auth";

type AdminNavProps = {
  email: string;
};

export default function AdminNav({ email }: AdminNavProps) {
  return (
    <header className="admin-header">
      <div className="admin-header-inner">
        <div>
          <p className="admin-kicker">Wan Wan Bakery</p>
          <h1 className="admin-title">Admin</h1>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          <Link href="/admin/products">Catalog</Link>
          <Link href="/admin/promotions">Promotions</Link>
          <Link href="/admin/settings">Phone</Link>
          <Link href="/en" target="_blank" rel="noreferrer">
            View site
          </Link>
        </nav>
        <div className="admin-user">
          <span>{email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button type="submit" className="button secondary admin-button">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

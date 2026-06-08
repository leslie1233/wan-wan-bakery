import type { Metadata } from "next";
import AdminNav from "../../components/admin/AdminNav";
import AuthSessionProvider from "../../components/admin/AuthSessionProvider";
import { auth } from "../../lib/auth";

export const metadata: Metadata = {
  title: "Admin | Wan Wan Bakery",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AuthSessionProvider>
      <div className="admin-shell">
        {session?.user?.email ? <AdminNav email={session.user.email} /> : null}
        <main className="admin-main">{children}</main>
      </div>
    </AuthSessionProvider>
  );
}

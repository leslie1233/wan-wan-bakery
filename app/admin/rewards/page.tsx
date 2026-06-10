import { auth } from "../../../lib/auth";
import { redirect } from "next/navigation";
import RewardsForm from "../../../components/admin/RewardsForm";

export default async function AdminRewardsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  return (
    <main className="admin-main">
      <h2>Membership &amp; Rewards</h2>
      <p className="admin-intro">
        Configure loyalty points, first-order discount, referral rewards, and owner
        email notifications.
      </p>
      <RewardsForm />
    </main>
  );
}

import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";
import { redirect } from "next/navigation";

export default async function AdminCustomersPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      _count: { select: { orders: true, referrals: true } },
    },
  });

  return (
    <main className="admin-main">
      <h2>Members</h2>
      <p className="admin-intro">Registered customers and loyalty balances.</p>

      {customers.length === 0 ? (
        <p>No members yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Referral code</th>
                <th>Points</th>
                <th>Orders</th>
                <th>Referrals</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.referralCode}</td>
                  <td>{customer.loyaltyPoints}</td>
                  <td>{customer._count.orders}</td>
                  <td>{customer._count.referrals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

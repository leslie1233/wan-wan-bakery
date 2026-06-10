import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";
import { redirect } from "next/navigation";
import { formatPrice } from "../../../lib/format";

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      customer: { select: { email: true, name: true } },
      items: true,
    },
  });

  return (
    <main className="admin-main">
      <h2>Orders</h2>
      <p className="admin-intro">Recent orders placed through the website checkout.</p>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Points</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
                  <td>
                    {order.customer?.name ?? order.guestName ?? "Guest"}
                    <br />
                    <small>{order.customer?.email ?? order.guestEmail}</small>
                  </td>
                  <td>{formatPrice(order.totalCents)}</td>
                  <td>
                    {order.pointsEarned > 0 ? `+${order.pointsEarned}` : "—"}
                    {order.pointsRedeemed > 0 ? ` / -${order.pointsRedeemed}` : ""}
                  </td>
                  <td>{order.createdAt.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

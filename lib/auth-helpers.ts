import { auth } from "./auth";

export async function requireAdminSession() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  return session;
}

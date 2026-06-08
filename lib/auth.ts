import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { isDatabaseConfigured, prisma } from "./db";

function getAuthSecret(): string {
  if (process.env.AUTH_SECRET) {
    return process.env.AUTH_SECRET;
  }

  if (process.env.NODE_ENV === "development") {
    return "wan-wan-bakery-local-dev-secret";
  }

  throw new Error("AUTH_SECRET environment variable is required.");
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: getAuthSecret(),
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString();

        if (!email || !password) {
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
          adminEmail &&
          adminPassword &&
          email === adminEmail &&
          password === adminPassword
        ) {
          return { id: "env-admin", email: adminEmail };
        }

        if (!isDatabaseConfigured()) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({ where: { email } });

          if (!user) {
            return null;
          }

          const valid = await bcrypt.compare(password, user.passwordHash);

          if (!valid) {
            return null;
          }

          return { id: user.id, email: user.email };
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
      }

      return session;
    },
  },
});

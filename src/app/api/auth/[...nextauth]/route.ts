import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";

import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await dbConnect();
        
        const cleanEmail = credentials.email.toLowerCase().trim();
        let admin = await (Admin.findOne as any)({ email: cleanEmail } as any);
        
        // Auto-seed admin if database is empty or doesn't have the configured env admin
        if (!admin) {
          if (
            process.env.ADMIN_EMAIL &&
            process.env.ADMIN_PASSWORD &&
            cleanEmail === process.env.ADMIN_EMAIL.toLowerCase().trim() &&
            credentials.password === process.env.ADMIN_PASSWORD
          ) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            admin = await Admin.create({
              email: process.env.ADMIN_EMAIL.toLowerCase().trim(),
              password: hashedPassword
            });
            return { id: admin._id.toString(), email: admin.email };
          }
          throw new Error("Invalid credentials");
        }

        let isValid = await bcrypt.compare(credentials.password, admin.password);
        
        // Auto-sync password if changed in environment variables
        if (
          !isValid &&
          process.env.ADMIN_PASSWORD &&
          process.env.ADMIN_EMAIL &&
          cleanEmail === process.env.ADMIN_EMAIL.toLowerCase().trim() &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          admin.password = await bcrypt.hash(credentials.password, 10);
          await admin.save();
          isValid = true;
        }

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return { id: admin._id.toString(), email: admin.email };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development_only_12345",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { AdminUser } from "./types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "ignou_edukyu_admin_secure_secret_key_2026_xyz"
);

export const COOKIE_NAME = "ignou_admin_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "superadmin";
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: (payload.role as "admin" | "superadmin") || "admin",
    };
  } catch (err) {
    return null;
  }
}

export async function getAdminFromRequest(request?: NextRequest): Promise<AdminUser | null> {
  try {
    let token: string | undefined;
    if (request) {
      token = request.cookies.get(COOKIE_NAME)?.value;
    }
    if (!token) {
      try {
        const cookieStore = await cookies();
        token = cookieStore.get(COOKIE_NAME)?.value;
      } catch {
        return null;
      }
    }
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload || !payload.email) return null;

    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name || "Administrator",
      role: payload.role || "admin",
    };
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  return getAdminFromRequest();
}

export async function verifyAdminCredentials(
  email: string,
  plainPassword: string
): Promise<{ user: AdminUser | null; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  // Try to find in persistent store first
  try {
    const { getAdminByEmail } = await import("./admin-data");
    const storedUser = await getAdminByEmail(cleanEmail);
    if (storedUser) {
      if (storedUser.password !== plainPassword) {
        return { user: null, error: "Invalid password for this administrator account." };
      }
      return {
        user: {
          id: storedUser.id,
          email: storedUser.email,
          name: storedUser.name,
          role: storedUser.role,
        },
      };
    }
  } catch (e) {
    console.error("Error reading stored admin user:", e);
  }

  // Default demo / administrator accounts fallback
  const validAdmins = [
    { email: "admin@edukyu.com", pass: "admin123", name: "Edukyu Admin", role: "superadmin" as const },
    { email: "admin@ignou.ac.in", pass: "ignou2026", name: "IGNOU Admin", role: "superadmin" as const },
  ];

  const matched = validAdmins.find(
    (a) => a.email.toLowerCase() === cleanEmail && a.pass === plainPassword
  );

  if (!matched) {
    return { user: null, error: "Invalid email or password. Use demo credentials to login." };
  }

  return {
    user: {
      id: cleanEmail,
      email: matched.email,
      name: matched.name,
      role: matched.role,
    },
  };
}

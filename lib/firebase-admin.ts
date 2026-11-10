import fs from "fs";
import path from "path";
import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let dbInstance: Firestore | null = null;
let initialized = false;

export function initFirebaseAdmin(): App | null {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0]!;
  }

  try {
    const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (envKey) {
      const parsed = typeof envKey === "string" ? JSON.parse(envKey) : envKey;
      return initializeApp({
        credential: cert(parsed),
        projectId: parsed.project_id || "ignou-fe1a9",
      });
    }

    const keyPath = path.join(process.cwd(), "firebase-key.json");
    if (fs.existsSync(keyPath)) {
      const fileContent = fs.readFileSync(keyPath, "utf8");
      const serviceAccount = JSON.parse(fileContent);
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || "ignou-fe1a9",
      });
    }

    console.warn("[firebase-admin] No service account credentials found");
    return null;
  } catch (error) {
    console.error("[firebase-admin] Initialization error:", error);
    return null;
  }
}

export function getDb(): Firestore | null {
  if (dbInstance) return dbInstance;
  if (!initialized) {
    const app = initFirebaseAdmin();
    if (app) {
      try {
        // Target 'default' database provisioned in ignou-fe1a9
        dbInstance = getFirestore(app, "default");
        try {
          dbInstance.settings({ ignoreUndefinedProperties: true });
        } catch (_) {
          // settings can only be called once; ignore if already applied
        }
        console.log("[firebase-admin] Connected to Cloud Firestore ('default' on ignou-fe1a9)");
      } catch (e) {
        console.error("[firebase-admin] Failed to initialize Firestore instance:", e);
      }
    }
    initialized = true;
  }
  return dbInstance;
}

export function isFirestoreAvailable(): boolean {
  return getDb() !== null;
}

export function getFirebaseProjectId(): string {
  return "ignou-fe1a9";
}

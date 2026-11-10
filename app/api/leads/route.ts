import { NextRequest, NextResponse } from "next/server";
import { insertLead, getLeads } from "@/lib/admin-data";
import { getDb } from "@/lib/firebase-admin";

const CRM_USER_ID =
  process.env.CRM_ENQ_USER_ID ||
  process.env.CRM_USER_ID ||
  "EDUKYU_CRM_230500001";
const CRM_PASSWORD =
  process.env.CRM_ENQ_PASSWORD || process.env.CRM_PASSWORD || "12345";
const PUJARIWALA_API_KEY =
  process.env.CRM_ENQ_BOOKS_KEY ||
  process.env.ENQ_BOOKS_KEY ||
  process.env.PUJARIWALA_API_KEY ||
  "a990c4a560e5e76e07347f5b87fefe97";
const PUJARIWALA_API_URL =
  process.env.PUJARIWALA_API_URL ||
  "https://pujariwala.in/bai_crm_api_integrate/bai_crm_website_lead_post";

const ENQBOOKS_API_URL =
  process.env.CRM_ENQ_API_URL ||
  "https://edukyu.enqbooks.com/enqbooks_api/api/Crm_leads_insert";
const ENQBOOKS_API_METHOD = (process.env.CRM_ENQ_API_METHOD || "POST").toUpperCase();
const ENQBOOKS_ENABLED = (process.env.CRM_ENQ_ENABLED || "false").toLowerCase() === "true";

// Comprehensive program name to CRM ID mapping from Edukyu CRM
const PROGRAM_MAPPING: Record<string, string> = {
  // Core IGNOU UG Programs
  "BCA": "P0039",
  "Bachelor of Computer Applications": "P0039",
  "Bachelor of Computer Applications (BCA)": "P0039",
  "BCA (Computer Applications)": "P0039",
  "BCOM": "P0038",
  "Bachelor of Commerce": "P0038",
  "BCom": "P0038",
  "B.Com": "P0038",
  "B.Com (Commerce)": "P0038",
  "B.Com (General)": "P0038",
  "BA": "P0062",
  "Bachelor of Arts": "P0062",
  "Bachelor of Arts (BA)": "P0062",
  "B.A": "P0062",
  "B.A. (Arts & Humanities)": "P0062",
  "B.A. (General)": "P0062",
  "BBA": "P0016",
  "Bachelor of Business Administration": "P0016",
  "BMS": "P0020",
  "Bachelor of Management Studies": "P0020",
  "BSC": "P0072",
  "B.Sc": "P0072",
  "BSc": "P0072",
  "Bachelor of Science": "P0072",
  "B.Sc (Bachelor of Science)": "P0072",
  "BLIS": "P0072",
  "BLISc": "P0072",
  "Bachelor of Library and Information Science": "P0072",
  "BLIS (Library Science)": "P0072",
  "BSW": "P0062",
  "Bachelor of Social Work": "P0062",
  "BSW (Social Work)": "P0062",
  "BTech": "P0072",
  "B.Tech": "P0072",

  // Core IGNOU PG Programs
  "MCA": "P0039",
  "Master of Computer Applications": "P0039",
  "Master of Computer Applications (MCA)": "P0039",
  "MCA (Master of Computer Applications)": "P0039",
  "MCOM": "P0034",
  "MCom": "P0034",
  "M.Com": "P0034",
  "Master of Commerce": "P0034",
  "M.Com (Master of Commerce)": "P0034",
  "MA": "P0330",
  "Master of Arts": "P0330",
  "M.A": "P0330",
  "M.A. English (MEG)": "P0330",
  "M.A. Hindi (MHD)": "P0330",
  "M.A. Political Science (MPS)": "P0330",
  "M.A. History (MAH)": "P0330",
  "M.A. Sociology (MSO)": "P0330",
  "M.A. Economics (MEC)": "P0330",
  "M.A. Public Administration (MPA)": "P0330",
  "MLIS": "P0068",
  "MLISc": "P0068",
  "Master of Library and Information Science": "P0068",
  "MLIS (Library Science)": "P0068",
  "MSW": "P0062",
  "Master of Social Work": "P0062",
  "MJMC": "P0035",
  "Master of Journalism and Mass Communication": "P0035",
  "MA (JMC)": "P0035",

  // Core IGNOU MBA & Specializations
  "MBA": "P0314",
  "Master of Business Administration": "P0314",
  "Master of Business Administration (MBA)": "P0314",
  "Distance MBA": "P0314",
  "Online MBA": "P0314",
  "100% Online MBA": "P0314",
  "MBA (General Management)": "P0040",
  "MBA in General Management": "P0040",
  "MBA in Banking & Finance (MPB)": "P0007",
  "MBA (Banking & Finance)": "P0007",
  "MBA in Finance": "P0007",
  "MBA (FM) Finance Management": "P0007",
  "MBA in Human Resource (HRM)": "P0006",
  "MBA (HRM) Human Resource Management": "P0006",
  "MBA in Marketing Management": "P0005",
  "MBA (MM) Marketing Management": "P0005",
  "MBA in Operations Management": "P0010",
  "MBA (OM) Operations Management": "P0010",
  "MBA in Information Technology": "P0008",
  "MBA (ITM) Information Technology": "P0008",
  "MBA in Business Analytics": "P0002",
  "MBA (BAM) Business Analytics Management": "P0002",
  "MBA (BA) Business Analytics": "P0043",
  "MBA in Project Management": "P0009",
  "MBA (PM) Project Management": "P0009",
  "MBA in International Business": "P0012",
  "MBA (IBM) International Business Management": "P0012",
  "MBA in Supply Chain Management": "P0028",
  "MBA (SCM) Supply Chain Management": "P0028",
  "MBA in Retail Management": "P0027",
  "MBA (RM) Retail Management": "P0027",
  "MBA in Hospital Administration": "P0281",
  "MBA (HM) Healthcare Management": "P0281",
};

export function resolveProgramId(courseName?: string): string {
  if (!courseName) return "SD00000002";
  const trimmed = courseName.trim();
  if (PROGRAM_MAPPING[trimmed]) return PROGRAM_MAPPING[trimmed];

  const lower = trimmed.toLowerCase();
  for (const [key, code] of Object.entries(PROGRAM_MAPPING)) {
    if (lower === key.toLowerCase() || lower.includes(key.toLowerCase())) {
      return code;
    }
  }
  return "SD00000002";
}

function sanitizeText(val: any): string {
  if (typeof val !== "string") return String(val || "").trim();
  return val.replace(/[\r\n\t]+/g, " ").trim().substring(0, 250);
}

function withTimeout<T>(promise: Promise<T>, ms: number = 2000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// ---------------- GET /api/leads ----------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 100;
    const search = searchParams.get("search") || undefined;
    const course = searchParams.get("course") || undefined;

    const leads = await getLeads({ limit, search, course });
    return NextResponse.json({ success: true, count: leads.length, leads });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to retrieve leads." },
      { status: 500 }
    );
  }
}

// ---------------- POST /api/leads ----------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = sanitizeText(body.name || body.fullName);
    const rawMobile = String(body.mobile || body.phone || "");
    const mobile = rawMobile.replace(/\D/g, "").slice(-10);
    const email = sanitizeText(body.email).toLowerCase();
    const course = sanitizeText(
      body.course || body.programme || body.program || "IGNOU Admission"
    );
    const city = sanitizeText(body.city || body.state || "Delhi (NCR)");
    const state = sanitizeText(body.state || body.city || "Delhi (NCR)");
    const university_name = sanitizeText(
      body.university_name || "Indira Gandhi National Open University (IGNOU)"
    );
    const university_code = sanitizeText(body.university_code || "IGNOU");
    const source_name = sanitizeText(
      body.source_name ||
        (body.source && body.source !== "website_form" ? body.source : "WS") ||
        "WS"
    );
    const source_id = sanitizeText(body.source_id || "49");
    const supplier_id = sanitizeText(body.supplier_id || "");

    const referer = req.headers.get("referer") || "";
    const page_url = sanitizeText(
      body.page_url ||
        body.pageUrl ||
        referer ||
        (req.headers.get("host") ? `https://${req.headers.get("host")}` : "")
    );

    // Form Validation
    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid full name." },
        { status: 400 }
      );
    }
    if (!mobile || mobile.length !== 10) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid 10-digit mobile number." },
        { status: 400 }
      );
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const prog_id = resolveProgramId(course);

    // 1. Prepare CRM Payload
    const crmPayload = {
      user_id: CRM_USER_ID,
      password: CRM_PASSWORD,
      name,
      mobile,
      email,
      city,
      university_name,
      university_code,
      prog_id,
      prog_name: course,
      enquiry_product: course,
      source_name,
      source_id,
      supplier_id,
      data_from: page_url,
      page_url,
      selected_challenges: body.selected_challenges || "",
    };

    // 2. Insert into Firestore First (Guarantees zero lead loss)
    let leadId = "";
    try {
      const res = await insertLead({
        name,
        mobile,
        email,
        city,
        state,
        course,
        programme: course,
        prog_id,
        university_name,
        university_code,
        source_name,
        source_id,
        supplier_id,
        page_url,
        data_from: page_url,
        crm_status: "pending",
        status: "new",
      });
      leadId = res.id;
    } catch (fsErr) {
      console.error("[leads API] Failed to save lead locally/firestore:", fsErr);
    }

    // Also write to legacy enquiries collection in Firestore for dashboard compatibility
    try {
      const db = getDb();
      if (db) {
        await withTimeout(
          db.collection("enquiries").add({
            fullName: name,
            mobile,
            email,
            course,
            state,
            source: source_name,
            status: "pending",
            createdAt: new Date().toISOString(),
          }),
          2000
        );
      }
    } catch (eErr) {
      // Non-blocking
    }

    // 3. Forward to Pujariwala CRM API (Bai CRM)
    let crmSuccess = false;
    let crmLeadId = "";
    let crmMsg = "";

    try {
      const crmRes = await fetch(PUJARIWALA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ENQ-BOOKS-KEY": PUJARIWALA_API_KEY,
        },
        body: JSON.stringify(crmPayload),
      });

      const crmText = await crmRes.text();
      let crmData: any = null;
      try {
        crmData = JSON.parse(crmText);
      } catch {}

      if (crmRes.ok && (crmData?.status === "success" || crmRes.status === 200)) {
        crmSuccess = true;
        crmLeadId = crmData?.lead_id || "";
        crmMsg = crmData?.message || "Lead data inserted successfully into CRM";
      } else {
        crmMsg = crmData?.message || crmText || `HTTP ${crmRes.status}`;
      }
    } catch (crmErr: any) {
      console.error("[leads API] Pujariwala CRM dispatch error:", crmErr);
      crmMsg = crmErr?.message || "Network error while connecting to CRM";
    }

    // 4. Optional Enqbooks secondary forward
    if (ENQBOOKS_ENABLED) {
      try {
        await fetch(ENQBOOKS_API_URL, {
          method: ENQBOOKS_API_METHOD,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(crmPayload),
        });
      } catch (enqErr) {
        console.error("[leads API] Enqbooks CRM error:", enqErr);
      }
    }

    // 5. Update Firestore lead with sync result
    if (leadId) {
      try {
        const db = getDb();
        if (db) {
          await withTimeout(
            db.collection("crm_leads").doc(leadId).update({
              crm_status: crmSuccess ? "synced" : "failed",
              crm_lead_id: crmLeadId || null,
              crm_response: crmMsg || null,
              synced_at: new Date().toISOString(),
            }),
            2000
          );
        }
      } catch (uErr) {
        console.error("[leads API] Could not update sync status in Firestore:", uErr);
      }
    }

    console.log(
      `[IGNOU Lead Captured] Name: ${name}, Mobile: ${mobile}, Course: ${course}, CRM Synced: ${crmSuccess}`
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Enquiry submitted successfully. An official IGNOU counselor will connect with you shortly.",
        leadId,
        crmSynced: crmSuccess,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("[leads API] Unhandled exception:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to process lead submission." },
      { status: 500 }
    );
  }
}

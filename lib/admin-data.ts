import fs from "fs";
import path from "path";
import { getDb, isFirestoreAvailable, getFirebaseProjectId } from "./firebase-admin";
import {
  Program,
  Blog,
  MbaSpecialization,
  StudentResource,
  HomePageData,
  SiteSettings,
  DashboardStats,
  MediaItem,
  StoredAdminUser,
  Lead,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "admin-store.json");

interface DataStore {
  programs: Program[];
  blogs: Blog[];
  mbaSpecializations?: MbaSpecialization[];
  studentResources: StudentResource[];
  homePage: HomePageData;
  settings: SiteSettings;
  media?: MediaItem[];
  adminUsers?: StoredAdminUser[];
  crmLeads?: Lead[];
}

const DEFAULT_ADMIN_USERS: StoredAdminUser[] = [
  {
    id: "admin-edukyu",
    email: "admin@edukyu.com",
    password: "admin123",
    name: "Edukyu Admin",
    role: "superadmin",
  },
  {
    id: "admin-ignou",
    email: "admin@ignou.ac.in",
    password: "ignou2026",
    name: "IGNOU Admin",
    role: "superadmin",
  },
];

// Initial seed data for IGNOU
const INITIAL_DATA: DataStore = {
  programs: [
    // UG Programs
    {
      id: "ignou-bca",
      type: "ug",
      title: "Bachelor of Computer Applications (BCA)",
      code: "BCA",
      slug: "bachelor-of-computer-applications-bca",
      level: "Undergraduate (UG)",
      duration: "3 Years (Max 6 Years)",
      fee: "₹46,200 Total (₹7,700/semester)",
      eligibility: "10+2 or its equivalent with Mathematics as one of the subjects or bridge course.",
      mode: "Distance & Online",
      badge: "Highest In-Demand",
      shortDescription: "3-year degree offering comprehensive foundation in programming languages, databases, web development, and software design.",
      overview: "IGNOU BCA is one of the premier computer application degrees in India designed to equip students with solid theoretical concepts and hands-on programming skills.",
      highlights: [
        "UGC-DEB approved 3-year bachelor degree",
        "Covers Python, Java, C++, DBMS, Data Structures, and Cloud Computing",
        "Practical computer lab sessions across 67 regional study centers",
        "Direct eligibility for 2-year MCA programs pan-India"
      ],
      curriculum: [
        { semester: "Semester 1", subjects: ["Foundational Mathematics", "Business Communication", "Computer Basics & PC Software", "C Programming Lab"] },
        { semester: "Semester 2", subjects: ["Data Structures in C", "Digital Logic & Computer Org", "Discrete Mathematics", "Data Structures Lab"] },
        { semester: "Semester 3", subjects: ["Object Oriented Programming (C++)", "Computer Networks", "Database Management Systems", "DBMS Lab"] },
        { semester: "Semester 4", subjects: ["Java Programming", "Software Engineering", "Web Technologies (HTML/JS/PHP)", "Web Tech Lab"] },
        { semester: "Semester 5", subjects: ["Python Programming", "Operating Systems", "E-Commerce", "Python Programming Lab"] },
        { semester: "Semester 6", subjects: ["Cyber Security Essentials", "Cloud Computing Fundamentals", "Final Capstone Major Project"] }
      ],
      faqs: [
        { question: "Is IGNOU BCA degree recognized by IT companies and MNCs?", answer: "Yes, IGNOU BCA is fully recognized by UGC-DEB and AICTE. Graduates work across TCS, Infosys, Wipro, Accenture, and tech startups." },
        { question: "Can a student without 12th Maths join BCA?", answer: "Yes, students from Arts/Commerce without Maths in 12th can join by clearing the introductory BCS-012 mathematics bridge module." }
      ],
      metaTitle: "IGNOU BCA Admission 2026-27 - Eligibility, Syllabus & Fees",
      metaDescription: "Check IGNOU Bachelor of Computer Applications (BCA) admission 2026-27 eligibility, semester-wise subjects, fees, and career prospectus.",
      status: "published",
      createdAt: "2026-01-15T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    },
    {
      id: "ignou-bcom",
      type: "ug",
      title: "Bachelor of Commerce (B.Com - General & Online)",
      code: "B.COM",
      slug: "bachelor-of-commerce-bcom",
      level: "Undergraduate (UG)",
      duration: "3 Years",
      fee: "₹12,600 Total (₹4,200/year)",
      eligibility: "10+2 from any recognized board in any discipline.",
      mode: "Distance & Online",
      badge: "Most Affordable",
      shortDescription: "Comprehensive commerce training in corporate accounting, business law, banking, income tax, and international trade.",
      overview: "B.Com at IGNOU offers an economical pathway to high-value careers in commerce, CA/CS preparation, banking, and public accounting.",
      highlights: [
        "UGC-DEB recognized degree valid for UPSC and Banking exams",
        "Affordable yearly fee of ₹4,200",
        "Available in both Distance (ODL) and 100% Online modes"
      ],
      curriculum: [
        { semester: "Year 1", subjects: ["Financial Accounting", "Business Law", "Business Organization", "Environmental Studies"] },
        { semester: "Year 2", subjects: ["Corporate Accounting", "Company Law", "Income Tax Law & Practice", "Business Mathematics"] },
        { semester: "Year 3", subjects: ["Cost Accounting", "Auditing & Corporate Governance", "Banking & Insurance", "International Business"] }
      ],
      status: "published",
      createdAt: "2026-01-20T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    },
    {
      id: "ignou-ba",
      type: "ug",
      title: "Bachelor of Arts (BA General / BAG)",
      code: "BAG",
      slug: "bachelor-of-arts-bag",
      level: "Undergraduate (UG)",
      duration: "3 Years",
      fee: "₹12,000 Total",
      eligibility: "10+2 in any stream from recognized board.",
      mode: "Distance",
      badge: "Popular UG",
      shortDescription: "Multidisciplinary humanities program with specializations across History, Political Science, Economics, Psychology, and English.",
      status: "published",
      createdAt: "2026-01-22T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    },
    {
      id: "ignou-bsc",
      type: "ug",
      title: "Bachelor of Science (B.Sc General / BSCG)",
      code: "BSCG",
      slug: "bachelor-of-science-bscg",
      level: "Undergraduate (UG)",
      duration: "3 Years",
      fee: "₹17,100 Total",
      eligibility: "10+2 with Science subjects (Physics, Chemistry, Biology/Maths).",
      mode: "Distance",
      badge: "Hands-on Labs",
      shortDescription: "Science foundation with practical laboratory courses in Physics, Chemistry, Life Sciences, and Mathematics.",
      status: "published",
      createdAt: "2026-02-01T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    },

    // PG Programs
    {
      id: "ignou-mca",
      type: "pg",
      title: "Master of Computer Applications (MCA - 2 Years)",
      code: "MCA",
      slug: "master-of-computer-applications-mca",
      level: "Postgraduate (PG)",
      duration: "2 Years (Revised AICTE)",
      fee: "₹48,000 Total (₹12,000/semester)",
      eligibility: "Passed BCA / B.Sc (Computer Science/IT) or graduation with Maths in 12th/Graduation + bridge courses.",
      mode: "Distance & Online",
      badge: "AICTE Approved",
      shortDescription: "Revised 2-year curriculum aligned with latest AICTE norms covering AI, Machine Learning, Cloud Systems, and Full-Stack Architecture.",
      overview: "The revised 2-year IGNOU MCA program delivers advanced computing education suitable for working tech professionals.",
      highlights: [
        "AICTE and UGC-DEB approved 2-year duration",
        "Includes advanced AI/ML, Cloud Architecture, and Software Engineering",
        "Extensive practical coursework with industry-guided capstone project"
      ],
      curriculum: [
        { semester: "Semester 1", subjects: ["Design & Analysis of Algorithms", "Advanced Computer Networks", "Software Engineering & Architecture", "Python & Data Science Lab"] },
        { semester: "Semester 2", subjects: ["Data Warehousing & Mining", "Object Oriented Analysis & Java", "Cloud Computing & DevOps", "Advanced Java Lab"] },
        { semester: "Semester 3", subjects: ["Artificial Intelligence & Machine Learning", "Mobile Computing", "Cyber Security & Forensics", "AI/ML Lab"] },
        { semester: "Semester 4", subjects: ["Enterprise Architecture", "Research Methodology", "Major Capstone Software Project"] }
      ],
      status: "published",
      createdAt: "2026-01-10T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    },
    {
      id: "ignou-mcom",
      type: "pg",
      title: "Master of Commerce (M.Com)",
      code: "M.COM",
      slug: "master-of-commerce-mcom",
      level: "Postgraduate (PG)",
      duration: "2 Years",
      fee: "₹18,600 Total",
      eligibility: "Bachelor's Degree in Commerce or any recognized Bachelor's Degree with 50% marks.",
      mode: "Distance & Online",
      badge: "Finance & Trade",
      shortDescription: "Advanced business concepts, international finance, corporate strategy, accounting standards, and international marketing.",
      status: "published",
      createdAt: "2026-01-12T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    },
    {
      id: "ignou-meg",
      type: "pg",
      title: "Master of Arts in English (MEG)",
      code: "MEG",
      slug: "master-of-arts-in-english-meg",
      level: "Postgraduate (PG)",
      duration: "2 Years",
      fee: "₹14,600 Total",
      eligibility: "Bachelor's Degree or a higher degree from a recognized University.",
      mode: "Distance",
      badge: "High Enrolment",
      shortDescription: "British literature, American writing, Indian writing in English, literary theory, and linguistics.",
      status: "published",
      createdAt: "2026-01-15T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    },

    // MBA Specializations
    {
      id: "ignou-mba-general",
      type: "mba",
      title: "IGNOU MBA (General Management)",
      code: "MBA",
      slug: "ignou-mba-general-management",
      level: "Postgraduate (PG)",
      duration: "2 Years (4 Semesters)",
      fee: "₹62,000 Total (₹15,500/semester)",
      eligibility: "Passed Bachelor Degree of Minimum 3 years with at least 50% marks (45% for reserved category). Direct admission based on merit.",
      mode: "Distance & Online",
      badge: "Flagship MBA",
      shortDescription: "AICTE-approved master degree offering dual specializations across Finance, Marketing, Human Resources, and Operations.",
      overview: "IGNOU MBA is India's most popular open management degree, approved by AICTE and UGC-DEB, providing top-tier corporate business management education at a fraction of private B-school costs.",
      highlights: [
        "AICTE & UGC-DEB recognized degree",
        "Direct admission for eligible bachelor graduates",
        "Total fee of just ₹62,000 for entire 2 years",
        "Options for dual specialization in final year"
      ],
      curriculum: [
        { semester: "Semester 1", subjects: ["Management Functions & Organizational Behaviour", "Human Resource Management", "Economic & Social Environment", "Accounting for Managers"] },
        { semester: "Semester 2", subjects: ["Marketing Management", "Financial Management", "Quantitative Analysis for Managerial Applications", "Operations Management"] },
        { semester: "Semester 3", subjects: ["Strategic Management", "Information Systems for Managers", "Specialization Elective 1", "Specialization Elective 2"] },
        { semester: "Semester 4", subjects: ["Business Ethics & Corporate Governance", "Specialization Elective 3", "Specialization Elective 4", "Project Work / Dissertation"] }
      ],
      status: "published",
      createdAt: "2026-01-05T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    },
    {
      id: "ignou-mba-banking",
      type: "mba",
      title: "MBA in Banking & Finance (MPB)",
      code: "MPB",
      slug: "mba-banking-and-finance-mpb",
      level: "Postgraduate (PG)",
      duration: "2 Years",
      fee: "₹62,000 Total",
      eligibility: "Bachelor's Degree + CAIIB certification from Indian Institute of Banking & Finance (IIBF) or 2 years banking experience.",
      mode: "Distance",
      badge: "IIBF Collab",
      shortDescription: "Specially structured in collaboration with the Indian Institute of Banking and Finance (IIBF) for banking and financial sector executives.",
      status: "published",
      createdAt: "2026-01-08T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    },
    {
      id: "ignou-online-mba",
      type: "mba",
      title: "100% Online MBA Program",
      code: "MBAOL",
      slug: "100-percent-online-mba-program",
      level: "Postgraduate (PG)",
      duration: "2 Years",
      fee: "₹62,000 Total",
      eligibility: "Bachelor's Degree of 3+ years with 50% marks (45% for reserved category).",
      mode: "Online",
      badge: "Fully Digital",
      shortDescription: "Complete the entire MBA through an advanced online LMS with live lectures, discussion forums, and online proctored examinations.",
      status: "published",
      createdAt: "2026-01-18T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    }
  ],

  blogs: [
    {
      id: "blog-admission-guide-2026",
      title: "Step-by-Step IGNOU Admission Guide for July 2026-27 Session",
      slug: "step-by-step-ignou-admission-guide-2026",
      excerpt: "Everything you need to know about fresh admissions, Samarth portal registration, required documents, fee concessions, and confirmation.",
      content: "Indira Gandhi National Open University (IGNOU) conducts admissions twice a year: January and July cycles. This complete guide provides step-by-step instructions for enrolling in over 150 undergraduate, postgraduate, diploma, and certificate programs via the official Samarth portal.",
      category: "Admission Updates",
      author: "Academic Advisory Team",
      readTime: "6 min read",
      tags: ["Admission 2026-27", "Samarth Portal", "Eligibility", "IGNOU Guide"],
      status: "published",
      createdAt: "2026-02-10T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    },
    {
      id: "blog-assignment-submission-guide",
      title: "How to Submit IGNOU Assignments Online & Offline with High Marks",
      slug: "how-to-submit-ignou-assignments-online-offline",
      excerpt: "Assignments carry 30% weightage in your final grade card. Learn the correct format, front page layout, submission deadlines, and evaluation tricks.",
      content: "Submitting assignments on time is mandatory to appear for the Term-End Examinations (TEE). In this detailed guide, we break down how to prepare your handwritten assignments, verify your regional center's submission mode (Google Form / Portal / Study Center submission), and check your assignment status marks.",
      category: "Student Guides",
      author: "Senior Counselor",
      readTime: "5 min read",
      tags: ["Assignments", "TEE Exams", "Study Centers", "Tips"],
      status: "published",
      createdAt: "2026-02-15T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    },
    {
      id: "blog-passing-marks-grading-system",
      title: "IGNOU Passing Marks & 10-Point Grading System Explained",
      slug: "ignou-passing-marks-and-grading-system-explained",
      excerpt: "A comprehensive breakdown of the 35% vs 40% rule across Bachelor's, Master's, and Diploma programs.",
      content: "Many students are confused about the exact passing threshold in IGNOU theory and assignment components. Learn how GPA, SGPA, CGPA, and letter grades are calculated, and what happens if you score lower in assignments than theory exams.",
      category: "Exam & Results",
      author: "Academic Desk",
      readTime: "4 min read",
      tags: ["Grade Card", "Passing Marks", "Grading System"],
      status: "published",
      createdAt: "2026-02-20T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    }
  ],

  studentResources: [
    {
      id: "res-hall-ticket",
      title: "Hall Ticket / Admit Card (TEE)",
      slug: "download-hall-ticket-admit-card",
      category: "Exams",
      badge: "Direct Download",
      description: "Download Term-End Examination (TEE) Hall Ticket by entering your 9-digit or 10-digit enrollment number.",
      linkText: "Download Hall Ticket Portal",
      linkUrl: "https://ignou.ac.in",
      instructions: [
        "Enter your 9 or 10 digit Enrollment Number",
        "Select your Program Code (e.g., BCA, MBA, BCOM)",
        "Click Submit to view and print your Hall Ticket",
        "Carry your printed Hall Ticket along with valid IGNOU Student Identity Card to the exam center"
      ],
      iconName: "FileText",
      status: "published",
      createdAt: "2026-01-01T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    },
    {
      id: "res-assignment-status",
      title: "Assignment Question Papers & Submission Status",
      slug: "assignment-question-papers-and-status",
      category: "Assignments",
      badge: "30% Weightage",
      description: "Download official session assignment booklets and check the status of marks uploaded by regional study centers.",
      linkText: "Check Assignment Status",
      linkUrl: "https://ignou.ac.in",
      instructions: [
        "Download latest assignment question papers for your respective session",
        "Prepare handwritten responses on A4 sheets",
        "Attach the official IGNOU assignment front page with enrollment and study center details",
        "Submit at your allotted Study Center or uploaded online if instructed by the Regional Center"
      ],
      iconName: "CheckCircle",
      status: "published",
      createdAt: "2026-01-02T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    },
    {
      id: "res-grade-card",
      title: "Grade Card & Term-End Examination Results",
      slug: "grade-card-and-tee-results",
      category: "Results",
      badge: "Real-time Sync",
      description: "View consolidated statement of marks for all completed assignment, theory, lab, and project components.",
      linkText: "View Grade Card",
      linkUrl: "https://ignou.ac.in",
      iconName: "Award",
      status: "published",
      createdAt: "2026-01-03T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    },
    {
      id: "res-re-registration",
      title: "Samarth Re-Registration Portal",
      slug: "samarth-re-registration-portal",
      category: "Admissions",
      badge: "Next Semester",
      description: "Official portal to re-register and pay module fees for the next semester/year without waiting for previous results.",
      linkText: "Proceed to Re-Registration",
      linkUrl: "https://ignou.samarth.edu.in",
      iconName: "Clock",
      status: "published",
      createdAt: "2026-01-04T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    },
    {
      id: "res-egyankosh",
      title: "eGyanKosh Free Study Books (PDF Repository)",
      slug: "egyankosh-free-study-books-download",
      category: "Study Material",
      badge: "100% Free",
      description: "Access the National Digital Repository containing self-learning materials (SLMs) for all IGNOU courses in PDF format.",
      linkText: "Access eGyanKosh",
      linkUrl: "https://egyankosh.ac.in",
      iconName: "BookOpen",
      status: "published",
      createdAt: "2026-01-05T10:00:00.000Z",
      updatedAt: "2026-10-24T12:00:00.000Z"
    }
  ],

  homePage: {
    announcementTicker: "",
    heroBadge: "NAAC A++ Accredited • UGC-DEB Approved Central University",
    heroHeadline: "Empower Your Career with IGNOU Distance & Online Degrees 2026-27",
    heroSubtitle: "Admissions open for July 2026-27 academic session. Choose from 150+ UGC-DEB recognized degree programs with flexible self-paced learning and pan-India exam centers.",
    learnersCount: "4.0M+",
    programsCount: "150+",
    naacRating: "NAAC A++",
    centersCount: "67",
    admissionFormHeading: "Apply for Admission 2026-27",
    admissionFormSubheading: "Check eligibility, course fee & get personalized expert counseling",
    aboutTitle: "About IGNOU Distance Education – Indira Gandhi National Open University",
    aboutParagraphs: [
      "Established in 1985, IGNOU, or Indira Gandhi National Open University, is India's sole national and the world's largest open university. Renowned for its comprehensive range of undergraduate and postgraduate courses. IGNOU is a popular choice for distance and online education.",
      "The university is recognized for offering flexible learning opportunities to students, working professionals, homemakers, and aspirants preparing for competitive examinations. IGNOU regularly updates its curriculum to meet current industry and academic requirements while maintaining affordable and accessible education.",
      "They admit students in January and July sessions and offer over 333 courses in various subjects including Online MBA. It has study centers all over India. They cover subjects like Arts, Commerce, Management, and research programs, providing different interests. Known for its strong educational foundation and supportive faculty, This is a top institution in the field of Online and Distance Education."
    ],
    latestNews: [
      {
        id: "news-1",
        title: "IGNOU Online Admission Portal for July 2026-27",
        link: "#admission-form",
        isNew: true,
        date: "July 2026-27"
      },
      {
        id: "news-2",
        title: "IGNOU 2026-27 Assignment – Find Course Code, Download & Verify Validity",
        link: "#assignment-status",
        isNew: true,
        date: "Latest"
      },
      {
        id: "news-3",
        title: "IGNOU New Registration for July 2026-27",
        link: "#admission-form",
        isNew: true,
        date: "July 2026-27"
      },
      {
        id: "news-4",
        title: "DEB ID is mandatory for learners enrolling in ODL/Online programmes",
        link: "#deb-guidelines",
        isNew: true,
        date: "Notice"
      },
      {
        id: "news-5",
        title: "Guidelines and Instructions for Submission of On-Line Examination form Only for ODL & Online Programmes",
        link: "#exam-form",
        isNew: true,
        date: "TEE Exam"
      },
      {
        id: "news-6",
        title: "Date Sheet for Term End Examination (TEE) Released",
        link: "#datesheet",
        isNew: true,
        date: "TEE"
      },
      {
        id: "news-7",
        title: "Re-Registration Open for Next Semester / Year Students",
        link: "#re-registration",
        isNew: false,
        date: "Registration"
      }
    ],
    updatedAt: "2026-10-24T12:00:00.000Z"
  },

  settings: {
    portalName: "Edukyu x IGNOU Portal",
    supportPhone: "+91 83368 89553",
    supportEmail: "hi@edukyu.com",
    campusAddress: "IGNOU Maidan Garhi, New Delhi - 110068, India",
    admissionSession: "July 2026-27",
    socialLinks: {
      facebook: "https://facebook.com/ignou",
      twitter: "https://twitter.com/officialignou",
      youtube: "https://youtube.com/ignou",
      linkedin: "https://linkedin.com/school/ignou"
    },
    updatedAt: "2026-10-24T12:00:00.000Z"
  },
  adminUsers: DEFAULT_ADMIN_USERS,
};

// Helper to ensure data directory and file exist
function getStore(): DataStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2), "utf8");
      return INITIAL_DATA;
    }
    const content = fs.readFileSync(DATA_FILE, "utf8");
    const store = JSON.parse(content) as DataStore;
    if (!store.adminUsers || store.adminUsers.length === 0) {
      store.adminUsers = [...DEFAULT_ADMIN_USERS];
      saveStore(store);
    }
    return store;
  } catch (e) {
    console.error("[admin-data] Read Error:", e);
    return INITIAL_DATA;
  }
}

function saveStore(store: DataStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch (e) {
    console.error("[admin-data] Write Error:", e);
  }
}

// Status helper
export async function getDatabaseStatus(): Promise<{
  connected: boolean;
  provider: "Google Cloud Firestore" | "Local File Store";
  projectId: string;
  databaseId: string;
}> {
  const isAvailable = isFirestoreAvailable();
  return {
    connected: isAvailable,
    provider: isAvailable ? "Google Cloud Firestore" : "Local File Store",
    projectId: getFirebaseProjectId(),
    databaseId: "default",
  };
}

// Auto-seed helper to ensure Firestore is never empty
let isSeededChecked = false;
async function ensureFirestoreSeeded(): Promise<void> {
  if (isSeededChecked) return;
  const db = getDb();
  if (!db) return;
  try {
    const snap = await db.collection("programs").limit(1).get();
    if (snap.empty) {
      console.log("[admin-data:firestore] Seeding initial data to Firestore...");
      const store = getStore();
      const pBatch = db.batch();
      store.programs.forEach((p) => {
        pBatch.set(db.collection("programs").doc(p.id), p);
      });
      await pBatch.commit();

      const bBatch = db.batch();
      store.blogs.forEach((b) => {
        bBatch.set(db.collection("blogs").doc(b.id), b);
      });
      await bBatch.commit();

      const rBatch = db.batch();
      store.studentResources.forEach((r) => {
        rBatch.set(db.collection("studentResources").doc(r.id), r);
      });
      await rBatch.commit();

      await db.collection("homePage").doc("default").set(store.homePage);
      await db.collection("settings").doc("default").set(store.settings);

      const uBatch = db.batch();
      (store.adminUsers || DEFAULT_ADMIN_USERS).forEach((u) => {
        uBatch.set(db.collection("adminUsers").doc(u.id), u);
      });
      await uBatch.commit();
      console.log("[admin-data:firestore] Seeding completed!");
    }

    const mbaSnap = await db.collection("mba_specializations").limit(1).get();
    if (mbaSnap.empty) {
      const store = getStore();
      if (store.mbaSpecializations && store.mbaSpecializations.length > 0) {
        const mBatch = db.batch();
        store.mbaSpecializations.forEach((m) => {
          mBatch.set(db.collection("mba_specializations").doc(m.id), m);
        });
        await mBatch.commit();
      }
    }
    isSeededChecked = true;
  } catch (err) {
    console.error("[admin-data:firestore] ensureFirestoreSeeded error:", err);
  }
}

// PROGRAM CRUD
export async function getPrograms(type?: "ug" | "pg" | "mba"): Promise<Program[]> {
  await ensureFirestoreSeeded();
  const db = getDb();
  if (db) {
    try {
      let query: FirebaseFirestore.Query = db.collection("programs");
      if (type) {
        query = query.where("type", "==", type);
      }
      const snap = await query.get();
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as Program);
        list.sort((a, b) => {
          if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
            return a.displayOrder - b.displayOrder;
          }
          return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
        });
        return list;
      }
    } catch (err) {
      console.error("[admin-data:firestore] getPrograms error:", err);
    }
  }

  // Fallback to local store
  const store = getStore();
  if (type) {
    return store.programs.filter((p) => p.type === type);
  }
  return store.programs;
}

export async function getProgramById(id: string): Promise<Program | null> {
  await ensureFirestoreSeeded();
  const db = getDb();
  if (db) {
    try {
      const docSnap = await db.collection("programs").doc(id).get();
      if (docSnap.exists) {
        return docSnap.data() as Program;
      }
      const slugSnap = await db.collection("programs").where("slug", "==", id).limit(1).get();
      if (!slugSnap.empty) {
        return slugSnap.docs[0].data() as Program;
      }
    } catch (err) {
      console.error("[admin-data:firestore] getProgramById error:", err);
    }
  }

  const store = getStore();
  return store.programs.find((p) => p.id === id || p.slug === id) || null;
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const p = await getProgramById(slug);
  if (p) return p;
  const all = await getPrograms();
  const cleanSlug = slug.toLowerCase().trim();

  // 1. Exact match on slug, id, or code
  const exact = all.find(
    (item) =>
      item.slug.toLowerCase() === cleanSlug ||
      item.id.toLowerCase() === cleanSlug ||
      item.code?.toLowerCase() === cleanSlug
  );
  if (exact) return exact;

  // 2. Flexible match (e.g. mba, bca, meg, mcom)
  return (
    all.find(
      (item) =>
        (item.code && cleanSlug.split("-").includes(item.code.toLowerCase())) ||
        item.slug.toLowerCase().includes(cleanSlug) ||
        cleanSlug.includes(item.slug.toLowerCase())
    ) || null
  );
}

export async function saveProgram(program: Program): Promise<Program> {
  const now = new Date().toISOString();
  const id = program.id || `program-${Date.now()}`;
  const toSave: Program = {
    ...program,
    id,
    createdAt: program.createdAt || now,
    updatedAt: now,
  };

  const db = getDb();
  if (db) {
    try {
      await db.collection("programs").doc(id).set(toSave, { merge: true });
    } catch (err) {
      console.error("[admin-data:firestore] saveProgram error:", err);
    }
  }

  const store = getStore();
  const idx = store.programs.findIndex((p) => p.id === id);
  if (idx >= 0) {
    store.programs[idx] = toSave;
  } else {
    store.programs.unshift(toSave);
  }
  saveStore(store);

  return toSave;
}

export async function deleteProgram(id: string): Promise<boolean> {
  let deleted = false;
  const db = getDb();
  if (db) {
    try {
      await db.collection("programs").doc(id).delete();
      deleted = true;
    } catch (err) {
      console.error("[admin-data:firestore] deleteProgram error:", err);
    }
  }

  const store = getStore();
  const initialLen = store.programs.length;
  store.programs = store.programs.filter((p) => p.id !== id);
  if (store.programs.length !== initialLen) {
    saveStore(store);
    deleted = true;
  }
  return deleted;
}

// BLOG CRUD
export async function getBlogs(): Promise<Blog[]> {
  await ensureFirestoreSeeded();
  const db = getDb();
  if (db) {
    try {
      const snap = await db.collection("blogs").get();
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as Blog);
        list.sort((a, b) => {
          if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
            return a.displayOrder - b.displayOrder;
          }
          return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
        });
        return list;
      }
    } catch (err) {
      console.error("[admin-data:firestore] getBlogs error:", err);
    }
  }

  const store = getStore();
  return store.blogs;
}

export async function getBlogById(id: string): Promise<Blog | null> {
  await ensureFirestoreSeeded();
  const db = getDb();
  if (db) {
    try {
      const docSnap = await db.collection("blogs").doc(id).get();
      if (docSnap.exists) {
        return docSnap.data() as Blog;
      }
      const slugSnap = await db.collection("blogs").where("slug", "==", id).limit(1).get();
      if (!slugSnap.empty) {
        return slugSnap.docs[0].data() as Blog;
      }
    } catch (err) {
      console.error("[admin-data:firestore] getBlogById error:", err);
    }
  }

  const store = getStore();
  return store.blogs.find((b) => b.id === id || b.slug === id) || null;
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const b = await getBlogById(slug);
  if (b) return b;
  const all = await getBlogs();
  const cleanSlug = slug.toLowerCase().trim();

  // 1. Exact match on slug or id
  const exact = all.find(
    (item) =>
      item.slug.toLowerCase() === cleanSlug ||
      item.id.toLowerCase() === cleanSlug
  );
  if (exact) return exact;

  // 2. Flexible match
  return (
    all.find(
      (item) =>
        item.slug.toLowerCase().includes(cleanSlug) ||
        cleanSlug.includes(item.slug.toLowerCase())
    ) || null
  );
}

export async function saveBlog(blog: Blog): Promise<Blog> {
  const now = new Date().toISOString();
  const id = blog.id || `blog-${Date.now()}`;
  const toSave: Blog = {
    ...blog,
    id,
    createdAt: blog.createdAt || now,
    updatedAt: now,
  };

  const db = getDb();
  if (db) {
    try {
      await db.collection("blogs").doc(id).set(toSave, { merge: true });
    } catch (err) {
      console.error("[admin-data:firestore] saveBlog error:", err);
    }
  }

  const store = getStore();
  const idx = store.blogs.findIndex((b) => b.id === id);
  if (idx >= 0) {
    store.blogs[idx] = toSave;
  } else {
    store.blogs.unshift(toSave);
  }
  saveStore(store);

  return toSave;
}

export async function deleteBlog(id: string): Promise<boolean> {
  let deleted = false;
  const db = getDb();
  if (db) {
    try {
      await db.collection("blogs").doc(id).delete();
      deleted = true;
    } catch (err) {
      console.error("[admin-data:firestore] deleteBlog error:", err);
    }
  }

  const store = getStore();
  const initialLen = store.blogs.length;
  store.blogs = store.blogs.filter((b) => b.id !== id);
  if (store.blogs.length !== initialLen) {
    saveStore(store);
    deleted = true;
  }
  return deleted;
}

// MBA SPECIALIZATIONS CRUD
export async function getMbaSpecializations(): Promise<MbaSpecialization[]> {
  await ensureFirestoreSeeded();
  const db = getDb();
  if (db) {
    try {
      const snap = await db.collection("mba_specializations").get();
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as MbaSpecialization);
        list.sort((a, b) => {
          if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
            return a.displayOrder - b.displayOrder;
          }
          return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
        });
        return list;
      }
    } catch (err) {
      console.error("[admin-data:firestore] getMbaSpecializations error:", err);
    }
  }

  const store = getStore();
  const localList = [...(store.mbaSpecializations || [])];
  localList.sort((a, b) => {
    if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
      return a.displayOrder - b.displayOrder;
    }
    return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
  });
  return localList;
}

export async function getMbaSpecializationBySlug(slug: string): Promise<MbaSpecialization | null> {
  const all = await getMbaSpecializations();
  const cleanSlug = slug.toLowerCase().trim();
  return (
    all.find(
      (item) =>
        item.slug.toLowerCase() === cleanSlug ||
        item.id.toLowerCase() === cleanSlug ||
        item.slug.toLowerCase().replace("ignou-", "") === cleanSlug.replace("ignou-", "")
    ) || null
  );
}

// STUDENT RESOURCE CRUD
export async function getStudentResources(category?: string): Promise<StudentResource[]> {
  await ensureFirestoreSeeded();
  const db = getDb();
  if (db) {
    try {
      let query: FirebaseFirestore.Query = db.collection("studentResources");
      if (category) {
        query = query.where("category", "==", category);
      }
      const snap = await query.get();
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as StudentResource);
        list.sort((a, b) => {
          if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
            return a.displayOrder - b.displayOrder;
          }
          return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
        });
        return list;
      }
    } catch (err) {
      console.error("[admin-data:firestore] getStudentResources error:", err);
    }
  }

  const store = getStore();
  if (category) {
    return store.studentResources.filter((r) => r.category === category);
  }
  return store.studentResources;
}

export async function getStudentResourceById(id: string): Promise<StudentResource | null> {
  await ensureFirestoreSeeded();
  const db = getDb();
  if (db) {
    try {
      const docSnap = await db.collection("studentResources").doc(id).get();
      if (docSnap.exists) {
        return docSnap.data() as StudentResource;
      }
      const slugSnap = await db.collection("studentResources").where("slug", "==", id).limit(1).get();
      if (!slugSnap.empty) {
        return slugSnap.docs[0].data() as StudentResource;
      }
    } catch (err) {
      console.error("[admin-data:firestore] getStudentResourceById error:", err);
    }
  }

  const store = getStore();
  return store.studentResources.find((r) => r.id === id || r.slug === id) || null;
}

export async function saveStudentResource(resource: StudentResource): Promise<StudentResource> {
  const now = new Date().toISOString();
  const id = resource.id || `res-${Date.now()}`;
  const toSave: StudentResource = {
    ...resource,
    id,
    createdAt: resource.createdAt || now,
    updatedAt: now,
  };

  const db = getDb();
  if (db) {
    try {
      await db.collection("studentResources").doc(id).set(toSave, { merge: true });
    } catch (err) {
      console.error("[admin-data:firestore] saveStudentResource error:", err);
    }
  }

  const store = getStore();
  const idx = store.studentResources.findIndex((r) => r.id === id);
  if (idx >= 0) {
    store.studentResources[idx] = toSave;
  } else {
    store.studentResources.unshift(toSave);
  }
  saveStore(store);

  return toSave;
}

export async function deleteStudentResource(id: string): Promise<boolean> {
  let deleted = false;
  const db = getDb();
  if (db) {
    try {
      await db.collection("studentResources").doc(id).delete();
      deleted = true;
    } catch (err) {
      console.error("[admin-data:firestore] deleteStudentResource error:", err);
    }
  }

  const store = getStore();
  const initialLen = store.studentResources.length;
  store.studentResources = store.studentResources.filter((r) => r.id !== id);
  if (store.studentResources.length !== initialLen) {
    saveStore(store);
    deleted = true;
  }
  return deleted;
}

// HOME PAGE DATA
export async function getHomePageData(): Promise<HomePageData> {
  await ensureFirestoreSeeded();
  const store = getStore();
  const db = getDb();
  if (db) {
    try {
      const snap = await db.collection("homePage").doc("default").get();
      if (snap.exists) {
        const firestoreData = snap.data() as HomePageData;
        return {
          ...store.homePage,
          ...firestoreData,
          metaTitle: firestoreData.metaTitle || store.homePage.metaTitle,
          metaDescription: firestoreData.metaDescription || store.homePage.metaDescription,
          guide: firestoreData.guide || store.homePage.guide,
          aboutTitle: firestoreData.aboutTitle || store.homePage.aboutTitle,
          aboutParagraphs:
            firestoreData.aboutParagraphs && firestoreData.aboutParagraphs.length > 0
              ? firestoreData.aboutParagraphs
              : store.homePage.aboutParagraphs,
          latestNews:
            firestoreData.latestNews && firestoreData.latestNews.length > 0
              ? firestoreData.latestNews
              : store.homePage.latestNews,
        };
      }
    } catch (err) {
      console.error("[admin-data:firestore] getHomePageData error:", err);
    }
  }

  return store.homePage;
}

export async function saveHomePageData(data: Partial<HomePageData>): Promise<HomePageData> {
  const store = getStore();
  const updated: HomePageData = {
    ...store.homePage,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const db = getDb();
  if (db) {
    try {
      await db.collection("homePage").doc("default").set(updated, { merge: true });
    } catch (err) {
      console.error("[admin-data:firestore] saveHomePageData error:", err);
    }
  }

  store.homePage = updated;
  saveStore(store);
  return updated;
}

// SETTINGS
export async function getSiteSettings(): Promise<SiteSettings> {
  await ensureFirestoreSeeded();
  const db = getDb();
  if (db) {
    try {
      const snap = await db.collection("settings").doc("default").get();
      if (snap.exists) {
        return snap.data() as SiteSettings;
      }
    } catch (err) {
      console.error("[admin-data:firestore] getSiteSettings error:", err);
    }
  }

  const store = getStore();
  return store.settings;
}

export async function saveSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const store = getStore();
  const updated: SiteSettings = {
    ...store.settings,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const db = getDb();
  if (db) {
    try {
      await db.collection("settings").doc("default").set(updated, { merge: true });
    } catch (err) {
      console.error("[admin-data:firestore] saveSiteSettings error:", err);
    }
  }

  store.settings = updated;
  saveStore(store);
  return updated;
}

// DASHBOARD STATS
export async function getDashboardStats(): Promise<DashboardStats> {
  const [programs, blogs, resources, media] = await Promise.all([
    getPrograms(),
    getBlogs(),
    getStudentResources(),
    getMediaList(),
  ]);

  const totalUg = programs.filter((p) => p.type === "ug").length;
  const totalPg = programs.filter((p) => p.type === "pg").length;
  const totalMba = programs.filter((p) => p.type === "mba").length;
  const totalBlogs = blogs.length;
  const totalStudentResources = resources.length;
  const totalMedia = media.length;

  const activityList: DashboardStats["recentActivity"] = [];

  programs.slice(0, 4).forEach((p) => {
    activityList.push({
      id: p.id,
      type: p.type,
      title: p.title,
      href: `/admin/${p.type === "ug" ? "ug-programs" : p.type === "pg" ? "pg-programs" : "mba-specializations"}/${p.id}`,
      status: p.status,
      updatedAt: p.updatedAt,
    });
  });

  blogs.slice(0, 3).forEach((b) => {
    activityList.push({
      id: b.id,
      type: "blog",
      title: b.title,
      href: `/admin/blogs/${b.id}`,
      status: b.status,
      updatedAt: b.updatedAt,
    });
  });

  resources.slice(0, 2).forEach((r) => {
    activityList.push({
      id: r.id,
      type: "student",
      title: r.title,
      href: `/admin/student-zone/${r.id}`,
      status: r.status,
      updatedAt: r.updatedAt,
    });
  });

  activityList.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return {
    totalUg,
    totalPg,
    totalMba,
    totalBlogs,
    totalStudentResources,
    totalMedia,
    recentActivity: activityList.slice(0, 6),
  };
}

// MEDIA CRUD
export async function getMediaList(): Promise<MediaItem[]> {
  const db = getDb();
  if (db) {
    try {
      const snap = await db.collection("media").get();
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as MediaItem);
        list.sort((a, b) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime());
        return list;
      }
    } catch (err) {
      console.error("[admin-data:firestore] getMediaList error:", err);
    }
  }

  const store = getStore();
  return store.media || [];
}

export async function addMediaItem(item: MediaItem): Promise<MediaItem> {
  const db = getDb();
  if (db) {
    try {
      await db.collection("media").doc(item.id).set(item, { merge: true });
    } catch (err) {
      console.error("[admin-data:firestore] addMediaItem error:", err);
    }
  }

  const store = getStore();
  if (!store.media) store.media = [];
  store.media.unshift(item);
  saveStore(store);
  return item;
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  let deleted = false;
  const db = getDb();
  if (db) {
    try {
      await db.collection("media").doc(id).delete();
      deleted = true;
    } catch (err) {
      console.error("[admin-data:firestore] deleteMediaItem error:", err);
    }
  }

  const store = getStore();
  if (!store.media) return deleted;
  const initialLen = store.media.length;
  store.media = store.media.filter((m) => m.id !== id);
  if (store.media.length !== initialLen) {
    saveStore(store);
    deleted = true;
  }
  return deleted;
}

// ADMIN USER & PASSWORD MANAGEMENT
export async function getAdminUsers(): Promise<StoredAdminUser[]> {
  const db = getDb();
  if (db) {
    try {
      const snap = await db.collection("adminUsers").get();
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as StoredAdminUser);
      }
    } catch (err) {
      console.error("[admin-data:firestore] getAdminUsers error:", err);
    }
  }

  const store = getStore();
  return store.adminUsers || DEFAULT_ADMIN_USERS;
}

export async function getAdminByEmail(email: string): Promise<StoredAdminUser | null> {
  const users = await getAdminUsers();
  const clean = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === clean) || null;
}

export async function updateAdminPassword(
  email: string,
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const clean = email.trim().toLowerCase();
  const users = await getAdminUsers();
  const user = users.find((u) => u.email.toLowerCase() === clean);

  if (!user) {
    return { success: false, error: "Administrator account not found." };
  }

  if (user.password !== oldPassword) {
    return { success: false, error: "Current password is incorrect." };
  }

  if (newPassword.trim().length < 6) {
    return { success: false, error: "New password must be at least 6 characters long." };
  }

  user.password = newPassword.trim();
  user.updatedAt = new Date().toISOString();

  const db = getDb();
  if (db) {
    try {
      await db.collection("adminUsers").doc(user.id).set(user, { merge: true });
    } catch (err) {
      console.error("[admin-data:firestore] updateAdminPassword error:", err);
    }
  }

  const store = getStore();
  if (!store.adminUsers || store.adminUsers.length === 0) {
    store.adminUsers = [...DEFAULT_ADMIN_USERS];
  }
  const sIdx = store.adminUsers.findIndex((u) => u.email.toLowerCase() === clean);
  if (sIdx >= 0) {
    store.adminUsers[sIdx] = user;
  } else {
    store.adminUsers.push(user);
  }
  saveStore(store);

  return { success: true };
}

function withTimeout<T>(promise: Promise<T>, ms: number = 2000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    ),
  ]);
}

export async function insertLead(leadData: Partial<Lead>): Promise<{ id: string }> {
  const now = new Date().toISOString();
  const leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const payload: Lead = {
    id: leadId,
    name: leadData.name || "",
    mobile: leadData.mobile || "",
    email: leadData.email || "",
    city: leadData.city || leadData.state || "Delhi",
    state: leadData.state || leadData.city || "Delhi",
    course: leadData.course || leadData.programme || "",
    programme: leadData.programme || leadData.course || "",
    prog_id: leadData.prog_id || "",
    university_name: leadData.university_name || "Indira Gandhi National Open University (IGNOU)",
    university_code: leadData.university_code || "IGNOU",
    source_name: leadData.source_name || "WS",
    source_id: leadData.source_id || "49",
    supplier_id: leadData.supplier_id || "",
    page_url: leadData.page_url || "",
    data_from: leadData.data_from || leadData.page_url || "",
    selected_challenges: leadData.selected_challenges || "",
    crm_status: leadData.crm_status || "pending",
    crm_lead_id: leadData.crm_lead_id || "",
    crm_response: leadData.crm_response || "",
    status: leadData.status || "new",
    created_at_iso: now,
    created_at: now,
  };

  const db = getDb();
  let createdId = leadId;
  if (db) {
    try {
      const docRef = await withTimeout(db.collection("crm_leads").add(payload), 2000);
      createdId = docRef.id;
      payload.id = createdId;
    } catch (err) {
      console.warn("[admin-data:firestore] insertLead warning (falling back to local):", err);
    }
  }

  // Also sync to local admin store
  try {
    const store = getStore();
    if (!store.crmLeads) {
      store.crmLeads = [];
    }
    store.crmLeads.unshift(payload);
    if (store.crmLeads.length > 500) {
      store.crmLeads = store.crmLeads.slice(0, 500);
    }
    saveStore(store);
  } catch (err) {
    console.warn("[admin-data:local] insertLead saveStore warning:", err);
  }

  return { id: createdId };
}

export async function getLeads(options?: {
  limit?: number;
  search?: string;
  course?: string;
}): Promise<Lead[]> {
  const limitNum = options?.limit || 100;
  const db = getDb();
  if (db) {
    try {
      const snap = await withTimeout(
        db
          .collection("crm_leads")
          .orderBy("created_at_iso", "desc")
          .limit(limitNum)
          .get(),
        2000
      );

      const leads: Lead[] = [];
      snap.forEach((doc: any) => {
        leads.push({ id: doc.id, ...doc.data() } as Lead);
      });
      if (leads.length > 0) {
        return leads;
      }
    } catch (err) {
      console.warn("[admin-data:firestore] getLeads fallback to local:", err);
    }
  }

  const store = getStore();
  let leads = store.crmLeads || [];
  if (options?.course) {
    leads = leads.filter((l) => l.course === options.course || l.programme === options.course);
  }
  if (options?.search) {
    const s = options.search.toLowerCase();
    leads = leads.filter(
      (l) =>
        l.name.toLowerCase().includes(s) ||
        l.email.toLowerCase().includes(s) ||
        l.mobile.includes(s)
    );
  }
  return leads.slice(0, limitNum);
}

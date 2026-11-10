export interface Program {
  id: string;
  type: "ug" | "pg" | "mba";
  title: string;
  code: string;
  slug: string;
  level: string;
  duration: string;
  fee: string;
  eligibility: string;
  mode: "Distance" | "Online" | "Distance & Online";
  badge?: string;
  shortDescription: string;
  overview?: string;
  highlights?: string[];
  curriculum?: { semester: string; subjects: string[] }[];
  faqs?: { question: string; answer: string }[];
  metaTitle?: string;
  metaDescription?: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  coverImage?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
}

export interface StudentResource {
  id: string;
  title: string;
  slug: string;
  category: "Exams" | "Assignments" | "Results" | "Admissions" | "Study Material" | "Datesheet";
  badge?: string;
  description: string;
  linkText: string;
  linkUrl: string;
  instructions?: string[];
  iconName?: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  link?: string;
  isNew?: boolean;
  date?: string;
}

export interface HomeGuideFAQ {
  question: string;
  answer: string;
}

export interface HomeGuideData {
  metaTitle: string;
  metaDescription: string;
  guideTitle: string;
  guideIntro: string;
  whatIsIgnou: string;
  coursesOffered: {
    intro: string;
    items: string[];
    note: string;
  };
  whyChoose: {
    intro: string;
    items: string[];
  };
  eligibility: {
    intro: string;
    items: string[];
    note: string;
  };
  howToApply: {
    steps: string[];
    linkText: string;
    linkUrl: string;
  };
  documentsRequired: string[];
  studyMaterial: string;
  results: string;
  regionalCentres: string;
  commonMistakes: string;
  tips: string[];
  faqs: HomeGuideFAQ[];
  conclusion: string;
}

export interface HomePageData {
  metaTitle?: string;
  metaDescription?: string;
  announcementTicker: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubtitle: string;
  learnersCount: string;
  programsCount: string;
  naacRating: string;
  centersCount: string;
  admissionFormHeading: string;
  admissionFormSubheading: string;
  aboutTitle?: string;
  aboutParagraphs?: string[];
  latestNews?: NewsItem[];
  guide?: HomeGuideData;
  updatedAt: string;
}

export interface SiteSettings {
  portalName: string;
  supportPhone: string;
  supportEmail: string;
  campusAddress: string;
  admissionSession: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
}

export interface StoredAdminUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "superadmin";
  updatedAt?: string;
}

export interface DashboardStats {
  totalUg: number;
  totalPg: number;
  totalMba: number;
  totalBlogs: number;
  totalStudentResources: number;
  totalMedia: number;
  recentActivity: {
    id: string;
    type: "ug" | "pg" | "mba" | "blog" | "student";
    title: string;
    href: string;
    status: "published" | "draft";
    updatedAt: string;
  }[];
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  mobile: string;
  email: string;
  city?: string;
  state?: string;
  course?: string;
  programme?: string;
  prog_id?: string;
  university_name?: string;
  university_code?: string;
  source_name?: string;
  source_id?: string;
  supplier_id?: string;
  page_url?: string;
  data_from?: string;
  selected_challenges?: string;
  crm_status?: "synced" | "pending" | "failed";
  crm_lead_id?: string;
  crm_response?: string;
  status?: "new" | "contacted" | "enrolled" | "closed";
  created_at?: any;
  created_at_iso?: string;
}



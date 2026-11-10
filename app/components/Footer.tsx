import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Phone,
  PhoneCall,
  Mail,
} from "lucide-react";
import { SiteSettings } from "@/lib/types";

interface FooterProps {
  settings?: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  // Use official EduKyu helpline details as default
  const phone =
    settings?.supportPhone && settings.supportPhone !== "1800-11-2345"
      ? settings.supportPhone
      : "+91 83368 89553";

  const email =
    settings?.supportEmail &&
    !settings.supportEmail.includes("distanceeducationschool.com")
      ? settings.supportEmail
      : "hi@edukyu.com";

  return (
    <footer className="bg-[#030619] text-slate-300 font-sans border-t border-slate-900/80 relative overflow-hidden">
      {/* Subtle IGNOU Cyan & Blue Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#009FE3]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 relative z-10">
        
        {/* 5-Column Main Grid with perfect 3+2+2+2+3=12 alignment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 items-start">
          
          {/* COLUMN 1: Brand & Accreditation (3 cols on lg) */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-3 min-w-0 space-y-4">
            
            {/* Logo + University Brand Badge */}
            <div className="flex items-center flex-wrap gap-y-2">
              <div className="bg-white px-2.5 py-1.5 rounded-lg inline-flex items-center shadow-xs shrink-0">
                <Image
                  src="/edukyu-logo.png"
                  alt="EduKyu Logo"
                  width={90}
                  height={24}
                  className="h-5 w-auto object-contain"
                />
              </div>

              {/* Vertical Divider */}
              <div className="h-6 w-[1.5px] bg-slate-700/80 mx-2.5 shrink-0" />

              {/* University Title */}
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-base sm:text-lg font-black tracking-wider text-white leading-none">
                  IGNOU
                </span>
                <span className="text-[9px] tracking-widest uppercase font-semibold text-slate-400 mt-1 truncate">
                  DISTANCE & ONLINE EDUCATION
                </span>
              </div>
            </div>

            {/* University Description */}
            <p className="text-xs text-slate-400 leading-relaxed">
              Established in 1985 under an Act of Parliament, offering pioneer distance education programs
              recognized by UGC-DEB and AICTE with NAAC A++ university grade equivalence.
            </p>

            {/* Trust Checkmarks */}
            <div className="space-y-2 pt-1 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>UGC-DEB & AICTE Recognized Degrees</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#009FE3] shrink-0" />
                <span>NAAC A++ Accredited Central University</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Direct Admissions without CUET Requirement</span>
              </div>
            </div>

          </div>

          {/* COLUMN 2: UG PROGRAMS (2 cols on lg) */}
          <div className="lg:col-span-2 min-w-0 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm tracking-wider uppercase mb-3.5 whitespace-nowrap">
              <GraduationCap className="w-4 h-4 text-[#009FE3] shrink-0" />
              <span>UG PROGRAMS</span>
            </div>

            <ul className="space-y-2 text-xs sm:text-[13px] text-slate-400 font-medium">
              <li>
                <Link href="/programs/bachelor-of-arts-bag" className="hover:text-white transition-colors block truncate">
                  Distance &amp; Online BA
                </Link>
              </li>
              <li>
                <Link href="/programs/bachelor-of-commerce-bcom" className="hover:text-white transition-colors block truncate">
                  Distance &amp; Online B.Com
                </Link>
              </li>
              <li>
                <Link href="/programs/bachelor-of-business-administration-bba" className="hover:text-white transition-colors block truncate">
                  Distance &amp; Online BBA
                </Link>
              </li>
              <li>
                <Link href="/ug-programs" className="hover:text-white transition-colors block truncate">
                  BMS (Management)
                </Link>
              </li>
              <li>
                <Link href="/programs/bachelor-of-computer-applications-bca" className="hover:text-white transition-colors block truncate">
                  Distance &amp; Online BCA
                </Link>
              </li>
              <li>
                <Link href="/programs/bachelor-of-science-bscg" className="hover:text-white transition-colors block truncate">
                  Distance &amp; Online B.Sc
                </Link>
              </li>
              <li>
                <Link href="/programs/bachelor-of-education-bed" className="hover:text-white transition-colors block truncate">
                  Distance B.Ed (Teacher Education)
                </Link>
              </li>
              <li>
                <Link href="/programs/bachelor-of-library-and-information-science-blis" className="hover:text-white transition-colors block truncate">
                  Distance &amp; Online BLIS (Library &amp; Info Science)
                </Link>
              </li>
            </ul>

            <div className="pt-1.5">
              <Link
                href="/ug-programs"
                className="text-[#009FE3] hover:text-sky-300 font-semibold inline-flex items-center gap-1.5 text-xs transition-colors"
              >
                <span>All UG Courses</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          </div>

          {/* COLUMN 3: PG & MBA (2 cols on lg) */}
          <div className="lg:col-span-2 min-w-0 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm tracking-wider uppercase mb-3.5 whitespace-nowrap">
              <BookOpen className="w-4 h-4 text-[#009FE3] shrink-0" />
              <span>PG &amp; MBA</span>
            </div>

            <ul className="space-y-2 text-xs sm:text-[13px] text-slate-400 font-medium">
              <li>
                <Link href="/programs/master-of-arts-ma" className="hover:text-white transition-colors block truncate">
                  Distance &amp; Online MA (Master of Arts)
                </Link>
              </li>
              <li>
                <Link href="/programs/master-of-business-administration-mba" className="hover:text-white transition-colors block truncate">
                  Distance &amp; Online MBA
                </Link>
              </li>
              <li>
                <Link href="/programs/master-of-commerce-mcom" className="hover:text-white transition-colors block truncate">
                  Distance &amp; Online M.Com (Commerce)
                </Link>
              </li>
              <li>
                <Link href="/programs/master-of-arts-journalism-and-mass-communication-majmc" className="hover:text-white transition-colors block truncate">
                  Distance &amp; Online MJMC (Journalism)
                </Link>
              </li>
              <li>
                <Link href="/programs/master-of-science-msc" className="hover:text-white transition-colors block truncate">
                  Distance &amp; Online M.Sc (Science &amp; Maths)
                </Link>
              </li>
              <li>
                <Link href="/programs/master-of-arts-political-science-mps" className="hover:text-white transition-colors block truncate">
                  M.A. History / Pol. Sc.
                </Link>
              </li>
              <li>
                <Link href="/programs/master-of-arts-hindi-mhd" className="hover:text-white transition-colors block truncate">
                  M.A. Hindi / Sanskrit
                </Link>
              </li>
              <li>
                <Link href="/programs/master-of-computer-applications-mca" className="hover:text-white transition-colors block truncate">
                  Distance &amp; Online MCA (Computer Apps)
                </Link>
              </li>
              <li>
                <Link href="/programs/master-of-library-and-information-science-mlis" className="hover:text-white transition-colors block truncate">
                  Distance &amp; Online MLIS (Library Science)
                </Link>
              </li>
              <li>
                <Link href="/programs/master-of-business-administration-mba" className="hover:text-white transition-colors block truncate">
                  MBA in Finance &amp; Specializations
                </Link>
              </li>
            </ul>

            <div className="pt-1.5">
              <Link
                href="/pg-programs"
                className="text-[#009FE3] hover:text-sky-300 font-semibold inline-flex items-center gap-1.5 text-xs transition-colors"
              >
                <span>All PG Courses</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          </div>

          {/* COLUMN 4: STUDENT ZONE (2 cols on lg) */}
          <div className="lg:col-span-2 min-w-0 space-y-3">
            <div className="text-white font-bold text-xs sm:text-sm tracking-wider uppercase mb-3.5 whitespace-nowrap">
              STUDENT ZONE
            </div>

            <ul className="space-y-2 text-xs sm:text-[13px] text-slate-400 font-medium">
              <li>
                <a href="#admission-form" className="hover:text-white transition-colors block truncate">
                  Admission Details
                </a>
              </li>
              <li>
                <Link href="/programs" className="hover:text-white transition-colors block truncate">
                  Fee Structure
                </Link>
              </li>
              <li>
                <a href="#hall-ticket" className="hover:text-white transition-colors block truncate">
                  Admit Card / Hall Ticket
                </a>
              </li>
              <li>
                <a href="#egyankosh" className="hover:text-white transition-colors block truncate">
                  Study Materials
                </a>
              </li>
              <li>
                <a href="#grade-card" className="hover:text-white transition-colors block truncate">
                  Examination Results
                </a>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors block truncate">
                  Admissions Blog
                </Link>
              </li>
              <li>
                <a href="#disclaimer" className="hover:text-white transition-colors block truncate">
                  Disclaimer Policy
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors block truncate">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors block truncate">
                  Terms & Conditions
                </a>
              </li>
            </ul>

            <div className="pt-1.5">
              <a
                href="#student-login"
                className="text-[#009FE3] hover:text-sky-300 font-semibold inline-flex items-center gap-1.5 text-xs transition-colors"
              >
                <span>Student Portal</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </div>

          {/* COLUMN 5: CONTACT US (3 cols on lg) */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-3 min-w-0 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm tracking-wider uppercase mb-3.5 whitespace-nowrap">
              <Phone className="w-4 h-4 text-[#009FE3] shrink-0" />
              <span>CONTACT US</span>
            </div>

            {/* Phone Block */}
            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                PHONE NUMBER
              </div>
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 text-white hover:text-[#009FE3] font-extrabold text-sm sm:text-base tracking-wide transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-[#009FE3] shrink-0" />
                <span className="whitespace-nowrap">{phone}</span>
              </a>
            </div>

            {/* Email Block */}
            <div className="pt-1 min-w-0">
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                EMAIL ADDRESS
              </div>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 text-white hover:text-[#009FE3] font-extrabold text-xs sm:text-sm tracking-wide transition-colors max-w-full"
              >
                <Mail className="w-4 h-4 text-[#009FE3] shrink-0" />
                <span className="break-all">{email}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Horizontal Divider & Legal Bar */}
        <div className="mt-14 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} EduKyu • Independent University Information & Admission Guidance Portal.
          </div>
          <div className="flex items-center gap-5">
            <Link href="#privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#terms" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="#disclaimer" className="hover:text-slate-300 transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Menu,
  X,
  Scale,
  Sparkles,
  Phone,
  BookOpen,
  User,
  GraduationCap,
  Laptop,
  Briefcase,
  FileText,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Download,
  AlertCircle,
} from "lucide-react";
import CompareModal from "./CompareModal";
import EnquiryModal from "./EnquiryModal";
import { HomePageData, SiteSettings } from "@/lib/types";

interface NavbarProps {
  settings?: SiteSettings;
  homePageData?: HomePageData;
}

export default function Navbar({ settings, homePageData }: NavbarProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("MBA");
  const [enquirySource, setEnquirySource] = useState("Navbar");
  const [isScrolled, setIsScrolled] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track scroll position for shadow enhancement
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global event listener for modal triggers across the page
  useEffect(() => {
    const handleOpenCompare = () => setIsCompareOpen(true);
    const handleOpenEnquiry = (e: Event) => {
      const customEvent = e as CustomEvent<{ course?: string; source?: string }>;
      if (customEvent.detail?.course) {
        setSelectedCourse(customEvent.detail.course);
      }
      if (customEvent.detail?.source) {
        setEnquirySource(customEvent.detail.source);
      }
      setIsEnquiryOpen(true);
    };

    window.addEventListener("open-compare-modal", handleOpenCompare);
    window.addEventListener("open-enquiry-modal", handleOpenEnquiry);

    return () => {
      window.removeEventListener("open-compare-modal", handleOpenCompare);
      window.removeEventListener("open-enquiry-modal", handleOpenEnquiry);
    };
  }, []);

  // Auto-popup Enquiry Modal after 10 seconds (does not open if user already submitted details)
  useEffect(() => {
    try {
      const alreadySubmitted = localStorage.getItem("ignou_enquiry_submitted");
      if (alreadySubmitted === "true") {
        return;
      }
      const alreadyAutoOpened = sessionStorage.getItem("ignou_modal_auto_opened");
      if (alreadyAutoOpened === "true") {
        return;
      }
    } catch {
      // Ignore storage access errors
    }

    const timer = setTimeout(() => {
      try {
        const alreadySubmitted = localStorage.getItem("ignou_enquiry_submitted");
        if (alreadySubmitted === "true") {
          return;
        }
        sessionStorage.setItem("ignou_modal_auto_opened", "true");
        setEnquirySource("Auto Popup (10s)");
        setIsEnquiryOpen(true);
      } catch {
        setIsEnquiryOpen(true);
      }
    }, 10000); // exactly 10 seconds

    return () => clearTimeout(timer);
  }, []);

  // Close dropdown when pressing Escape key or clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Dropdown hover handlers with forgiving delay and no jitter
  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250);
  };

  const toggleMobileAccordion = (menu: string) => {
    setMobileAccordion(mobileAccordion === menu ? null : menu);
  };

  return (
    <>
      {/* MAIN HEADER NAVIGATION BAR - ALL IN ONE SINGLE LINE */}
      <header
        ref={navRef}
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-200 border-b ${
          isScrolled
            ? "border-slate-200/90 shadow-md shadow-slate-900/5 py-2.5"
            : "border-slate-100 shadow-xs py-3"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 lg:gap-6 flex-nowrap whitespace-nowrap">
            
            {/* BRAND LOGO AREA (LEFT: EDUKYU LOGO THEN IGNOU LOGO) */}
            <Link
              href="/"
              className="shrink-0 flex items-center gap-2 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-0.5 whitespace-nowrap"
            >
              {/* Edukyu Official Logo */}
              <div className="shrink-0 flex items-center">
                <Image
                  src="/edukyu-logo.png"
                  alt="EduKyu Logo"
                  width={110}
                  height={32}
                  className="h-7 sm:h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                  priority
                />
              </div>

              {/* Vertical Divider */}
              <div className="h-7 sm:h-8 w-[1.5px] bg-slate-200 mx-0.5 sm:mx-1.5 shrink-0" />

              {/* IGNOU Official Title */}
              <div className="flex flex-col shrink-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-[#009FE3] leading-none font-sans">
                    ignou
                  </span>
                </div>
                <span className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-700 leading-tight">
                  The People&apos;s
                </span>
                <span className="text-[8px] sm:text-[8.5px] font-extrabold uppercase tracking-widest text-[#0b2545] leading-none">
                  University
                </span>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION LINKS (MIDDLE - STRICTLY ONE LINE) */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-2 font-sans shrink-0 whitespace-nowrap">
              
              {/* 1. Distance Courses */}
              <div
                className="relative shrink-0"
                onMouseEnter={() => handleMouseEnter("distance")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === "distance" ? null : "distance")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-[14px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeDropdown === "distance"
                      ? "text-[#009FE3] bg-sky-50 shadow-2xs"
                      : "text-slate-800 hover:text-[#009FE3] hover:bg-slate-50"
                  }`}
                >
                  <span>Distance Courses</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                      activeDropdown === "distance" ? "rotate-180 text-[#009FE3]" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu - Distance Courses (2 Columns, Centered in Middle of Menu) */}
                {activeDropdown === "distance" && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                    <div className="w-[520px] bg-white rounded-2xl shadow-2xl shadow-slate-900/15 border border-slate-200/90 p-4 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
                      
                      {/* Column 1: Undergraduate (UG) */}
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider">
                            <GraduationCap className="w-4 h-4 text-sky-600" />
                            Undergraduate (UG)
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                            3 Years
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {[
                            { code: "BA", title: "Distance BA (Arts)", href: "/programs/bachelor-of-arts-bag" },
                            { code: "BBA", title: "Distance BBA", href: "/programs/bachelor-of-business-administration-bba" },
                            { code: "BCA", title: "Distance BCA", href: "/programs/bachelor-of-computer-applications-bca" },
                            { code: "B.Com", title: "Distance B.Com", href: "/programs/bachelor-of-commerce-bcom" },
                            { code: "B.Sc", title: "Distance B.Sc", href: "/programs/bachelor-of-science-bscg" },
                            { code: "B.Ed", title: "Distance B.Ed", href: "/programs/bachelor-of-education-bed" },
                            { code: "BLIS", title: "Distance BLIS", href: "/programs/bachelor-of-library-and-information-science-blis" },
                            { code: "BSW", title: "Social Work", href: "/ug-programs" },
                          ].map((item) => (
                            <li key={item.code}>
                              <Link
                                href={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className="group flex items-center justify-between p-2 rounded-xl hover:bg-sky-50/70 border border-transparent hover:border-sky-100 transition-all duration-150"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="shrink-0 px-2 py-0.5 text-[11px] font-extrabold rounded-md bg-sky-100/80 text-sky-800 group-hover:bg-sky-200 group-hover:text-sky-900 transition-colors">
                                    {item.code}
                                  </span>
                                  <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 truncate">
                                    {item.title}
                                  </span>
                                </div>
                                <ArrowRight className="w-3 h-3 text-slate-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-sky-600 transition-all shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 2: Postgraduate (PG) */}
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                            <Award className="w-4 h-4 text-indigo-600" />
                            Postgraduate (PG)
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            2 Years
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {[
                            { code: "MBA", title: "Distance MBA", href: "/programs/master-of-business-administration-mba" },
                            { code: "M.Sc", title: "Distance M.Sc", href: "/programs/master-of-science-msc" },
                            { code: "MA", title: "Distance MA", href: "/programs/master-of-arts-ma" },
                            { code: "MCA", title: "Distance MCA", href: "/programs/master-of-computer-applications-mca" },
                            { code: "M.Com", title: "Distance M.Com", href: "/programs/master-of-commerce-mcom" },
                            { code: "MJMC", title: "Distance MJMC", href: "/programs/master-of-arts-journalism-and-mass-communication-majmc" },
                            { code: "MLIS", title: "Distance MLIS", href: "/programs/master-of-library-and-information-science-mlis" },
                          ].map((item) => (
                            <li key={item.code}>
                              <Link
                                href={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className="group flex items-center justify-between p-2 rounded-xl hover:bg-indigo-50/70 border border-transparent hover:border-indigo-100 transition-all duration-150"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="shrink-0 px-2 py-0.5 text-[11px] font-extrabold rounded-md bg-indigo-100/80 text-indigo-800 group-hover:bg-indigo-200 group-hover:text-indigo-900 transition-colors">
                                    {item.code}
                                  </span>
                                  <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 truncate">
                                    {item.title}
                                  </span>
                                </div>
                                <ArrowRight className="w-3 h-3 text-slate-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-indigo-600 transition-all shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Bottom Quick Action Bar */}
                      <div className="col-span-2 pt-2.5 mt-1 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/70 -mx-4 -mb-4 px-4 py-2.5 rounded-b-2xl">
                        <span className="text-slate-500 font-medium">UGC-DEB Approved Distance Degrees</span>
                        <Link
                          href="/programs"
                          onClick={() => setActiveDropdown(null)}
                          className="font-bold text-[#009FE3] hover:underline inline-flex items-center gap-1"
                        >
                          <span>Explore All Programs</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* 2. Online Courses */}
              <div
                className="relative shrink-0"
                onMouseEnter={() => handleMouseEnter("online")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === "online" ? null : "online")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-[14px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeDropdown === "online"
                      ? "text-[#009FE3] bg-sky-50 shadow-2xs"
                      : "text-slate-800 hover:text-[#009FE3] hover:bg-slate-50"
                  }`}
                >
                  <span>Online Courses</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                      activeDropdown === "online" ? "rotate-180 text-[#009FE3]" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu - Online Courses */}
                {activeDropdown === "online" && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                    <div className="w-[520px] bg-white rounded-2xl shadow-2xl shadow-slate-900/15 border border-slate-200/90 p-5 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          UGC-Entitled E-Learning Programs
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          100% Digital
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        {[
                          { title: "Online BA", desc: "Arts & Humanities", tag: "UG", href: "/programs/bachelor-of-arts-bag" },
                          { title: "Online BBA", desc: "Business Administration", tag: "UG", href: "/programs/bachelor-of-business-administration-bba" },
                          { title: "Online BCA", desc: "Computer Applications", tag: "Tech", href: "/programs/bachelor-of-computer-applications-bca" },
                          { title: "Online B.Com", desc: "Digital Commerce", tag: "UG", href: "/programs/bachelor-of-commerce-bcom" },
                          { title: "Online B.Sc", desc: "Science & Lab Modules", tag: "UG", href: "/programs/bachelor-of-science-bscg" },
                          { title: "Online BLIS", desc: "Library & Info Science", tag: "1-Yr", href: "/programs/bachelor-of-library-and-information-science-blis" },
                          { title: "Online MCA", desc: "Software & Cloud", tag: "Hot", href: "/programs/master-of-computer-applications-mca" },
                          { title: "Online MBA", desc: "Master of Business", tag: "Top Rated", href: "/programs/master-of-business-administration-mba" },
                          { title: "Online MA", desc: "Arts & Humanities (All)", tag: "PG", href: "/programs/master-of-arts-ma" },
                          { title: "Online M.Com", desc: "Commerce & Finance", tag: "PG", href: "/programs/master-of-commerce-mcom" },
                          { title: "Online MJMC", desc: "Media & Journalism", tag: "PG", href: "/programs/master-of-arts-journalism-and-mass-communication-majmc" },
                          { title: "Online M.Sc", desc: "Science & Research", tag: "PG", href: "/programs/master-of-science-msc" },
                          { title: "Online MLIS", desc: "Master of Library Sci", tag: "PG", href: "/programs/master-of-library-and-information-science-mlis" },
                          { title: "Explore All Online", desc: "View Full Online Catalog", tag: "100%", href: "/programs" },
                        ].map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group p-2.5 rounded-xl border border-slate-100 hover:border-sky-300 hover:bg-sky-50/60 transition-all flex flex-col"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-slate-900 group-hover:text-[#009FE3] transition-colors">
                                {item.title}
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                                {item.tag}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 mt-0.5">{item.desc}</span>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 bg-sky-50/50 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl">
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Laptop className="w-4 h-4 text-sky-600" /> Complete with LMS, e-tutorials &amp; online exams
                        </span>
                        <Link
                          href="/programs"
                          onClick={() => setActiveDropdown(null)}
                          className="font-bold text-sky-700 hover:underline"
                        >
                          Explore Programs →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. MBA Specializations */}
              <div
                className="relative shrink-0"
                onMouseEnter={() => handleMouseEnter("mba")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === "mba" ? null : "mba")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-[14px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeDropdown === "mba"
                      ? "text-[#009FE3] bg-sky-50 shadow-2xs"
                      : "text-slate-800 hover:text-[#009FE3] hover:bg-slate-50"
                  }`}
                >
                  <span>MBA Specializations</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                      activeDropdown === "mba" ? "rotate-180 text-[#009FE3]" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu - MBA Specializations */}
                {activeDropdown === "mba" && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                    <div className="w-[580px] bg-white rounded-2xl shadow-2xl shadow-slate-900/15 border border-slate-200/90 p-5 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider">
                          <Briefcase className="w-4 h-4 text-sky-600" />
                          SOMS • 2-Year Master of Business Administration
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          AICTE Approved
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          {
                            title: "IGNOU MBA in Finance Management",
                            short: "Finance & Accounting",
                            badge: "Finance",
                            href: "/mba-specializations/ignou-mba-in-finance-management",
                          },
                          {
                            title: "IGNOU MBA in HR Management",
                            short: "Human Resources & Talent",
                            badge: "HR",
                            href: "/mba-specializations/ignou-mba-in-hr-management",
                          },
                          {
                            title: "IGNOU MBA in Operations Management",
                            short: "Operations & Supply Chain",
                            badge: "Operations",
                            href: "/mba-specializations/ignou-mba-in-operations-management",
                          },
                          {
                            title: "IGNOU MBA in IT",
                            short: "Information Technology",
                            badge: "IT",
                            href: "/mba-specializations/ignou-mba-in-it",
                          },
                          {
                            title: "IGNOU MBA in Business Analytics",
                            short: "Data Analytics & Insights",
                            badge: "Analytics",
                            href: "/mba-specializations/ignou-mba-in-business-analytics",
                          },
                          {
                            title: "IGNOU MBA in Business Management",
                            short: "General Management",
                            badge: "Management",
                            href: "/mba-specializations/ignou-mba-in-business-management",
                          },
                          {
                            title: "IGNOU MBA in Marketing Management",
                            short: "Marketing & Strategy",
                            badge: "Marketing",
                            href: "/mba-specializations/ignou-mba-in-marketing-management",
                            colSpan: "col-span-2",
                          },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className={`group p-2.5 rounded-xl border border-slate-100 hover:border-sky-300 hover:bg-sky-50/60 transition-all flex flex-col ${
                              item.colSpan || ""
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 group-hover:text-[#009FE3] transition-colors truncate">
                                {item.title}
                              </span>
                              <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 shrink-0 ml-1">
                                {item.badge}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 mt-0.5 truncate">{item.short}</span>
                          </Link>
                        ))}
                      </div>

                      {/* Dropdown Footer */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 bg-sky-50/50 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl">
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Award className="w-4 h-4 text-sky-600" /> ₹66,000 Total Fee • Direct Admission
                        </span>
                        <Link
                          href="/mba-specializations"
                          onClick={() => setActiveDropdown(null)}
                          className="font-bold text-[#009FE3] hover:underline inline-flex items-center gap-1"
                        >
                          <span>Explore All Specializations</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Blogs */}
              <Link
                href="/blogs"
                className="px-3 py-2 text-[14px] font-semibold text-slate-800 hover:text-[#009FE3] hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Blogs
              </Link>
            </nav>

            {/* RIGHT ACTION BUTTON (COMPARE UNIVERSITIES & MOBILE TRIGGER - ONE LINE) */}
            <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
              {/* "Compare Universities" Primary Button */}
              <a
                href="https://edukyu.com/compare-colleges"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-[#009FE3] hover:bg-[#008ec9] rounded-lg shadow-xs hover:shadow transition-all whitespace-nowrap shrink-0 active:scale-[0.98] cursor-pointer"
              >
                Compare Universities
              </a>

              {/* Mobile Menu Hamburger Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-sky-600 hover:bg-slate-100 border border-slate-200 transition-colors shrink-0"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE RESPONSIVE DRAWER / PANEL */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[100%] h-[calc(100vh-65px)] bg-slate-900/40 backdrop-blur-xs z-50 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white border-b border-slate-200 shadow-xl p-4 sm:p-6 space-y-4 max-h-full overflow-y-auto">
              
              {/* Accordion Menu List */}
              <div className="space-y-1 divide-y divide-slate-100 font-sans">
                {/* Accordion 1: Distance Courses */}
                <div className="pt-2">
                  <button
                    onClick={() => toggleMobileAccordion("distance")}
                    className="w-full flex items-center justify-between py-2 text-left font-bold text-slate-900 text-base"
                  >
                    <span>Distance Courses</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        mobileAccordion === "distance" ? "rotate-180 text-sky-600" : ""
                      }`}
                    />
                  </button>
                  {mobileAccordion === "distance" && (
                    <div className="pl-3 pr-2 py-2 space-y-2 text-sm text-slate-600 animate-in slide-in-from-top-1">
                      <div className="font-semibold text-xs text-sky-700 uppercase">Undergraduate (UG)</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <Link href="/programs/bachelor-of-arts-bag" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-slate-800">Distance BA</Link>
                        <Link href="/programs/bachelor-of-business-administration-bba" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-slate-800">Distance BBA</Link>
                        <Link href="/programs/bachelor-of-computer-applications-bca" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-slate-800">Distance BCA</Link>
                        <Link href="/programs/bachelor-of-commerce-bcom" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-slate-800">Distance B.Com</Link>
                        <Link href="/programs/bachelor-of-science-bscg" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-slate-800">Distance B.Sc</Link>
                        <Link href="/programs/bachelor-of-education-bed" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-slate-800">Distance B.Ed</Link>
                        <Link href="/programs/bachelor-of-library-and-information-science-blis" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-slate-800">Distance BLIS</Link>
                        <Link href="/ug-programs" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-[#009FE3]">All UG Programs →</Link>
                      </div>
                      <div className="font-semibold text-xs text-indigo-700 uppercase pt-2">Postgraduate (PG)</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <Link href="/programs/master-of-business-administration-mba" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-slate-800">Distance MBA</Link>
                        <Link href="/programs/master-of-science-msc" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-slate-800">Distance M.Sc</Link>
                        <Link href="/programs/master-of-arts-ma" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-slate-800">Distance MA</Link>
                        <Link href="/programs/master-of-computer-applications-mca" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-slate-800">Distance MCA</Link>
                        <Link href="/programs/master-of-commerce-mcom" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-slate-800">Distance M.Com</Link>
                        <Link href="/programs/master-of-arts-journalism-and-mass-communication-majmc" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-slate-800">Distance MJMC</Link>
                        <Link href="/programs/master-of-library-and-information-science-mlis" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-slate-800">Distance MLIS</Link>
                        <Link href="/pg-programs" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-slate-50 font-medium text-indigo-600">All PG Programs →</Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Online Courses */}
                <div className="pt-2">
                  <button
                    onClick={() => toggleMobileAccordion("online")}
                    className="w-full flex items-center justify-between py-2 text-left font-bold text-slate-900 text-base"
                  >
                    <span>Online Courses</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        mobileAccordion === "online" ? "rotate-180 text-sky-600" : ""
                      }`}
                    />
                  </button>
                  {mobileAccordion === "online" && (
                    <div className="pl-3 pr-2 py-2 space-y-1.5 text-xs text-slate-600">
                      <Link href="/programs/bachelor-of-arts-bag" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • Online BA (Arts &amp; Humanities)
                      </Link>
                      <Link href="/programs/bachelor-of-business-administration-bba" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • Online BBA (Digital Business Admin)
                      </Link>
                      <Link href="/programs/bachelor-of-computer-applications-bca" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • Online BCA (Digital E-Learning)
                      </Link>
                      <Link href="/programs/master-of-computer-applications-mca" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • Online MCA (Software &amp; Cloud)
                      </Link>
                      <Link href="/programs/master-of-business-administration-mba" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • Online MBA (General Management)
                      </Link>
                      <Link href="/programs/bachelor-of-commerce-bcom" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • Online B.Com (E-Tutorials)
                      </Link>
                      <Link href="/programs/bachelor-of-science-bscg" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • Online B.Sc (Science &amp; Labs)
                      </Link>
                      <Link href="/programs/bachelor-of-library-and-information-science-blis" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • Online BLIS (Library &amp; Information Science)
                      </Link>
                      <Link href="/programs/master-of-arts-ma" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • Online MA (Arts &amp; Humanities)
                      </Link>
                      <Link href="/programs/master-of-commerce-mcom" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • Online M.Com (Commerce &amp; Finance)
                      </Link>
                      <Link href="/programs/master-of-arts-journalism-and-mass-communication-majmc" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • Online MJMC (Journalism &amp; Mass Comm)
                      </Link>
                      <Link href="/programs/master-of-science-msc" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • Online M.Sc (Science &amp; Research)
                      </Link>
                      <Link href="/programs/master-of-library-and-information-science-mlis" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • Online MLIS (Library &amp; Information Science)
                      </Link>
                    </div>
                  )}
                </div>

                {/* Accordion 3: MBA Specializations */}
                <div className="pt-2">
                  <button
                    onClick={() => toggleMobileAccordion("mba")}
                    className="w-full flex items-center justify-between py-2 text-left font-bold text-slate-900 text-base"
                  >
                    <span>MBA Specializations</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        mobileAccordion === "mba" ? "rotate-180 text-sky-600" : ""
                      }`}
                    />
                  </button>
                  {mobileAccordion === "mba" && (
                    <div className="pl-3 pr-2 py-2 space-y-1.5 text-xs text-slate-600">
                      <Link href="/mba-specializations/ignou-mba-in-finance-management" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • IGNOU MBA in Finance Management
                      </Link>
                      <Link href="/mba-specializations/ignou-mba-in-hr-management" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • IGNOU MBA in HR Management
                      </Link>
                      <Link href="/mba-specializations/ignou-mba-in-operations-management" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • IGNOU MBA in Operations Management
                      </Link>
                      <Link href="/mba-specializations/ignou-mba-in-it" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • IGNOU MBA in IT
                      </Link>
                      <Link href="/mba-specializations/ignou-mba-in-business-analytics" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • IGNOU MBA in Business Analytics
                      </Link>
                      <Link href="/mba-specializations/ignou-mba-in-business-management" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • IGNOU MBA in Business Management
                      </Link>
                      <Link href="/mba-specializations/ignou-mba-in-marketing-management" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-medium">
                        • IGNOU MBA in Marketing Management
                      </Link>
                      <Link href="/mba-specializations" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-sky-600 font-bold text-[#009FE3]">
                        • View All MBA Specializations →
                      </Link>
                    </div>
                  )}
                </div>

                {/* Blogs Link */}
                <div className="pt-2">
                  <Link
                    href="/blogs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base font-bold text-slate-900 hover:text-sky-600"
                  >
                    Blogs &amp; Admission Guides
                  </Link>
                </div>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <a
                  href="https://edukyu.com/compare-colleges"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#009FE3] shadow-md cursor-pointer"
                >
                  <Scale className="w-4 h-4" />
                  Compare Top Universities
                </a>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <a
                    href="#student-login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-3.5 h-3.5 text-sky-600" /> Student Login
                  </a>
                  <a
                    href="tel:1800112345"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" /> 1800-11-2345
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MODALS */}
      <CompareModal isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        defaultCourse={selectedCourse}
        source={enquirySource}
      />
    </>
  );
}

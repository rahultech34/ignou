import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { BackButton } from "@/components/public/BackButton";

export const metadata: Metadata = {
  title: "Terms & Conditions | IGNOU Admission & Course Guidance (ignouadmission.edukyu.com)",
  description:
    "Read the Terms & Conditions, independent educational portal disclaimer, privacy guidelines, license, and liability policies for ignouadmission.edukyu.com.",
  openGraph: {
    title: "Terms & Conditions | ignouadmission.edukyu.com",
    description:
      "Read the Terms & Conditions, educational information portal disclaimer, privacy, license, and service guidelines for ignouadmission.edukyu.com.",
    images: [{ url: "/IGNOU-img.webp" }],
    type: "website",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-slate-950 text-white py-12 sm:py-16">
          <Image
            src="/IGNOU-img.webp"
            alt="IGNOU Admission Information Portal Terms & Conditions"
            fill
            sizes="100vw"
            quality={75}
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/75" />

          <div className="relative z-10 site-container text-center space-y-4">
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white leading-tight">
              Terms &amp; Conditions
            </h1>
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              We thank you and appreciate your service or product purchase with us on our website{" "}
              <strong className="text-white">ignouadmission.edukyu.com</strong>.
            </p>
          </div>
        </section>

        {/* Content Cards */}
        <section className="py-10 sm:py-14 flex-1">
          <div className="site-container">
            <div className="max-w-5xl mx-auto space-y-6">
              <BackButton />

            {/* Overview & Revisions */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              <p>
                Please read this policy and the <strong>ignouadmission.edukyu.com</strong> terms and
                conditions carefully as they will give you important information and guidelines about
                your rights and obligations as our customer, with respect to any purchase or service
                we provide to you. <strong>ignouadmission.edukyu.com</strong> reserves the right to change or
                revise terms and conditions on this website. <strong>ignouadmission.edukyu.com</strong> will
                alert you that changes or revisions have been made by indicating on the top of the
                website with the date it was last revised. The changes will be effective immediately
                after it is posted on this website. Your use of the website following the posting
                any such changes will constitute your acceptance of any such changes or revisions.
                This terms and conditions don’t alter in any way the written conditions you may have
                with <strong>ignouadmission.edukyu.com</strong> for other products and services. If you do
                not agree to these terms and conditions including the referenced policies and
                guidelines, please immediately terminate your use of the website.
              </p>

              <p>
                This website is an independent educational information portal created to provide
                general guidance regarding distance, online, and regular education programs offered
                by various universities and institutions. We are not the official website of any
                university, college, or government body, and we are not affiliated with, endorsed
                by, or representing any such institution unless explicitly stated. The information
                provided on this website is for informational purposes only and should not be
                considered as official admission advice. We do not process admissions, collect fees,
                guarantee seats, or issue enrollment confirmations. By submitting your details on
                this website, you agree that the information provided by you may be used to contact
                you via call, SMS, WhatsApp, or email for the purpose of providing course-related
                guidance and counseling. Users are advised to verify all details directly from the
                official website of the respective university or institution before making any
                decision. By using this website, you acknowledge and agree that this platform shall
                not be held responsible for any decision taken by the user based on the information
                provided here.
              </p>

              <p>
                We make every effort to provide the service to you as per the specifications and
                timelines mentioned against each service or product purchased by you from{" "}
                <strong>ignouadmission.edukyu.com</strong>. However if, due to any reason, we are unable to
                provide to you the service or product you purchased from us, then you shall be
                entitled to a refund which shall be subject to the following situations.
              </p>
            </div>

            {/* I. Website */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                I. Website
              </h2>
              <ul className="space-y-2.5 text-sm sm:text-base text-slate-700">
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    <strong>ignouadmission.edukyu.com</strong> is not responsible for any damage resulting
                    from use of this website.
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    You will abide by all applicable local, state, national and international laws
                    and regulations in your use of the website.
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    You will not interfere with or disrupt the use and enjoyment of the website by
                    other users.
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>You will not resell material on the website or of the website.</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    You will not engage, directly or indirectly in transmission of &ldquo;spam&rdquo;,
                    chain letters, junk mail or any other type of unsolicited communication.
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    You will not defame, harass, abuse or disrupt other users of the website.
                  </span>
                </li>
              </ul>
            </div>

            {/* II. Privacy Policy */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                II. Privacy Policy
              </h2>
              <p>
                To make our services more relevant and helpful, we acquire your information related
                to your communication and about your usage of our services on the website.
              </p>
              <p>
                <strong>ignouadmission.edukyu.com</strong> believes strongly in protecting user privacy,
                unless required by law, not make the other&rsquo;s confidential information
                accessible to any other third party or use the confidential information for any
                personal purpose or greed.
              </p>
              <p>
                <strong>ignouadmission.edukyu.com</strong> adheres to the privacy policy relating to the
                privacy and security of your data available in the website as such document may be
                amended on timely basis by us.
              </p>
            </div>

            {/* III. License */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                III. License
              </h2>
              <p>
                By using this website you are granted a limited, non-exclusive, non-transferable
                right to use the content and materials on the website in connection with your normal
                use of the website.
              </p>
              <p>
                You may not copy, reproduce, transmit, distribute or create derivative works of such
                content or information without express written authorization from{" "}
                <strong>ignouadmission.edukyu.com</strong>.
              </p>
            </div>

            {/* IV. Limitations of Liabilities */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                IV. Limitations of Liabilities
              </h2>
              <ul className="space-y-2.5 text-sm sm:text-base text-slate-700">
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    <strong>ignouadmission.edukyu.com</strong> will not be liable for any direct, indirect,
                    incidental, special or consequential damages for the services in any manner.
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>No liability towards the inability to use the website content.</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    No liability towards cost of procuring substitute services or content.
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    No liability towards services purchased or obtained or transactions entered into
                    through the website.
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>No liability towards any lost profits you allege.</span>
                </li>
              </ul>
            </div>

            {/* V. Agreement to be Bound */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                V. Agreement to be Bound
              </h2>
              <p>
                By using this Website or taking services, you acknowledge that you have read and
                agree to be bound by all terms and conditions on this website.
              </p>
            </div>

            {/* VI. General */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                VI. General
              </h2>
              <p>
                <strong>ignouadmission.edukyu.com</strong> will not be deemed in
                default hereunder or held responsible for any cessation, interruption or delay in
                the performance of its obligations hereunder due to earthquake, flood, fire, storm,
                natural disaster, act of God, war, terrorism, armed conflict, labor strike or
                lockout.
              </p>
              <p>
                This agreement comprises the entire terms and conditions between you and{" "}
                <strong>ignouadmission.edukyu.com</strong> and supersedes any prior
                agreements pertaining to the subject matter contained herein.
              </p>
              <p>
                By entering into this agreement, you hereby irrevocably waive any right you may have
                to join claims with those of others in the form of a class action or similar
                procedural services. Any claims arising out of, relating to or in connection with
                this terms and conditions must be asserted individually.
              </p>
              <p>
                <strong>ignouadmission.edukyu.com</strong> reserves the right to
                terminate your access to the website if it reasonably believes, in its sole
                discretion, that you have breached any of the terms and conditions. Following
                termination, you will not be permitted to use the website and{" "}
                <strong>ignouadmission.edukyu.com</strong> may, in its sole
                discretion and without advance notice to you, cancel any outstanding order of
                services. If your access to the website is terminated,{" "}
                <strong>ignouadmission.edukyu.com</strong> reserves the right to
                exercise whatever means it deems necessary to prevent unauthorized access of the
                website. This agreement will survive indefinitely unless and until{" "}
                <strong>ignouadmission.edukyu.com</strong> chooses, in its sole
                discretion and without advance notice to you, to terminate it.
              </p>
              <p>
                <strong>ignouadmission.edukyu.com</strong> makes no representation
                that the website is appropriate or available for use in locations outside India.
                Users who access the website from outside India do so at their own risk and
                initiative and must bear all responsibility for compliance with any applicable local
                laws. <strong>ignouadmission.edukyu.com</strong> may assign its
                rights and obligations under this agreement in its sole discretion and without
                advance notice to you.
              </p>
              <p>
                By using this website or taking the services from this website you agree to be
                bound by all of the terms and conditions of this agreement.
              </p>
            </div>

            <BackButton />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

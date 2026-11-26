import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | IGNOU Admission & Course Guidance (ignou.edukyu.com)",
  description:
    "Read the Privacy Policy, Cookie Policy, Copyrights Policy, and Intellectual Property guidelines for ignou.edukyu.com.",
  openGraph: {
    title: "Privacy Policy | ignou.edukyu.com",
    description:
      "Read the Privacy Policy, Cookie Policy, Copyrights Policy, and data protection practices for ignou.edukyu.com.",
    images: [{ url: "/IGNOU-img.webp" }],
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-slate-950 text-white py-12 sm:py-16">
          <Image
            src="/IGNOU-img.webp"
            alt="IGNOU Admission Information Portal Privacy Policy"
            fill
            sizes="100vw"
            quality={75}
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/75" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white leading-tight">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Privacy Policy, Cookie Policy, Copyrights &amp; Intellectual Property guidelines for{" "}
              <strong className="text-white">ignou.edukyu.com</strong>.
            </p>
          </div>
        </section>

        {/* Content Cards */}
        <section className="py-10 sm:py-14 flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Your Consent */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Your Consent
              </h2>
              <p>
                By using our website, including our mobile applications you legally accept all our
                Terms and Conditions, under all headers, listed here. If you are using{" "}
                <strong>ignou.edukyu.com</strong> on behalf of a company or a group, you are
                nevertheless individually bound by this Agreement even if your company or group has
                a separate agreement with us.
              </p>
              <p>
                We recognize the importance of maintaining Your privacy and the Confidentiality of
                the information you share with us. We do not sell or rent the information you share
                with us. Personal Information means and includes all information that can be
                linked to a specific individual or to identify any individual, such as name,
                address, mailing address, telephone number, e-mail address, credit card number,
                cardholder name, expiration date, information about travel or hotel bookings, your
                proprietary Training Material, details of Training Programs and Your Clients.
              </p>
            </div>

            {/* Data We Collect */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                We may collect and process the following data about You
              </h2>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    Information that you provide by filling in forms on our Site, including
                    information provided at the time of registration, subscription, posting material
                    or requesting further services. We may also ask You for information, for example,
                    as part of training plan or preferred trainer/organisation list, the email ids of
                    non-members who may qualify as Training Seekers/ Providers/ Service
                    Facilitators.
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>A record of the correspondence in the event you contact us.</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    Information, if provided by you, to complete surveys that we use for research
                    purposes.
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>References of potential members that you may provide.</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    Details of transactions you carry out through our Site and of the fulfillment of
                    your orders.
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    Details of your visits to our Site including, but not limited to, traffic data,
                    location data, weblogs, and other communication data, whether this is required
                    for our own billing purposes or otherwise, and the resources that you access.
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    Any other information you provide to us in connection with your use of the
                    website.
                  </span>
                </li>
              </ul>

              <p>Payments are routed through CC Avenue.</p>
              <p>
                We automatically log generic session information, which is anonymous and not linked
                to any Personal Information. Session data consists of things such as IP address,
                operating system and type of browser software being used and the activities
                conducted by the user while on the Website.
              </p>
            </div>

            {/* Uses made of the information */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Uses made of the information
              </h2>
              <p>We use information retained as above in the following ways:</p>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    To send promotional invites or brand awareness emails pursuant to information
                    from you
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    To send out registration invitations, in the name of the member who has referred
                    a potential member
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    To ensure that content from our Site is presented in the most effective manner
                    for you and for your computer
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    To provide you with information, products or services that You request from us
                    or which we feel may interest you, where You have consented to be contacted for
                    such purposes
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    To carry out our obligations arising from any contracts entered into between You
                    and us
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    To allow you to participate in interactive features of our service, when you
                    choose to do so
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>To notify you about changes to our service.</span>
                </li>
              </ul>

              <p>
                We may also use your data, or permit selected third parties to use your data, to
                provide you with information about goods and services which may be of interest to
                you and we or they may contact you about these by e-mail, post or telephone. Where
                we permit selected third parties to use your data, we (or they) will contact you by
                electronic means only if you have consented to this.
              </p>
            </div>

            {/* Disclosure of Your information */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Disclosure of Your information
              </h2>
              <p>We may disclose your personal information to third parties:</p>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>For provision of services to you on or through the website.</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    In the event that we sell or buy any business or assets, in which case we may
                    disclose Your personal data to the prospective seller or buyer of such business
                    or assets.
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    If we are under a duty to disclose or share your personal data in order to comply
                    with any legal obligation, or in order to enforce or apply our Terms or relevant
                    terms and conditions of supply of goods, services and/or information and other
                    agreements; or to protect the rights, property, or safety of our employees,
                    customers, or others. This includes exchanging information with other companies
                    and organizations for the purposes of fraud protection and credit risk
                    reduction.
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>To our associate companies which offer services along the similar lines.</span>
                </li>
              </ul>
            </div>

            {/* Cookie Policy */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Cookie Policy
              </h2>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">
                Your Consent
              </h3>
              <p>
                By using our website, including our mobile applications you legally accept all our
                Terms and Conditions, under all headers, listed here. If you are using{" "}
                <strong>ignou.edukyu.com</strong> on behalf of a company or a group, you are
                nevertheless individually bound by this Agreement even if your company or group has
                a separate agreement with us. By using the <strong>ignou.edukyu.com</strong>{" "}
                Site, you are consenting to our use of cookies in accordance with this Cookie
                Policy. If you do not agree to our use of cookies in this way, you should set your
                browser settings accordingly or not use <strong>ignou.edukyu.com</strong>. If you
                disable the cookies that we use, this may impact your user experience.
              </p>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">
                What are Cookies?
              </h3>
              <p>
                Cookies are files or pieces of information that may be stored on your computer (or
                other internet enabled devices, such as a smart phone or tablet) when you visit our
                site. Cookies are stored in your browser&rsquo;s file directory. Next time you visit
                the site, your browser will read the cookie and relay the information back to the
                website or element that originally set the cookie. A cookie will usually contain the
                name of the website from which the cookie has come from, the &ldquo;lifetime&rdquo;
                of the cookie (i.e. how long it will remain on your device), and a value, which is
                usually a randomly generated unique number.
              </p>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">
                How we use Cookies
              </h3>
              <p>
                We may collect information about Your computer, including, where available, Your IP
                address, operating system and browser type, for system administration and to report
                aggregate information to our business partners. This is statistical data about our
                users&rsquo; browsing actions and patterns, and does not identify any specific
                individual or personal information.
              </p>
              <p>
                For the same reason, we may obtain information about Your general internet usage by
                using a cookie file which is stored on the hard drive of Your computer. Cookies
                contain information that is transferred to Your computer&rsquo;s hard drive. They
                help us to improve our Site and to deliver a better and more personalized service.
                They enable us:
              </p>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>To estimate our audience size and usage pattern</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    To store information about Your preferences, and so allow us to customize our
                    Site according to Your individual interests
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>To speed up your searches</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>To recognize when you return to our Site</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    Details of your visits to our Site including, but not limited to, traffic data,
                    location data, weblogs and other communication data, whether this is required
                    for our own billing purposes or otherwise and the resources that you access
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                  <span>
                    Any other information you provide to us in connection with Your use of the
                    website
                  </span>
                </li>
              </ul>

              <p>Payments are routed through Times of Money.</p>
              <p>
                We do not save your personal or professional information using cookies. We only use
                cookies to personalize your experience.
              </p>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">
                Third Party Cookies
              </h3>
              <p>
                Third party cookies might collect aggregated information like the frequency of your
                visit or the length. No Personal or Professional information is collected. The
                information collected might be used for analytics.
              </p>
              <p>
                A cookie may also be placed by our advertising partners. Such cookies are used only
                for purposes of tracking the effectiveness of advertising on our Website and no
                personal or professional information is gathered from you by the use of these
                cookies, nor is this information shared with any third parties. Third-party
                advertising companies or advertisement providers may also employ cookies. Such
                information will be anonymous and will be to measure the effectiveness of ads. Most
                Web browsers automatically accept cookies. In case you do not want to accept our
                cookie policy, you can change the settings of your browser; blocking cookies may
                affect your user experience.
              </p>
            </div>

            {/* Copyrights Policy */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Copyrights Policy
              </h2>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">
                Your Consent
              </h3>
              <p>
                By using our website, including our mobile applications you legally accept all our
                Terms and Conditions, under all headers, listed here. If you are using{" "}
                <strong>ignou.edukyu.com</strong> on behalf of a company or a group, you are
                nevertheless individually bound by this Agreement even if your company or group has
                a separate agreement with us.
              </p>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">
                Permitted Uses
              </h3>
              <p>
                All materials appearing on this Site, including site design, text, graphics, icons
                interfaces, and the selection, assembly and arrangements are owned or licensed by{" "}
                <strong>ignou.edukyu.com</strong>. You may copy material in limited quantities from
                this website for Your personal non-commercial use provided that our copyright notice
                is affixed to the copied material. Any other use of materials on this Site,
                including but not limited to, reproduction for purposes other than those noted on
                our Site, modification, transmission, display, distribution or republication,
                without the prior written permission of <strong>ignou.edukyu.com</strong> is
                strictly prohibited. Users are not permitted to use &ldquo;web crawlers&rdquo; or
                other types of software or hardware technology to automatically download large
                amounts of materials from the Site. Elements of the website are also protected by
                trademark, copyright, trade dress and other laws and may not be imitated in whole or
                in part on other websites.
              </p>
              <p>
                <strong>ignou.edukyu.com</strong> believes that some of the information on this
                Site as well as underlying business model has high commercial value and any use of
                the same or replication of same without consulting us shall be treated as loss of
                business for us and accordingly recovered from You in case of use of the same for
                pursuing Your own business interests. End User shall not use or reproduce content
                obtained from the service for or in connection with any other listing service or
                device.
              </p>
            </div>

            {/* Intellectual Property Rights */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Intellectual Property Rights
              </h2>
              <p>
                Unless otherwise indicated or anything contained to the contrary or any proprietary
                material owned by a third party and so expressly mentioned,{" "}
                <strong>ignou.edukyu.com</strong> owns all intellectual property rights to and in
                the website, including, without limitation, any and all rights, title and interest
                in and to copyright, related rights, patents, utility models, trademarks, trade
                names, service marks, designs, know-how, trade secrets and inventions (whether
                patentable or not), goodwill, source code, meta tags, databases, text, content,
                graphics, icons, and hyperlinks. You acknowledge and agree that you shall not use,
                reproduce or distribute any content from the website belonging to{" "}
                <strong>ignou.edukyu.com</strong> without obtaining authorization from{" "}
                <strong>ignou.edukyu.com</strong>.
              </p>
              <p>
                Notwithstanding the foregoing, it is expressly clarified that you will retain
                ownership and shall solely be responsible for any content that you provide or upload
                when using any service, including any text, data, information, images, photographs,
                music, sound, video or any other material which you may upload, transmit or store
                when making use of our various services. However, when uploading and posting content
                on to the website for public viewing and reproduction/use of your content by third
                party users, you hereby accept to grant a worldwide, royalty free and non-exclusive
                license for the use of the same.
              </p>
              <p>
                You shall not use, upload or display any objectionable content or images or content
                or images that are in violation of the intellectual property, privacy or celebrity
                rights of any person or entity. Notwithstanding anything to the contrary as provided
                herein, Training Providers, Training Seekers and Training Service Facilitators
                represent and warrant that they are the owners or have the license to use the data
                as provided by them in the learning and development solutions and such use, upload
                or display of data on the websites are not in violation of the intellectual
                property, privacy or celebrity rights of any person or entity.
              </p>
            </div>

            {/* Governing Law, Consent & Contact Us */}
            <div className="bg-gradient-to-br from-[#0b2545] to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-4 text-sm sm:text-base text-slate-200 leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Governing Law
              </h2>
              <p>
                These Terms and any disputes arising out of such Terms are governed by the laws of
                India and are subject to the jurisdiction of the courts in New Delhi, Delhi only.
              </p>

              <h3 className="text-base sm:text-lg font-bold text-white pt-1">
                Your Consent
              </h3>
              <p>
                By using our website, including our mobile applications you legally accept all our
                Terms and Conditions, under all headers, listed here. If you are using{" "}
                <strong className="text-white">ignou.edukyu.com</strong> on behalf of a company or a
                group, you are nevertheless individually bound by this Agreement even if your
                company or group has a separate agreement with us.
              </p>

              <h3 className="text-base sm:text-lg font-bold text-white pt-1">
                Contact Us
              </h3>
              <p>
                If there are any questions regarding this Terms &amp; Conditions of use of this
                Website and its services,{" "}
                <Link
                  href="/#admission-form"
                  className="text-sky-300 font-bold underline hover:text-sky-200"
                >
                  click here
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

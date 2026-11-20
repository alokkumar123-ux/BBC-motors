import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Car, CheckCircle2, Clock, Headset, Monitor, ShieldCheck } from "lucide-react";
import heroCar from "@/assets/hero-training-car.jpg";
import schoolBuilding from "@/assets/school-building.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useCourses } from "@/lib/school-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BBC Motors Driving School — Drive Safe, Smart, Confident" },
      {
        name: "description",
        content:
          "Authorized driving school under the Government of Assam in Karimganj. LMV, MCWG and Transport courses with online certificate verification.",
      },
      { property: "og:title", content: "BBC Motors Driving School — Karimganj, Assam" },
      {
        property: "og:description",
        content: "Learn to drive with an authorized school. Earn a digital certificate anyone can verify online.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

const FEATURES = [
  {
    icon: Car,
    title: "Our Courses",
    sub: "LMV, MCWG, MCWOG, HMV",
    to: "/courses",
  },
  {
    icon: ShieldCheck,
    title: "Digital Certificate",
    sub: "Unique & Verifiable",
    to: "/verify",
  },
  {
    icon: Monitor,
    title: "Online Verification",
    sub: "Check Certificate",
    to: "/verify",
  },
  {
    icon: Headset,
    title: "Student Dashboard",
    sub: "Track Your Progress",
    to: "/login",
  },
] as const;



function Index() {
  const { courses } = useCourses();
  return (
    <SiteLayout>
      {/* 1. Hero Section (Warm Off-White / Cream with Organic Green & Gold Swooshes) */}
      <section className="relative bg-[#F5F4EF] text-slate-800 overflow-hidden border-b border-[#E2DFD5]">
        {/* Decorative Top-Left Green & Gold Curves */}
        <svg
          className="absolute -left-16 -top-20 w-[420px] h-[420px] pointer-events-none select-none"
          viewBox="0 0 420 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-80 320 C60 300, 140 180, 160 -40 L-80 -40 Z"
            fill="#C59E53"
            opacity="0.85"
          />
          <path
            d="M-80 280 C40 260, 110 150, 120 -40 L-80 -40 Z"
            fill="#164535"
          />
        </svg>

        {/* Decorative Bottom-Right Green & Gold Curves */}
        <svg
          className="absolute -right-20 -bottom-24 w-[480px] h-[480px] pointer-events-none select-none"
          viewBox="0 0 480 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M180 500 C240 360, 360 280, 520 260 L520 500 Z"
            fill="#C59E53"
            opacity="0.85"
          />
          <path
            d="M220 500 C270 380, 380 310, 520 300 L520 500 Z"
            fill="#164535"
          />
        </svg>



        <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-28 sm:px-6 lg:pt-16 lg:pb-36">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="space-y-6 relative z-10">
              {/* Badge: Learn • Practice • Drive Safe */}
              <div className="inline-flex items-center gap-2 border border-[#164535]/30 bg-[#E8EFEA] px-3.5 py-1.5 text-xs font-semibold text-[#164535] shadow-xs">
                <ShieldCheck className="h-4 w-4 text-[#164535]" />
                <span>Learn</span>
                <span className="text-[#C59E53]">•</span>
                <span>Practice</span>
                <span className="text-[#C59E53]">•</span>
                <span>Drive Safe</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl text-[#164535]">
                BBC Motors
                <br />
                Driving School
              </h1>

              {/* Tagline with Gold Dots */}
              <p className="flex flex-wrap items-center gap-x-3 text-lg font-bold text-[#164535] sm:text-xl">
                <span>Drive Safe</span>
                <span className="text-[#C59E53] text-xl font-black">•</span>
                <span>Drive Smart</span>
                <span className="text-[#C59E53] text-xl font-black">•</span>
                <span>Drive Confident</span>
              </p>

              {/* Subtitle */}
              <p className="text-base font-medium text-[#3A564A] max-w-md">
                Authorized Driving School under Government of Assam
              </p>

              {/* Explore Courses Button with Sharp Corners */}
              <div className="pt-2">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2.5 bg-[#164535] hover:bg-[#0e2c22] text-white font-semibold text-sm px-7 py-3.5 border border-[#C59E53] shadow-md transition-colors"
                >
                  Explore Courses <ArrowRight className="h-4 w-4 text-[#E5C179]" />
                </Link>
              </div>
            </div>

            {/* Right Side: Training Car Photo with Gold Border and Sharp Corners */}
            <div className="relative z-10">
              <div className="border-2 border-[#C59E53] bg-white p-1 shadow-2xl">
                <img
                  src={heroCar}
                  alt="BBC Motors official training car on driving track in Assam"
                  className="h-auto w-full object-cover aspect-[16/10]"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Transition to Feature Cards & Clean White/Ivory Section */}
      <div className="bg-[#F5F4EF] text-slate-800">
        {/* Floating 4 Feature Cards with SHARP corners */}
        <section className="relative z-20 mx-auto -mt-16 max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, sub, to }) => (
              <Link
                key={title}
                to={to}
                className="group flex items-center justify-between border border-slate-200/90 bg-white p-5 shadow-md transition-all hover:-translate-y-1 hover:border-[#C59E53] hover:shadow-xl"
              >
                <div className="flex items-center gap-3.5">
                  <div className="grid h-12 w-12 shrink-0 place-items-center bg-[#EAF1ED] text-[#164535]">
                    <Icon className="h-6 w-6 text-[#164535]" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#164535] text-sm sm:text-base leading-snug">{title}</h3>
                    <p className="mt-0.5 text-xs text-slate-500 font-medium">{sub}</p>
                  </div>
                </div>
                <div className="grid h-7 w-7 shrink-0 place-items-center border border-[#C59E53]/60 bg-[#FAF7F0] text-[#C59E53] transition-colors group-hover:bg-[#C59E53] group-hover:text-white">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. About BBC Motors Section (Clean Warm Background with Sharp Corners) */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Description */}
            <div className="space-y-5">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#164535] sm:text-4xl">
                About BBC Motor
              </h2>
              <p className="text-base leading-relaxed text-slate-700 max-w-xl">
                BBC Motors Driving School is a Govt. authorized driving school, committed to provide quality
                driving training with modern facilities and transparent system.
              </p>
              <p className="text-sm leading-relaxed text-slate-600 max-w-xl">
                Located on Station Road in Karimganj, we specialize in comprehensive practical road training,
                RTO test-track maneuvering, and road safety education for both beginner and commercial drivers.
              </p>
              <div className="pt-3">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2.5 bg-[#164535] hover:bg-[#0e2c22] text-white px-6 py-3 text-sm font-semibold border border-[#C59E53] shadow-sm transition-colors"
                >
                  Know More <ArrowRight className="h-4 w-4 text-[#E5C179]" />
                </Link>
              </div>
            </div>

            {/* Right Photo: School Building with Gold Border and Sharp Corners */}
            <div className="border-2 border-[#C59E53] bg-white p-1 shadow-xl">
              <img
                src={schoolBuilding}
                alt="BBC Motor Driving School training center building in Karimganj, Assam"
                className="h-auto w-full object-cover aspect-[16/9]"
              />
            </div>
          </div>
        </section>

        {/* 4. Courses Offered Section */}
        <section className="border-t border-[#E2DFD5] bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#C59E53]">Training Programs</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#164535] sm:text-3xl">
                  Courses Offered
                </h2>
              </div>
              <Link to="/courses" className="text-sm font-semibold text-[#164535] hover:text-[#C59E53]">
                View all details &amp; syllabus →
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {courses.map((course) => (
                <div
                  key={course.code}
                  className="flex flex-col justify-between border border-slate-200 bg-[#FAF9F6] p-6 shadow-sm transition-all hover:border-[#C59E53] hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="border border-[#164535]/30 bg-[#EAF1ED] px-2.5 py-0.5 text-xs font-bold text-[#164535]">
                        {course.code}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Clock className="h-3.5 w-3.5 text-[#C59E53]" /> {course.duration}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-[#164535]">{course.name}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{course.description}</p>

                    <div className="mt-4 space-y-1.5 border-t border-slate-200 pt-3 text-xs text-slate-700">
                      {course.modules.map((m) => (
                        <div key={m} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <Link
                      to="/contact"
                      className="block w-full text-center border border-[#164535] bg-[#164535] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0e2c22]"
                    >
                      Enrol Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

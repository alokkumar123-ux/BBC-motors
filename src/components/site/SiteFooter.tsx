import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Emblem } from "./Emblem";

export function SiteFooter() {
  return (
    <footer className="bg-[#164535] text-white border-t-2 border-[#C59E53]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Emblem className="h-11 w-11 brightness-110" />
          <div className="leading-tight">
            <p className="text-sm font-bold text-white">Government of Assam</p>
            <p className="text-xs text-white/75">Transport Department • BBC Motors Driving School</p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium md:ml-auto text-white/85">
          <Link to="/privacy" className="hover:text-[#E8D49E] hover:underline">Privacy Policy</Link>
          <span className="text-white/30">|</span>
          <Link to="/terms" className="hover:text-[#E8D49E] hover:underline">Terms &amp; Conditions</Link>
          <span className="text-white/30">|</span>
          <Link to="/contact" className="hover:text-[#E8D49E] hover:underline">Contact Us</Link>
        </nav>
        <div className="flex items-center gap-3 text-xs font-medium md:ml-10 text-white/90">
          Follow Us:
          {[
            { Icon: Youtube, label: "YouTube" },
            { Icon: Facebook, label: "Facebook" },
            { Icon: Instagram, label: "Instagram" },
          ].map(({ Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="grid h-7 w-7 place-items-center bg-[#C59E53] text-[#164535] transition-transform hover:scale-110"
            >
              <Icon className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </div>
      <p className="border-t border-white/10 py-3.5 text-center text-[11px] text-white/70">
        © 2026 BBC Motors Driving School, Karimganj, Assam. Licence No. DTK/MDLS/02/2004
      </p>
    </footer>
  );
}

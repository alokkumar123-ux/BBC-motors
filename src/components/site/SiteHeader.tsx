import { Link } from "@tanstack/react-router";
import { Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Emblem } from "./Emblem";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/courses", label: "Courses" },
  { to: "/verify", label: "Verify Certificate" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-[#164535] text-white shadow-md border-b-2 border-[#C59E53]">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3">
          <Emblem className="h-11 w-11 shrink-0 brightness-110 drop-shadow" />
          <div className="hidden text-xs leading-tight text-white/85 sm:block font-medium">
            <span>Government</span>
            <br />
            <span>of Assam</span>
          </div>
          <span className="mx-1 hidden h-9 w-px bg-white/25 sm:block" />
          <div className="leading-tight">
            <span className="block text-base font-bold tracking-tight text-white sm:text-lg">
              BBC Motors Driving School
            </span>
            <span className="block text-xs font-normal text-white/75">
              Karimganj, Assam
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              className="px-3.5 py-2 text-sm font-medium text-white/90 transition-colors hover:text-[#E8D49E] data-[status=active]:text-[#E8D49E] data-[status=active]:font-semibold data-[status=active]:underline data-[status=active]:underline-offset-8"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="ml-4 inline-flex items-center gap-2 bg-[#C59E53] hover:bg-[#D4AF5F] px-4 py-2 text-sm font-bold text-[#164535] shadow-sm transition-colors"
          >
            <UserRound className="h-4 w-4 text-[#164535]" /> Student Login
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="ml-auto p-2 text-white lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <nav className="border-t border-white/10 bg-[#164535] px-4 pb-5 pt-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 bg-[#C59E53] px-4 py-2.5 text-sm font-bold text-[#164535]"
          >
            <UserRound className="h-4 w-4" /> Student Login
          </Link>
        </nav>
      )}
    </header>
  );
}

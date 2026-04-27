import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";

type Route = "home" | "faq";

interface NavLink {
  href: string;
  label: string;
  route?: Route;
}

const navLinks: NavLink[] = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#packages", label: "Packages" },
  { href: "#about", label: "About" },
  { href: "/faq", label: "FAQ", route: "faq" },
  { href: "#contact", label: "Contact" },
];

interface HeaderProps {
  currentRoute: Route;
}

function navigate(route: Route, path: string) {
  window.history.pushState({}, "", path);
  const nav = (window as Window & { __mkmNavigate?: (r: Route) => void })
    .__mkmNavigate;
  if (nav) nav(route);
}

export default function Header({ currentRoute }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (link: NavLink) => {
    setMenuOpen(false);

    if (link.route) {
      // Route to a dedicated page
      navigate(link.route, link.href);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Anchor-based scroll — if we're on a sub-page, go home first then scroll
    if (currentRoute !== "home") {
      navigate("home", "/");
      // Scroll after a brief paint cycle
      setTimeout(() => {
        const el = document.querySelector(link.href);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 80);
      return;
    }

    const el = document.querySelector(link.href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0a1f44] shadow-lg" : "bg-[#0a1f44]/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo + Brand */}
          <button
            type="button"
            data-ocid="nav.link"
            onClick={() => handleNavClick({ href: "#home", label: "Home" })}
            className="flex items-center gap-3 shrink-0 group"
            aria-label="Go to home"
          >
            <img
              src="/assets/generated/mkm-logo-nobg-transparent.dim_300x360.png"
              alt="MKM Freight Logistics LLC Shield Logo"
              className="h-12 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <div className="text-white font-display font-bold text-base leading-tight group-hover:text-[#c9a84c] transition-colors">
                MKM Freight Logistics LLC
              </div>
              <div className="text-[#c9a84c] text-xs leading-tight font-medium tracking-wide">
                DOT Compliance &amp; Safety Support
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = link.route
                ? currentRoute === link.route
                : currentRoute === "home";
              return (
                <button
                  key={link.href}
                  type="button"
                  data-ocid="nav.link"
                  onClick={() => handleNavClick(link)}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] ${
                    isActive && link.route
                      ? "text-[#c9a84c]"
                      : "text-white/90 hover:text-[#c9a84c]"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Phone + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:3072643515"
              className="flex items-center gap-1.5 text-[#c9a84c] text-sm font-semibold hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              (307) 264-3515
            </a>
            <button
              type="button"
              data-ocid="contact.primary_button"
              onClick={() =>
                handleNavClick({ href: "#contact", label: "Contact" })
              }
              className="bg-[#c9a84c] text-[#0a1f44] font-bold text-sm px-5 py-2.5 rounded hover:bg-[#d4b55a] transition-colors"
            >
              Get a Free Consultation
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-white hover:text-[#c9a84c] transition-colors"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden pb-4 border-t border-white/10">
            <nav
              className="flex flex-col gap-1 pt-3"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => {
                const isActive = link.route
                  ? currentRoute === link.route
                  : false;
                return (
                  <button
                    key={link.href}
                    type="button"
                    data-ocid="nav.link"
                    onClick={() => handleNavClick(link)}
                    className={`text-left px-3 py-2.5 text-sm font-medium hover:bg-white/5 rounded transition-colors ${
                      isActive
                        ? "text-[#c9a84c]"
                        : "text-white/90 hover:text-[#c9a84c]"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
              <a
                href="tel:3072643515"
                className="flex items-center gap-2 px-3 py-2.5 text-[#c9a84c] text-sm font-semibold"
              >
                <Phone className="w-4 h-4" />
                (307) 264-3515
              </a>
              <button
                type="button"
                data-ocid="contact.primary_button"
                onClick={() =>
                  handleNavClick({ href: "#contact", label: "Contact" })
                }
                className="mt-1 bg-[#c9a84c] text-[#0a1f44] font-bold text-sm px-5 py-3 rounded text-center hover:bg-[#d4b55a] transition-colors"
              >
                Get a Free Consultation
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

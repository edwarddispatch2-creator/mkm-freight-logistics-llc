import { Clock, Mail, MapPin, Phone } from "lucide-react";

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

interface FooterProps {
  currentRoute: Route;
}

function navigate(route: Route, path: string) {
  window.history.pushState({}, "", path);
  const nav = (window as Window & { __mkmNavigate?: (r: Route) => void })
    .__mkmNavigate;
  if (nav) nav(route);
}

export default function Footer({ currentRoute }: FooterProps) {
  const handleNavClick = (link: NavLink) => {
    if (link.route) {
      navigate(link.route, link.href);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentRoute !== "home") {
      navigate("home", "/");
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
    <footer className="bg-[#0a1f44] text-white">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/generated/mkm-logo-nobg-transparent.dim_300x360.png"
                alt="MKM Freight Logistics LLC"
                className="h-14 w-auto object-contain"
              />
              <div>
                <div className="font-display font-bold text-lg text-white leading-tight">
                  MKM Freight Logistics LLC
                </div>
                <div className="text-[#c9a84c] text-xs font-medium tracking-wide mt-0.5">
                  DOT Compliance Support
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              <span className="text-[#c9a84c] font-semibold">
                Stay Compliant. Stay Rolling.
              </span>
              <br />
              Helping trucking companies across all 50 states navigate DOT and
              FMCSA regulations with confidence.
            </p>
            <div className="flex items-center gap-2 mt-4 text-white/50 text-sm">
              <Clock className="w-4 h-4 text-[#c9a84c] shrink-0" />
              <span>Mon–Fri 8:00 AM – 6:00 PM MT</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display font-semibold text-sm mb-4 text-[#c9a84c] uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    data-ocid="nav.link"
                    onClick={() => handleNavClick(link)}
                    className="text-white/60 hover:text-white text-sm transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-sm mb-4 text-[#c9a84c] uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4 text-[#c9a84c] shrink-0" />
                <a
                  href="tel:3072643515"
                  className="hover:text-white transition-colors"
                >
                  (307) 264-3515
                </a>
              </li>
              <li className="flex items-start gap-2 text-white/60 text-sm">
                <Mail className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                <a
                  href="mailto:info@mkmfreightlogistics.com"
                  className="hover:text-white transition-colors break-all"
                >
                  info@mkmfreightlogistics.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-[#c9a84c] shrink-0" />
                <span>Wyoming, USA — Serving All 50 States</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} MKM Freight Logistics LLC. All
            rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

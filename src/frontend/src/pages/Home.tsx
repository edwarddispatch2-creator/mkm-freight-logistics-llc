import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart2,
  Bell,
  Calculator,
  CheckCircle,
  ChevronDown,
  Clock,
  CreditCard,
  FileText,
  FlaskConical,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Shield,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useIsAdmin,
  useSubmissions,
  useSubmitContactForm,
} from "../hooks/useQueries";

// ---------- Data ----------

const dotServices = [
  {
    icon: FileText,
    title: "DOT Compliance Setup",
    desc: "Assistance with USDOT numbers, operating authority, and regulatory requirements.",
  },
  {
    icon: Users,
    title: "Driver Qualification Files (DQF)",
    desc: "Part 391 compliant driver qualification file setup and management.",
  },
  {
    icon: FlaskConical,
    title: "Drug & Alcohol Programs",
    desc: "Consortium enrollment, Clearinghouse compliance, and testing program support.",
  },
  {
    icon: Shield,
    title: "Safety Audit Preparation",
    desc: "New entrant safety audit preparation and regulatory guidance.",
  },
];

const ongoingServices = [
  {
    icon: BarChart2,
    title: "CSA Monitoring",
    desc: "Track your safety scores and BASIC percentiles with proactive alerts.",
  },
  {
    icon: Calculator,
    title: "IFTA Reporting",
    desc: "Quarterly IFTA fuel tax return preparation and account management.",
  },
  {
    icon: CreditCard,
    title: "IRP Credential Assistance",
    desc: "Apportioned registration and IRP credential renewals across jurisdictions.",
  },
  {
    icon: Bell,
    title: "Regulatory Updates & Monitoring",
    desc: "Stay informed of FMCSA rule changes that affect your operations.",
  },
];

const packages = [
  {
    id: "starter",
    name: "Starter Compliance",
    subtitle: "For Owner Operators (1–3 trucks)",
    price: "$300",
    featured: false,
    badge: null,
    features: [
      "DOT number setup and maintenance",
      "Driver qualification file (DQF) management",
      "Quarterly IFTA filing",
      "Permit renewals (all 50 states)",
      "Monthly compliance report",
    ],
  },
  {
    id: "growth",
    name: "Growth Compliance",
    subtitle: "For Small Fleets (4–10 trucks)",
    price: "$800",
    featured: true,
    badge: "MOST POPULAR",
    features: [
      "Everything in Starter",
      "Weekly ELD log auditing (11/14/70-hour rules)",
      "Drug & alcohol Clearinghouse management",
      "CSA score monitoring and alerts",
      "Virtual mock audit every 6 months",
    ],
  },
  {
    id: "fleet",
    name: "Fleet Compliance",
    subtitle: "For Larger Carriers (11–20 trucks)",
    price: "$1,700",
    featured: false,
    badge: null,
    features: [
      "Everything in Growth",
      "Full audit binder preparation",
      "Real-time phone support during DOT audits",
      "Monthly safety coaching call",
      "4-year IFTA record storage",
    ],
  },
];

// ---------- Sub-components ----------

function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[680px] lg:min-h-[720px] flex items-center justify-center"
      style={{
        backgroundImage:
          "url(/assets/generated/hero-highway-banner.dim_1600x700.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(10,31,68,0.75)" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <img
            src="/assets/generated/mkm-logo-nobg-transparent.dim_300x360.png"
            alt="MKM Freight Logistics LLC"
            className="h-28 w-auto object-contain mx-auto mb-6"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
        >
          Stay Compliant.
          <span className="text-[#c9a84c]"> Stay Rolling.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          className="text-white/90 text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          DOT Compliance &amp; Safety Support for Trucking Companies Across the
          United States.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: "easeOut" }}
          className="text-white/70 text-base max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          MKM Freight Logistics LLC helps carriers stay compliant with FMCSA
          regulations, prepare for DOT safety audits, manage driver
          qualification files, and maintain ongoing compliance programs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
        >
          <button
            type="button"
            data-ocid="hero.primary_button"
            onClick={() => scrollTo("contact")}
            className="bg-[#c9a84c] text-[#0a1f44] font-bold px-7 py-3.5 rounded text-sm hover:bg-[#d4b55a] transition-colors"
          >
            Get Your Free DOT Compliance Check
          </button>
          <button
            type="button"
            data-ocid="hero.secondary_button"
            onClick={() => scrollTo("contact")}
            className="border-2 border-white text-white font-bold px-7 py-3.5 rounded text-sm hover:bg-white hover:text-[#0a1f44] transition-colors"
          >
            Book a Compliance Consultation
          </button>
        </motion.div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
          href="tel:3072643515"
          className="inline-flex items-center gap-2 text-[#c9a84c] font-bold text-xl hover:text-white transition-colors"
        >
          <Phone className="w-5 h-5" />
          (307) 264-3515
        </motion.a>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="bg-[#f5f5f5] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[#c9a84c] font-semibold text-xs uppercase tracking-[0.15em] mb-3">
            What We Offer
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0a1f44]">
            DOT Compliance Services
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dotServices.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-lg shadow-card border-t-4 border-[#c9a84c] p-6 hover:shadow-card-hover transition-shadow"
            >
              <div className="w-12 h-12 bg-[#0a1f44] rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-[#c9a84c]" />
              </div>
              <h3 className="font-display font-bold text-[#0a1f44] text-base mb-2">
                {title}
              </h3>
              <p className="text-[#555] text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Ongoing compliance */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0a1f44]">
              Ongoing Compliance Support
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ongoingServices.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-lg shadow-card p-6 flex flex-col items-start gap-3 hover:shadow-card-hover transition-shadow border border-[#e8e8e8]"
              >
                <div className="w-10 h-10 bg-[#0a1f44]/10 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#0a1f44]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-[#0a1f44] text-sm mb-1">
                    {title}
                  </h3>
                  <p className="text-[#666] text-xs leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="bg-[#0a1f44] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#c9a84c] font-semibold text-xs uppercase tracking-[0.15em] mb-3">
              Who We Are
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
              About MKM Freight Logistics
            </h2>
            <p className="text-white/75 leading-relaxed mb-5">
              MKM Freight Logistics LLC provides compliance and regulatory
              support for trucking companies across the United States. Our goal
              is to help carriers understand complex DOT regulations, avoid
              costly violations, and operate safely under FMCSA guidelines.
            </p>
            <p className="text-white/75 leading-relaxed">
              We support owner-operators, small fleets, and growing carriers
              with practical compliance solutions designed to keep trucks moving
              legally and efficiently.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { label: "All 50 States", sub: "Nationwide coverage" },
              { label: "DOT & FMCSA", sub: "Full regulatory expertise" },
              { label: "Owner-Operators", sub: "to Large Fleets" },
              { label: "Proven Process", sub: "Audit-ready compliance" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/10 rounded-lg p-5 border border-white/10 backdrop-blur-sm"
              >
                <div className="font-display font-bold text-[#c9a84c] text-lg mb-1">
                  {item.label}
                </div>
                <div className="text-white/60 text-xs">{item.sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PackagesSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section id="packages" className="py-20" style={{ background: "#f8f9fb" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-[#c9a84c] font-semibold text-xs uppercase tracking-[0.15em] mb-3">
            Pricing
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0a1f44]">
            Compliance Packages
          </h2>
          <p className="text-[#666] mt-3 text-sm max-w-md mx-auto leading-relaxed">
            Choose the right plan for your fleet size
          </p>
        </div>

        {/* Cards Grid — items-stretch for equal height */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              data-ocid={`packages.item.${i + 1}`}
              className={[
                "relative rounded-2xl p-8 flex flex-col h-full",
                "transition-all duration-300 hover:shadow-xl",
                pkg.featured
                  ? "border-2 border-[#c9a84c] bg-[#0a1f44] shadow-xl md:scale-105"
                  : "border border-[#e0e8f0] bg-white",
              ]
                .filter(Boolean)
                .join(" ")}
              style={
                !pkg.featured
                  ? { boxShadow: "0 4px 24px rgba(10,31,68,0.08)" }
                  : { boxShadow: "0 8px 40px rgba(10,31,68,0.22)" }
              }
            >
              {/* MOST POPULAR badge */}
              {pkg.badge && (
                <div className="flex justify-center mb-4">
                  <span
                    className="inline-block bg-[#c9a84c] text-[#0a1f44] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest leading-none"
                    data-ocid="packages.badge"
                  >
                    {pkg.badge}
                  </span>
                </div>
              )}

              {/* Name & Subtitle */}
              <div className="mb-5">
                <h3
                  className={`font-display font-bold text-xl leading-tight mb-1.5 break-words ${
                    pkg.featured ? "text-white" : "text-[#0a1f44]"
                  }`}
                >
                  {pkg.name}
                </h3>
                <p
                  className={`text-sm font-medium leading-snug break-words ${
                    pkg.featured ? "text-[#c9a84c]" : "text-[#888]"
                  }`}
                >
                  {pkg.subtitle}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-end gap-1 mb-6">
                <span
                  className={`font-display font-bold text-5xl leading-none ${
                    pkg.featured ? "text-white" : "text-[#0a1f44]"
                  }`}
                >
                  {pkg.price}
                </span>
                <span
                  className={`text-sm font-semibold mb-1 ${
                    pkg.featured ? "text-white/60" : "text-[#aaa]"
                  }`}
                >
                  /mo
                </span>
              </div>

              {/* Divider */}
              <div
                className={`w-full h-px mb-5 ${
                  pkg.featured ? "bg-white/15" : "bg-[#e8edf3]"
                }`}
              />

              {/* Feature List */}
              <ul className="space-y-3 flex-1">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 min-w-0"
                  >
                    <span
                      className="shrink-0 w-5 h-5 mt-0.5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "#c9a84c", color: "#0a1f44" }}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span
                      className={`text-sm leading-snug break-words min-w-0 ${
                        pkg.featured ? "text-white/85" : "text-[#444]"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button — pushed to bottom */}
              <div className="mt-8">
                <button
                  type="button"
                  data-ocid={`packages.primary_button.${i + 1}`}
                  onClick={() => scrollTo("contact")}
                  className={`w-full font-bold py-3.5 rounded-lg text-sm transition-colors duration-200 ${
                    pkg.featured
                      ? "bg-[#c9a84c] text-[#0a1f44] hover:bg-[#d4b55a]"
                      : "bg-[#0a1f44] text-white hover:bg-[#0c2552]"
                  }`}
                >
                  Contact Us for Custom Pricing
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#c9a84c] py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0a1f44] mb-4">
          Ready to Get Your Trucking Company Compliant?
        </h2>
        <p className="text-[#0a1f44]/80 text-base mb-8 max-w-2xl mx-auto">
          Avoid violations, prepare for safety audits, and ensure your company
          stays compliant with FMCSA regulations.
        </p>
        <button
          type="button"
          data-ocid="cta.primary_button"
          onClick={() => scrollTo("contact")}
          className="bg-[#0a1f44] text-white font-bold px-8 py-4 rounded text-sm hover:bg-[#0c2552] transition-colors"
        >
          Schedule Your Compliance Consultation
        </button>
      </div>
    </section>
  );
}

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    phone: "",
    email: "",
    numTrucks: "",
    serviceNeeded: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const submitMutation = useSubmitContactForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitMutation.mutateAsync({
        name: form.name,
        companyName: form.companyName,
        phone: form.phone,
        email: form.email,
        numTrucks: form.numTrucks || "Not specified",
        serviceNeeded: form.serviceNeeded || "Not specified",
      });
      setSubmitted(true);
      toast.success("Message sent! We'll be in touch within one business day.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "Not connected") {
        toast.info(
          "Contact form is available on the live site at mkmfreightlogistics.com. Please call (307) 264-3515 to reach us directly.",
          { duration: 8000 },
        );
      } else {
        toast.error(
          "Something went wrong. Please try again or call us directly.",
        );
      }
    }
  };

  if (submitted) {
    return (
      <div
        data-ocid="contact.success_state"
        className="bg-green-50 border border-green-200 rounded-lg p-10 text-center"
      >
        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h3 className="font-display text-xl font-bold text-[#0a1f44] mb-2">
          Message Received!
        </h3>
        <p className="text-[#555] text-sm">
          Thank you for reaching out. A compliance specialist will contact you
          within one business day.
        </p>
        <p className="text-[#555] text-sm mt-3">
          For urgent matters, call{" "}
          <a href="tel:3072643515" className="text-[#c9a84c] font-semibold">
            (307) 264-3515
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="contact-name"
            className="text-sm font-semibold text-[#0a1f44]"
          >
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contact-name"
            name="name"
            type="text"
            data-ocid="contact.input"
            value={form.name}
            onChange={handleChange}
            placeholder="John Smith"
            required
            className="border-[#ddd] focus:ring-[#c9a84c] focus:border-[#c9a84c] text-base"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="contact-company"
            className="text-sm font-semibold text-[#0a1f44]"
          >
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contact-company"
            name="companyName"
            type="text"
            data-ocid="contact.input"
            value={form.companyName}
            onChange={handleChange}
            placeholder="ABC Trucking LLC"
            required
            className="border-[#ddd] focus:ring-[#c9a84c] focus:border-[#c9a84c] text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="contact-phone"
            className="text-sm font-semibold text-[#0a1f44]"
          >
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            data-ocid="contact.input"
            value={form.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            required
            className="border-[#ddd] focus:ring-[#c9a84c] focus:border-[#c9a84c] text-base"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="contact-email"
            className="text-sm font-semibold text-[#0a1f44]"
          >
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            data-ocid="contact.input"
            value={form.email}
            onChange={handleChange}
            placeholder="john@abctrucking.com"
            required
            className="border-[#ddd] focus:ring-[#c9a84c] focus:border-[#c9a84c] text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="contact-trucks"
            className="text-sm font-semibold text-[#0a1f44]"
          >
            Number of Trucks
          </Label>
          <Select
            value={form.numTrucks}
            onValueChange={(val) =>
              setForm((prev) => ({ ...prev, numTrucks: val }))
            }
          >
            <SelectTrigger
              id="contact-trucks"
              data-ocid="contact.select"
              className="border-[#ddd] text-base"
            >
              <SelectValue placeholder="Select fleet size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 truck</SelectItem>
              <SelectItem value="2-5">2–5 trucks</SelectItem>
              <SelectItem value="6-10">6–10 trucks</SelectItem>
              <SelectItem value="11-25">11–25 trucks</SelectItem>
              <SelectItem value="26+">26+ trucks</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="contact-service"
            className="text-sm font-semibold text-[#0a1f44]"
          >
            Service Needed
          </Label>
          <Select
            value={form.serviceNeeded}
            onValueChange={(val) =>
              setForm((prev) => ({ ...prev, serviceNeeded: val }))
            }
          >
            <SelectTrigger
              id="contact-service"
              data-ocid="contact.select"
              className="border-[#ddd] text-base"
            >
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DOT Compliance Setup">
                DOT Compliance Setup
              </SelectItem>
              <SelectItem value="Driver Qualification Files">
                Driver Qualification Files
              </SelectItem>
              <SelectItem value="Drug & Alcohol Programs">
                Drug &amp; Alcohol Programs
              </SelectItem>
              <SelectItem value="Safety Audit Preparation">
                Safety Audit Preparation
              </SelectItem>
              <SelectItem value="Ongoing Compliance">
                Ongoing Compliance
              </SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {submitMutation.isError && (
        <div
          data-ocid="contact.error_state"
          className="bg-red-50 border border-red-200 rounded px-4 py-3 text-red-700 text-sm"
        >
          Something went wrong. Please try again or call (307) 264-3515.
        </div>
      )}

      <Button
        type="submit"
        data-ocid="contact.submit_button"
        disabled={submitMutation.isPending}
        className="w-full bg-[#0a1f44] hover:bg-[#0c2552] text-white font-bold py-3 text-sm rounded"
      >
        {submitMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[#c9a84c] font-semibold text-xs uppercase tracking-[0.15em] mb-3">
            Get In Touch
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0a1f44]">
            Contact Us
          </h2>
          <p className="text-[#666] mt-3 text-sm">
            Ready to get compliant? Fill out the form and a specialist will
            respond within one business day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <div className="bg-[#0a1f44] rounded-lg p-8 text-white h-full">
              <h3 className="font-display font-bold text-xl mb-2">
                Ready to Get Compliant?
              </h3>
              <p className="text-white/60 text-sm mb-8">
                Reach out by phone, email, or the contact form. We respond to
                all inquiries within one business day.
              </p>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-[#c9a84c] rounded flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#0a1f44]" />
                  </div>
                  <div>
                    <div className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wide mb-0.5">
                      Phone
                    </div>
                    <a
                      href="tel:3072643515"
                      className="text-white font-bold hover:text-[#c9a84c] transition-colors"
                    >
                      (307) 264-3515
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-[#c9a84c] rounded flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#0a1f44]" />
                  </div>
                  <div>
                    <div className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wide mb-0.5">
                      Email
                    </div>
                    <a
                      href="mailto:info@mkmfreightlogistics.com"
                      className="text-white font-semibold hover:text-[#c9a84c] transition-colors text-sm break-all"
                    >
                      info@mkmfreightlogistics.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-[#c9a84c] rounded flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#0a1f44]" />
                  </div>
                  <div>
                    <div className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wide mb-0.5">
                      Location
                    </div>
                    <span className="text-white font-semibold">
                      Wyoming, USA
                    </span>
                    <p className="text-white/50 text-xs mt-0.5">
                      Serving All 50 States
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-[#c9a84c] rounded flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#0a1f44]" />
                  </div>
                  <div>
                    <div className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wide mb-0.5">
                      Business Hours
                    </div>
                    <span className="text-white font-semibold">
                      Mon–Fri 8:00 AM – 6:00 PM MT
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminSection() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: submissions, isLoading: subsLoading } = useSubmissions();

  if (adminLoading) return null;
  if (!isAdmin) return null;

  return (
    <section className="bg-[#f5f5f5] py-16 border-t-4 border-[#c9a84c]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <span className="inline-block bg-[#c9a84c] text-[#0a1f44] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            Admin Only
          </span>
          <h2 className="font-display text-2xl font-bold text-[#0a1f44]">
            Contact Form Submissions
          </h2>
        </div>

        {subsLoading ? (
          <div data-ocid="admin.loading_state" className="space-y-3">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-12 w-full rounded" />
            ))}
          </div>
        ) : !submissions || submissions.length === 0 ? (
          <div
            data-ocid="admin.empty_state"
            className="bg-white rounded-lg p-10 text-center border border-[#ddd]"
          >
            <p className="text-[#888] text-sm">No submissions yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#ddd] bg-white">
            <Table data-ocid="admin.table">
              <TableHeader>
                <TableRow className="bg-[#0a1f44] hover:bg-[#0a1f44]">
                  <TableHead className="text-white font-semibold">#</TableHead>
                  <TableHead className="text-white font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Company
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Phone
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Email
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Trucks
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Service
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {submissions.map((sub, i) => (
                    <motion.tr
                      key={`${sub.name}-${i}`}
                      data-ocid={`admin.row.${i + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-[#eee] hover:bg-[#fafafa] transition-colors"
                    >
                      <TableCell className="text-[#888] text-sm">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-medium text-[#0a1f44] text-sm">
                        {sub.name}
                      </TableCell>
                      <TableCell className="text-sm text-[#555]">
                        {sub.companyName}
                      </TableCell>
                      <TableCell className="text-sm">
                        <a
                          href={`tel:${sub.phone}`}
                          className="text-[#0a1f44] hover:text-[#c9a84c] transition-colors"
                        >
                          {sub.phone}
                        </a>
                      </TableCell>
                      <TableCell className="text-sm">
                        <a
                          href={`mailto:${sub.email}`}
                          className="text-[#0a1f44] hover:text-[#c9a84c] transition-colors break-all"
                        >
                          {sub.email}
                        </a>
                      </TableCell>
                      <TableCell className="text-sm text-[#555]">
                        {sub.numTrucks}
                      </TableCell>
                      <TableCell className="text-sm text-[#555]">
                        {sub.serviceNeeded}
                      </TableCell>
                      <TableCell className="text-sm text-[#888]">
                        {new Date(
                          Number(sub.timestamp) / 1_000_000,
                        ).toLocaleDateString()}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <PackagesSection />
      <CTASection />
      <ContactSection />
      <AdminSection />
    </div>
  );
}

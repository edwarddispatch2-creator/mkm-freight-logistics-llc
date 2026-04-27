import { BarChart3, Download, FileText, Globe, Truck } from "lucide-react";

const checklistContent = `DOT COMPLIANCE CHECKLIST FOR TRUCKING COMPANIES\nMKM Freight Logistics LLC | info@mkmfreightlogistics.com | (307) 264-3515\n==============================\n\nREGISTRATION & AUTHORITY\n[ ] Active USDOT Number\n[ ] MC Number / Operating Authority\n[ ] BOC-3 Process Agent Filed\n[ ] UCR Annual Registration\n[ ] MCS-150 Biennial Update\n\nDRIVER QUALIFICATION FILES\n[ ] CDL Copy on File\n[ ] Medical Examiner's Certificate\n[ ] Motor Vehicle Record (Annual)\n[ ] Pre-Employment Drug Test\n[ ] Employment Application\n[ ] Previous Employment Verification\n\nDRUG & ALCOHOL PROGRAM\n[ ] DOT Consortium Enrollment\n[ ] Clearinghouse Account Active\n[ ] Pre-Employment Query Completed\n[ ] Annual Limited Query Completed\n\nVEHICLE MAINTENANCE\n[ ] Preventive Maintenance Program\n[ ] DVIR Daily Inspections\n[ ] Annual Vehicle Inspection\n\nContact MKM Freight Logistics for a full compliance assessment.\nPhone: (307) 264-3515 | Email: info@mkmfreightlogistics.com\n`;

const safetyTips = [
  {
    icon: FileText,
    title: "Keep DQFs Current",
    tip: "Set calendar reminders for medical certificate renewals and annual MVR pulls.",
  },
  {
    icon: BarChart3,
    title: "Monitor CSA Scores",
    tip: "Check your FMCSA Safety Measurement System (SMS) data monthly and address violations quickly.",
  },
  {
    icon: Truck,
    title: "Maintain Inspection Records",
    tip: "Drivers must complete DVIRs daily. Retain records for at least 3 months.",
  },
];

export default function Resources() {
  const handleDownload = () => {
    const blob = new Blob([checklistContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DOT-Compliance-Checklist-MKM-Freight-Logistics.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <section className="bg-[#0B1F3B] py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-3">
            Compliance Resources
          </h1>
          <p className="text-white/70 max-w-2xl">
            Free guides and checklists to help trucking companies meet DOT
            compliance requirements.
          </p>
        </div>
      </section>

      {/* DOT Checklist Download */}
      <section className="py-12 bg-[#F5F7FA]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white border-2 border-[#C9A227] rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#0B1F3B] shrink-0">
              <Download className="w-8 h-8 text-[#C9A227]" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#0B1F3B] mb-2">
                DOT Compliance Checklist for Trucking Companies
              </h2>
              <p className="text-[#5B6675] leading-relaxed">
                A comprehensive checklist covering registration, driver
                qualification files, drug &amp; alcohol programs, and more.
              </p>
            </div>
            <div className="shrink-0">
              <button
                type="button"
                data-ocid="resources.download_checklist_button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 bg-[#C9A227] text-[#0B1F3B] font-semibold px-6 py-3 rounded-full hover:bg-[#D2B15A] transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Free Checklist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Offline / Standalone Download */}
      <section className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-[#0B1F3B] rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#C9A227]/20 shrink-0">
              <Globe className="w-7 h-7 text-[#C9A227]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">
                Offline Version of This Website
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Download the entire MKM Freight Logistics website as a single
                self-contained HTML file — open it in any browser, no internet
                required.
              </p>
            </div>
            <div className="shrink-0">
              <a
                href="/mkm-freight-standalone.html"
                download="mkm-freight-standalone.html"
                data-ocid="resources.download_offline_button"
                className="inline-flex items-center gap-2 bg-[#C9A227] text-[#0B1F3B] font-semibold px-6 py-3 rounded-full hover:bg-[#D2B15A] transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Offline Version
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-14 bg-[#F5F7FA]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#0B1F3B] mb-8 text-center">
            Compliance Safety Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {safetyTips.map(({ icon: Icon, title, tip }) => (
              <div
                key={title}
                className="bg-white border border-[#E6E9EF] rounded-xl shadow-sm p-6"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#0B1F3B] mb-3">
                  <Icon className="w-5 h-5 text-[#C9A227]" />
                </div>
                <h3 className="font-semibold text-[#0B1F3B] mb-2">{title}</h3>
                <p className="text-[#5B6675] text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

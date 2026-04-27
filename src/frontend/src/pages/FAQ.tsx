import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const faqCategories = [
  {
    category: "DOT Compliance Basics",
    questions: [
      {
        q: "What is a USDOT number and do I need one?",
        a: "A USDOT number is a unique identifier issued by the FMCSA for commercial vehicles. You need one if you operate a commercial vehicle in interstate commerce, transport hazardous materials, or operate vehicles with a GVWR over 10,001 lbs in some states.",
      },
      {
        q: "What is the FMCSA and what does it regulate?",
        a: "The Federal Motor Carrier Safety Administration (FMCSA) is responsible for regulating commercial motor vehicles and motor carriers. The FMCSA establishes and enforces safety standards including hours of service rules, driver qualification requirements, and drug and alcohol testing programs.",
      },
    ],
  },
  {
    category: "Driver Qualification & ELD",
    questions: [
      {
        q: "What documents must be in a Driver Qualification File (DQF)?",
        a: "A complete DQF includes the employment application, motor vehicle record (MVR), pre-employment drug test result, medical examiner's certificate, prior employment verification, road test certificate, and annual review of driving record.",
      },
      {
        q: "Are ELDs required for all commercial drivers?",
        a: "ELDs are required for most commercial motor vehicle drivers who are required to keep records of duty status (RODS). Exceptions include drivers who operate under a short-haul exemption, drivers of vehicles older than model year 2000, or those who use paper logs for 8 or fewer days in a 30-day period.",
      },
    ],
  },
  {
    category: "Safety Ratings & Audits",
    questions: [
      {
        q: "What is a CSA score and how does it affect my business?",
        a: "CSA (Compliance, Safety, Accountability) is the FMCSA's safety measurement system. It uses roadside inspection data, crash reports, and investigation results to generate scores across 7 BASICs (Behavior Analysis and Safety Improvement Categories). High scores can trigger interventions and affect your ability to obtain freight contracts.",
      },
      {
        q: "What happens during a DOT compliance audit?",
        a: "A DOT compliance audit reviews your safety management practices, driver qualification files, hours of service records, vehicle maintenance records, drug and alcohol testing program, and hazmat compliance if applicable. Auditors assign a safety rating: Satisfactory, Conditional, or Unsatisfactory.",
      },
    ],
  },
  {
    category: "Drug & Alcohol Testing",
    questions: [
      {
        q: "What is the FMCSA Drug & Alcohol Clearinghouse?",
        a: "The Clearinghouse is a secure online database that contains information about drug and alcohol program violations by CDL holders. Employers must query it before hiring drivers and conduct annual queries for current drivers. Violations must be reported within 3 business days.",
      },
      {
        q: "How often must drivers be tested for drugs and alcohol?",
        a: "Pre-employment testing is required before a CDL driver operates a CMV. Random testing must cover at least 50% of drivers annually for drugs and 10% for alcohol. Post-accident, reasonable suspicion, return-to-duty, and follow-up testing are also required in specific circumstances.",
      },
    ],
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-[#E6E9EF] rounded-xl overflow-hidden"
      data-ocid={`faq.item.${index}`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 p-5 text-left bg-white hover:bg-[#F5F7FA] transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-[#0B1F3B] text-sm">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#5B6675] shrink-0 mt-0.5" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 bg-white">
          <p className="text-[#5B6675] text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const scrollToContact = () => {
    window.location.href = "/#contact";
  };

  let itemCounter = 0;

  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <section className="bg-[#0B1F3B] py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-white/70 max-w-2xl">
            Answers to the most common questions about DOT compliance, safety
            audits, driver qualification, and FMCSA regulations.
          </p>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="max-w-4xl mx-auto px-6">
          {faqCategories.map(({ category, questions }) => (
            <div key={category} className="mb-10">
              <h2 className="text-xl font-bold text-[#0B1F3B] mb-4">
                {category}
              </h2>
              <div className="space-y-2">
                {questions.map((item) => {
                  itemCounter += 1;
                  return (
                    <FAQItem
                      key={item.q}
                      q={item.q}
                      a={item.a}
                      index={itemCounter}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0B1F3B] py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Still Have Questions?
          </h2>
          <p className="text-white/60 mb-6 max-w-lg mx-auto">
            Our compliance experts are ready to help. Reach out and get
            personalized guidance for your fleet.
          </p>
          <button
            type="button"
            data-ocid="faq.contact_button"
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 bg-[#C9A227] text-[#0B1F3B] font-semibold px-7 py-3 rounded-full hover:bg-[#D2B15A] transition-colors"
          >
            Contact Our Compliance Experts <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

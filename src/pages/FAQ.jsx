import { useState } from "react";
import ScrollReveal from "../components/ScrollReveal";

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Most orders are delivered within 3-7 business days depending on location.",
  },
  {
    q: "Can I return or exchange products?",
    a: "Yes, eligible products can be returned or exchanged within 7 days of delivery.",
  },
  {
    q: "Do you support online payments?",
    a: "Yes. We support secure online payment options along with cash on delivery.",
  },
  {
    q: "How do I know size availability?",
    a: "Each product details page includes size options and stock information in real time.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <h1 className="text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="text-gray-600 mt-3">
            Everything you need before placing your order.
          </p>
        </ScrollReveal>

        <div className="mt-8 space-y-3">
          {faqs.map((item, idx) => (
            <ScrollReveal key={item.q} delay={idx * 80}>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpen((prev) => (prev === idx ? -1 : idx))}
                  className="w-full text-left px-5 py-4 flex items-center justify-between"
                >
                  <span className="font-semibold">{item.q}</span>
                  <span className="text-cyan-700 text-lg">{open === idx ? "-" : "+"}</span>
                </button>
                {open === idx && (
                  <p className="px-5 pb-5 text-gray-600">{item.a}</p>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

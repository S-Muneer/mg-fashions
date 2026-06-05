import ScrollReveal from "../components/ScrollReveal";

export default function Contact() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        <ScrollReveal>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-7 sm:p-8">
            <h1 className="text-3xl font-bold mb-5">Contact Us</h1>
            <div className="space-y-2 text-gray-700">
              <p><strong>Store Name:</strong> MG Fashions</p>
              <p><strong>Location:</strong> Bangalore, India</p>
              <p><strong>Email:</strong> support@mgfashions.com</p>
              <p><strong>Phone:</strong> +91 90000 00000</p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <form className="bg-white rounded-3xl border border-gray-200 shadow-sm p-7 sm:p-8 space-y-3">
            <h2 className="text-xl font-bold">Quick Message</h2>
            <input className="input" placeholder="Full name" />
            <input className="input" placeholder="Email" />
            <textarea className="input min-h-28" placeholder="Your message" />
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-cyan-700 transition">
              Send
            </button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}

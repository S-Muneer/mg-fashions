import ScrollReveal from "../components/ScrollReveal";

export default function GiftCards() {
  return (
    <section className="py-14 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="rounded-[2rem] bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 p-10 text-white shadow-2xl">
            <h1 className="text-4xl font-bold">Gift Cards & Vouchers</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/90">
              Give the gift of style. Choose a value, add a personal message, and send instantly.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { value: "Rs 999", desc: "Perfect for a treat or a small thank-you gift." },
            { value: "Rs 2499", desc: "Great for a wardrobe update or seasonal shopping spree." },
            { value: "Rs 4999", desc: "Ideal for premium outfits and special celebrations." },
          ].map((card) => (
            <ScrollReveal key={card.value} delay={60}>
              <div className="rounded-3xl border border-white/10 bg-white/90 p-6 shadow-xl backdrop-blur transition hover:-translate-y-2 hover:shadow-2xl">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Digital gift card</p>
                <h2 className="mt-4 text-3xl font-bold text-slate-900">{card.value}</h2>
                <p className="mt-3 text-sm text-slate-600">{card.desc}</p>
                <button className="mt-6 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                  Buy now
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

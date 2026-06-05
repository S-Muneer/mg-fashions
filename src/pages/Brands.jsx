import ScrollReveal from "../components/ScrollReveal";

export default function Brands() {
  return (
    <section className="py-14 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-cyan-700 to-teal-600 p-10 text-white shadow-2xl">
            <h1 className="text-4xl font-bold">Shop by Brand</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-100/90">
              Discover curated labels, trending designers, and premium collections for every wardrobe.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Signature Street", description: "Bold prints, modern silhouettes, and festival-ready looks." },
            { title: "Classic Elegance", description: "Timeless womenswear crafted for refined everyday style." },
            { title: "Urban Comfort", description: "Easy silhouettes and premium fabrics for a relaxed yet polished fit." },
          ].map((brand) => (
            <ScrollReveal key={brand.title} delay={60}>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl transition hover:-translate-y-2 hover:border-cyan-300">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-700">Featured brand</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-900">{brand.title}</h2>
                <p className="mt-3 text-sm text-slate-600">{brand.description}</p>
                <button className="mt-6 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                  Explore collection
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

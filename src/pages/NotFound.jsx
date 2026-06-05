import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-6 py-12">
      <div className="max-w-5xl w-full grid gap-10 lg:grid-cols-[1.8fr_1fr] items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full bg-cyan-500/10 px-4 py-2 text-cyan-300 text-sm font-semibold tracking-[0.18em] uppercase shadow-glow">
            Page not found
          </div>
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-slate-100 to-emerald-300">
              404
            </h1>
            <p className="max-w-xl text-slate-300 text-lg leading-relaxed sm:text-xl">
              Looks like this page wandered off the runway. Let’s take you back to the store where the latest styles are waiting.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 shadow-cyan"
            >
              Back to home
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-7 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-500 hover:text-white"
            >
              Browse products
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-500/10">
          <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative grid gap-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-6 shadow-xl ring-1 ring-white/5">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Search tips</p>
              <ul className="mt-4 space-y-3 text-slate-300 text-sm">
                <li>• Check the URL spelling</li>
                <li>• Visit the home page or explore collections</li>
                <li>• Discover trending picks in our catalog</li>
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-lg">
                <p className="text-2xl font-semibold text-white">Keep exploring</p>
                <p className="mt-2 text-sm text-slate-400">New arrivals and featured looks are one click away.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-cyan-500/10 p-5 shadow-lg">
                <p className="text-2xl font-semibold text-cyan-200">Stay on trend</p>
                <p className="mt-2 text-sm text-slate-200">Find your next statement piece from our curated collection.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

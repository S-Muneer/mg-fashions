import React from "react";

function Invoice() {
  return (
    <div className="space-y-8">
      <div className="inline-flex items-center gap-3 rounded-full bg-cyan-500/10 px-4 py-2 text-cyan-300 text-sm font-semibold tracking-[0.18em] uppercase shadow-glow">
        Invoices
      </div>
      <div className="space-y-4">
        <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-slate-100 to-emerald-300">
          Comming soon{" "}
        </h1>
      </div>
    </div>
  );
}

export default Invoice;

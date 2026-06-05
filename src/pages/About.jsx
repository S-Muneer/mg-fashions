import ScrollReveal from "../components/ScrollReveal";
import { CLOUDINARY_SHOWCASE } from "../constants/cloudinaryMedia";

export default function About() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        <ScrollReveal>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-7 sm:p-8">
            <h1 className="text-3xl font-bold mb-4">About MG Fashions</h1>
            <p className="text-gray-600 mb-4">
              MG Fashions is a Bangalore-based clothing brand focused on practical elegance and comfort-first style.
            </p>
            <p className="text-gray-600 mb-4">
              We curate ladies wear, kids collections and modern wardrobe essentials, inspired by top online commerce experiences.
            </p>
            <p className="text-gray-600">
              Our mission is to build a trusted digital storefront for quality, fair pricing, and strong customer care.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="rounded-3xl overflow-hidden border border-cyan-100 shadow-xl h-full min-h-[420px]">
            <img
              src={CLOUDINARY_SHOWCASE.about}
              alt="About MG Fashions"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

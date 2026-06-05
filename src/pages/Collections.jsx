import { Link } from "react-router-dom";
import ScrollReveal from "../components/ScrollReveal";
import { CLOUDINARY_SHOWCASE } from "../constants/cloudinaryMedia";

const collections = [
  {
    title: "Women Festive Edit",
    text: "Statement sets, embroidered silhouettes, and premium event-ready styling.",
    image: CLOUDINARY_SHOWCASE.collection1,
  },
  {
    title: "Kids Celebration Wear",
    text: "Comfortable fabrics with playful detailing for special days and outings.",
    image: CLOUDINARY_SHOWCASE.collection2,
  },
  {
    title: "Daily Smart Casual",
    text: "Practical, breathable and trend-forward everyday styles for work and travel.",
    image: CLOUDINARY_SHOWCASE.collection3,
  },
];

export default function Collections() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-700">Curated Picks</p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2">Shop by Collections</h1>
          <p className="text-gray-600 mt-3 max-w-2xl">
            Handpicked looks inspired by premium marketplace storefront experiences.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((item, idx) => (
            <ScrollReveal key={item.title} delay={idx * 120} className="h-full">
              <article className="h-full bg-white rounded-3xl border border-cyan-100 shadow-md overflow-hidden hover:shadow-xl transition">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-60 w-full object-cover"
                />
                <div className="p-5">
                  <h2 className="text-xl font-bold">{item.title}</h2>
                  <p className="text-gray-600 mt-2">{item.text}</p>
                  <Link
                    to="/products"
                    className="inline-block mt-4 text-cyan-700 font-semibold hover:underline"
                  >
                    Explore collection
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

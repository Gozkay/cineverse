import categoryData from "@/data/categoryData";
import CategoryCard from "./CategoryCard";

function Categories() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-4 text-center text-5xl font-black">
          Browse Categories
        </h2>

        <p className="mb-16 text-center text-gray-400">
          Everything you love in one marketplace.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {categoryData.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
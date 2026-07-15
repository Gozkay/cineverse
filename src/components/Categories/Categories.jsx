import categoryData from "@/data/categoryData";
import CategoryCard from "./CategoryCard";

function Categories() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Browse{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Categories
            </span>
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Everything you love in one beautiful marketplace.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categoryData.map((category, i) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;

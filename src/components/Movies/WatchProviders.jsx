import { IMAGE_BASE_URL } from "@/constants/tmdb";

function WatchProviders({ providers }) {
  const nigeria = providers?.NG || providers?.US;

  if (!nigeria?.flatrate?.length) return null;

  return (
    <section className="mt-20">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-black">
          Where to Watch
        </h2>

        <span className="text-slate-400">
          Available on
        </span>
      </div>

      <div className="flex flex-wrap gap-5">
        {nigeria.flatrate.map((provider) => (
          <div
            key={provider.provider_id}
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-slate-800
              bg-slate-900/50
              p-4
            "
          >
            <img
              src={`${IMAGE_BASE_URL}${provider.logo_path}`}
              alt={provider.provider_name}
              className="h-14 w-14 rounded-xl"
            />

            <span className="font-semibold">
              {provider.provider_name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WatchProviders;
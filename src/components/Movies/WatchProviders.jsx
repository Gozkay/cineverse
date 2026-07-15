import { IMAGE_BASE_URL } from "@/constants/tmdb";

function WatchProviders({ providers }) {
  const nigeria = providers?.NG || providers?.US;

  if (!nigeria?.flatrate?.length) return null;

  return (
    <section className="mt-20 border-t border-white/5 pt-12">
      <div className="mb-8">
        <h2 className="text-3xl font-black">
          <span className="text-white">Where to</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Watch</span>
        </h2>
        <p className="mt-1 text-sm text-slate-500">Available on</p>
      </div>

      <div className="flex flex-wrap gap-5">
        {nigeria.flatrate.map((provider) => (
          <div
            key={provider.provider_id}
            className="flex items-center gap-4 rounded-2xl ring-1 ring-white/5 bg-slate-900/40 p-4 transition-all duration-300 hover:ring-violet-500/40 hover:-translate-y-0.5"
          >
            <img
              src={`${IMAGE_BASE_URL}${provider.logo_path}`}
              alt={provider.provider_name}
              className="h-14 w-14 rounded-xl"
            />
            <span className="font-semibold text-white">{provider.provider_name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WatchProviders;

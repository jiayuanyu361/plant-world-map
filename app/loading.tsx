export default function Loading() {
  return (
    <div className="home-stage relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(180deg,#03060d,#07101d_42%,#050c17)] text-white">
      <div className="min-h-screen animate-pulse px-5 pt-5 md:px-8 md:pt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="h-10 w-56 rounded-full bg-white/8" />
          <div className="h-10 w-32 rounded-full bg-emerald-400/12" />
        </div>

        <div className="mt-16 max-w-xl space-y-4">
          <div className="h-12 w-full rounded-3xl bg-white/10" />
          <div className="h-5 w-3/4 rounded-2xl bg-white/8" />
          <div className="h-10 w-[420px] max-w-full rounded-full bg-white/8" />
        </div>

        <div className="mt-10 overflow-hidden rounded-[24px] border border-white/8 bg-[#050914]">
          <div className="min-h-[72vh] bg-[radial-gradient(circle_at_50%_38%,rgba(17,58,71,0.58),transparent_26%),linear-gradient(180deg,#040914,#07111e)]" />
        </div>
      </div>
    </div>
  );
}

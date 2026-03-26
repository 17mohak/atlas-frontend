export default function DashboardOverview() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-black tracking-tighter italic uppercase text-white">
                    System Overview
                </h1>
                <p className="text-slate-500 text-xs tracking-[0.3em] uppercase">
                    Neural-Link: Active // Atlas-Core: 100%
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 rounded-xl border border-border bg-card/50 backdrop-blur-md flex flex-col items-center justify-center border-dashed opacity-50">
                        <div className="text-[10px] tracking-widest text-slate-600 uppercase">Data Stream {i}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
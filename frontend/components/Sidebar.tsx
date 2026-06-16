export default function Sidebar() {
  return (
    <div className="hidden md:flex w-60 border-r border-zinc-900 bg-zinc-950 p-4">
      <div className="flex flex-col gap-4">
        <div className="text-lg font-semibold">Local AI</div>

        <div className="text-xs text-zinc-500">Phase 10C Cognitive System</div>

        <div className="mt-4 text-xs text-zinc-600 space-y-2">
          <p>✓ persistent memory</p>
          <p>✓ semantic recall</p>
          <p>✓ identity clustering</p>
          <p>✓ vector retrieval</p>
        </div>

        <div className="mt-6 text-[10px] text-zinc-700">
          system status: online
        </div>
      </div>
    </div>
  );
}

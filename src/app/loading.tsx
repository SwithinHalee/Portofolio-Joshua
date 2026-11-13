export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF] text-[#111111]" aria-busy="true" aria-label="Loading section">
      <div className="border-b border-[#EAEAEA]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-8">
          <span className="font-sans text-sm font-medium tracking-tight">Joshua Abdiel</span>
          <span className="font-mono text-xs text-[#525252]">RETRIEVING…</span>
        </div>
      </div>
      <div className="flex flex-1 items-center py-16">
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
          <div className="mb-3 h-3 w-48 rounded-[3px] bg-[#EFEFEF]" />
          <div className="mb-4 h-10 w-3/4 rounded-[6px] bg-[#EFEFEF]" />
          <div className="mb-8 h-4 w-1/2 rounded-[3px] bg-[#F4F4F2]" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="h-28 rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA]" />
            <div className="h-28 rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA]" />
            <div className="h-28 rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA]" />
          </div>
          <p className="mt-8 font-sans text-xs uppercase tracking-wider text-[#525252]">
            Retrieving dossier from the archive
          </p>
        </div>
      </div>
    </div>
  );
}

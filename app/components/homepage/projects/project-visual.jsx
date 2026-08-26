// @flow strict

export default function ProjectVisual({ visualKind, briefLabel, categoryLabel }) {
  return (
    <div
      aria-hidden="true"
      data-project-visual="case-study"
      data-project-visual-kind={visualKind}
      className="relative h-full min-h-48 overflow-hidden bg-[#08111F]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.22),transparent_29%),radial-gradient(circle_at_82%_80%,rgba(245,158,11,0.14),transparent_34%),linear-gradient(135deg,#08111F_0%,#0D1A2B_58%,#13243A_100%)]" />
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(148,163,184,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.11)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-[#22D3EE]/55" />
      <div className="absolute bottom-0 left-[18%] top-0 w-px bg-[#22D3EE]/55" />
      <div className="absolute bottom-[20%] left-[18%] right-[14%] h-px bg-[#F59E0B]/55" />
      <div className="absolute right-[14%] top-[20%] h-[60%] w-px bg-[#F59E0B]/55" />
      <span className="absolute left-[calc(18%-4px)] top-[calc(50%-4px)] h-2 w-2 rounded-[2px] border border-[#22D3EE] bg-[#08111F]" />
      <span className="absolute bottom-[calc(20%-4px)] right-[calc(14%-4px)] h-2 w-2 rounded-[2px] border border-[#F59E0B] bg-[#08111F]" />

      <div className="absolute inset-x-5 top-5 flex items-start font-mono text-[10px] uppercase tracking-[0.18em]">
        <span className="rounded-[2px] border border-[#22D3EE]/70 bg-[#08111F]/80 px-2 py-1 text-[#F3F7FB]/90">
          {briefLabel}
        </span>
      </div>

      <div className="absolute inset-x-5 bottom-5">
        <div className="mb-3 h-px w-12 bg-[#F59E0B]" />
        <p className="max-w-[18rem] font-mono text-sm font-medium tracking-[0.08em] text-[#F3F7FB]">
          {categoryLabel}
        </p>
      </div>
    </div>
  );
}

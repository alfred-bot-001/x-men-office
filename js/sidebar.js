// ============================================================
// Sidebar
// ============================================================
const NAV_ITEMS = [
  { hash:'/', label:'Agent 管理', icon:'🤖', badge:null },
  { hash:'/worklist', label:'工作列表', icon:'📋', badge:6 },
  { hash:'/casedetail', label:'Case 列表', icon:'📑', badge:null },
  { hash:'/dashboard', label:'工作量 Dashboard', icon:'📊', badge:null },
  { hash:'/skills', label:'Skill 管理', icon:'⚙️', badge:null },
];

function renderSidebar(activeHash) {
  const el = document.getElementById('sidebar');
  if (!el) return;
  el.innerHTML = `
  <div class="flex flex-col h-full">
    <!-- Logo -->
    <div class="px-5 py-5 border-b border-slate-700/50">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-bold text-white">X</div>
        <div>
          <div class="text-sm font-semibold text-white leading-tight">X-Men Office</div>
          <div class="text-xs text-slate-500">AI Agent 管理平台 v1.0</div>
        </div>
      </div>
    </div>
    <!-- Status indicator -->
    <div class="px-4 py-3 border-b border-slate-700/30">
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>6 Agents Online</span>
        <span class="ml-auto text-slate-600">|</span>
        <span class="ml-1 text-amber-400">Queue: 23</span>
      </div>
    </div>
    <!-- Nav -->
    <nav class="flex-1 p-3 space-y-1">
      ${NAV_ITEMS.map(item => `
      <a href="#${item.hash}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group no-underline
        ${activeHash===item.hash ? 'bg-blue-600/20 text-white border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-700/60'}">
        <span class="text-base">${item.icon}</span>
        <span class="flex-1">${item.label}</span>
        ${item.badge ? `<span class="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full">${item.badge}</span>` : ''}
      </a>`).join('')}
    </nav>
    <!-- Footer -->
    <div class="px-4 py-4 border-t border-slate-700/50">
      <div class="text-xs text-slate-600 text-center">X-Men Office</div>
      <div class="text-xs text-slate-700 text-center">Demo · 2026</div>
    </div>
  </div>`;
}

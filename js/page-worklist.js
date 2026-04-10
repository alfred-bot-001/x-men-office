// ============================================================
// Page: Work List
// ============================================================
function renderWorklistPage() {
  let agents = [...mockAgents];

  function statsBar() {
    const idle = agents.filter(a=>a.status==='idle').length;
    const busy = agents.filter(a=>a.status==='busy').length;
    const na   = agents.filter(a=>a.status==='needs-approval').length;
    return `
    <div class="flex items-center gap-3 p-4 border-b border-slate-700/50">
      <div class="flex items-center gap-6 text-sm flex-1">
        <span class="text-slate-400">全部 <span class="text-white font-semibold ml-1">${agents.length}</span></span>
        <span class="text-emerald-400">空闲 <span class="font-semibold ml-1">${idle}</span></span>
        <span class="text-amber-400">忙碌 <span class="font-semibold ml-1">${busy}</span></span>
        <span class="text-red-400">需审批 <span class="font-semibold ml-1">${na}</span></span>
        <span class="text-slate-400">队列积压 <span class="text-white font-semibold ml-1">23</span></span>
      </div>
      <button onclick="refreshStatus()" class="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300 transition-colors flex items-center gap-1.5">
        🔄 刷新状态
      </button>
    </div>`;
  }

  function cardGrid() {
    return `<div class="grid grid-cols-3 gap-4 p-5">` +
      agents.map(a => {
        const borderMap = { idle:'border-emerald-500/20 hover:border-emerald-500/40', busy:'border-amber-500/30 hover:border-amber-500/60', 'needs-approval':'border-red-500/40 hover:border-red-500/70' };
        const dotMap = { idle:'bg-emerald-400', busy:'bg-amber-400 animate-pulse', 'needs-approval':'bg-red-400 animate-pulse' };
        const labelMap = { idle:'空闲', busy:'忙碌', 'needs-approval':'需人工审批' };
        const labelColor = { idle:'text-emerald-400', busy:'text-amber-400', 'needs-approval':'text-red-400' };
        const clickable = a.currentCase ? `onclick="window.location.hash='/casedetail?case=${a.currentCase}'"` : '';
        return `
        <div ${clickable} class="bg-slate-800/60 rounded-xl border ${borderMap[a.status]} p-5 relative transition-all ${a.currentCase?'cursor-pointer hover:bg-slate-800':''}">
          <!-- Status dot top right -->
          <div class="absolute top-3.5 right-3.5 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full ${dotMap[a.status]}"></span>
            <span class="text-xs ${labelColor[a.status]}">${labelMap[a.status]}</span>
          </div>
          <!-- Avatar -->
          <div class="w-14 h-14 rounded-xl overflow-hidden mb-3">${avatarImg(a.avatar, 'w-14 h-14')}</div>
          <!-- Name + Level -->
          <div class="flex items-center gap-2 mb-1">
            <span class="text-sm font-semibold text-white">${a.name}</span>
          </div>
          <div class="mb-2">${levelBadge(a.level)}</div>
          <!-- Skills -->
          <div class="flex flex-wrap gap-1 mb-3">${a.skills.map(skillTag).join('')}</div>
          <div class="border-t border-slate-700/50 pt-3 flex items-center justify-between text-xs text-slate-500">
            <span>今日处理 <span class="text-white font-medium">${a.todayCases}</span> 案</span>
            <span class="font-mono text-slate-400">${a.currentCase || '—'}</span>
          </div>
        </div>`;
      }).join('') +
    `</div>`;
  }

  function render() {
    setContent(`
    <div class="flex flex-col h-full overflow-hidden">
      <div id="wl-stats">${statsBar()}</div>
      <div class="flex-1 overflow-y-auto" id="wl-grid">${cardGrid()}</div>
    </div>`);
  }

  render();

  window.refreshStatus = function() {
    const idle = agents.filter(a=>a.status==='idle');
    if (idle.length > 0) {
      const pick = idle[Math.floor(Math.random()*idle.length)];
      pick.status = 'busy';
      pick.currentCase = 'CASE-2026' + Math.floor(Math.random()*9000+1000);
    }
    document.getElementById('wl-stats').innerHTML = statsBar();
    document.getElementById('wl-grid').innerHTML = cardGrid();
    showToast('状态已刷新');
  };
}

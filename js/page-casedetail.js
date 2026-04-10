// ============================================================
// Page: Case List → Case Detail  (drill-down)
// ============================================================

/* ---------- Case List (entry point) ---------- */
function renderCaseDetailPage(directCaseId) {
  // if called with a specific case id from URL, go straight to detail
  if (directCaseId && directCaseId !== 'CASE-20260410-0892') {
    return renderCaseDetail(directCaseId);
  }
  renderCaseList();
}

function renderCaseList() {
  const cases = [...mockRecentCases];
  let filterType = 'all';  // 'all' | 'EDD' | 'FCI'

  function statusPill(c) {
    if (c.endTime && (c.currentStep === '已完成' || c.result === 'Auto-Closed' || c.result === 'Approved'))
      return `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-900/40 text-emerald-400">已完成</span>`;
    if (c.escalated)
      return `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-900/40 text-amber-400">已上报</span>`;
    if (!c.endTime)
      return `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-900/40 text-blue-400 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>进行中</span>`;
    return `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-700 text-gray-400">已结束</span>`;
  }

  function typeBadge(type) {
    if (type === 'EDD') return `<span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-900/40 text-blue-300">EDD</span>`;
    return `<span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-900/40 text-orange-300">FCI</span>`;
  }

  function ratingStars(n) {
    let h = '';
    for (let i = 1; i <= 5; i++) h += `<span class="${i <= n ? 'text-amber-400' : 'text-gray-700'} text-xs">★</span>`;
    return h;
  }

  function filtered() {
    return filterType === 'all' ? cases : cases.filter(c => c.type === filterType);
  }

  function statsHtml() {
    const all = cases.length;
    const edd = cases.filter(c => c.type === 'EDD').length;
    const fci = cases.filter(c => c.type === 'FCI').length;
    const running = cases.filter(c => !c.endTime).length;
    const done = cases.filter(c => c.endTime && (c.currentStep === '已完成' || c.result === 'Approved' || c.result === 'Auto-Closed')).length;
    const esc = cases.filter(c => c.escalated).length;
    return `
    <div class="flex items-center gap-4 px-5 py-3 border-b border-gray-700/50">
      <span class="text-xs text-gray-500">总计 <span class="text-white font-semibold">${all}</span></span>
      <span class="text-xs text-blue-400">EDD <span class="font-semibold">${edd}</span></span>
      <span class="text-xs text-orange-400">FCI <span class="font-semibold">${fci}</span></span>
      <div class="w-px h-4 bg-gray-700"></div>
      <span class="text-xs text-blue-400">进行中 <span class="font-semibold">${running}</span></span>
      <span class="text-xs text-emerald-400">已完成 <span class="font-semibold">${done}</span></span>
      <span class="text-xs text-amber-400">已上报 <span class="font-semibold">${esc}</span></span>
    </div>`;
  }

  function tableHtml() {
    const rows = filtered();
    let h = `<table class="w-full">`;
    h += `<thead><tr class="text-[11px] text-gray-500 border-b border-gray-700/50">
      <th class="text-left px-4 py-2.5 font-medium">Case ID</th>
      <th class="text-left px-4 py-2.5 font-medium">类型</th>
      <th class="text-left px-4 py-2.5 font-medium">Owner</th>
      <th class="text-left px-4 py-2.5 font-medium">当前状态</th>
      <th class="text-left px-4 py-2.5 font-medium">当前步骤</th>
      <th class="text-left px-4 py-2.5 font-medium">开始时间</th>
      <th class="text-left px-4 py-2.5 font-medium">结束时间</th>
      <th class="text-left px-4 py-2.5 font-medium">结果</th>
      <th class="text-left px-4 py-2.5 font-medium">评分</th>
      <th class="text-center px-4 py-2.5 font-medium">操作</th>
    </tr></thead><tbody>`;
    rows.forEach(c => {
      const agent = mockAgents.find(a => a.name === c.agent);
      h += `<tr class="border-b border-gray-800/60 hover:bg-gray-800/40 transition-colors">`;
      h += `<td class="px-4 py-3"><span class="text-xs font-mono text-blue-300">${c.id}</span></td>`;
      h += `<td class="px-4 py-3">${typeBadge(c.type)}</td>`;
      h += `<td class="px-4 py-3"><div class="flex items-center gap-1.5">${agent ? avatarImg(agent.avatar, 'w-5 h-5') : ''}<span class="text-xs text-white">${c.agent}</span></div></td>`;
      h += `<td class="px-4 py-3">${statusPill(c)}</td>`;
      h += `<td class="px-4 py-3"><span class="text-xs text-gray-300">${c.currentStep}</span></td>`;
      h += `<td class="px-4 py-3"><span class="text-[11px] text-gray-400">${c.startTime}</span></td>`;
      h += `<td class="px-4 py-3"><span class="text-[11px] text-gray-400">${c.endTime || '<span class="text-blue-400">—</span>'}</span></td>`;
      h += `<td class="px-4 py-3"><span class="text-xs text-gray-300">${c.result}</span></td>`;
      h += `<td class="px-4 py-3"><div class="flex">${ratingStars(c.rating)}</div></td>`;
      h += `<td class="px-4 py-3 text-center"><button onclick="openCaseDetail('${c.id}')" class="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 transition-colors">详情 →</button></td>`;
      h += `</tr>`;
    });
    h += `</tbody></table>`;
    return h;
  }

  function render() {
    setContent(`
    <div class="flex flex-col h-full overflow-hidden">
      ${statsHtml()}
      <div class="flex items-center gap-2 px-5 py-3 border-b border-gray-700/50">
        <span class="text-xs text-gray-500 mr-1">筛选:</span>
        <button onclick="filterCases('all')" class="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${filterType==='all'?'bg-gray-600 text-white':'bg-gray-800 text-gray-400 hover:bg-gray-700'}">全部</button>
        <button onclick="filterCases('EDD')" class="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${filterType==='EDD'?'bg-blue-600/30 text-blue-300':'bg-gray-800 text-gray-400 hover:bg-gray-700'}">EDD</button>
        <button onclick="filterCases('FCI')" class="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${filterType==='FCI'?'bg-orange-600/30 text-orange-300':'bg-gray-800 text-gray-400 hover:bg-gray-700'}">FCI</button>
      </div>
      <div class="flex-1 overflow-y-auto" id="case-table">${tableHtml()}</div>
    </div>`);
  }

  render();

  window.filterCases = function(type) {
    filterType = type;
    render();
  };

  window.openCaseDetail = function(id) {
    renderCaseDetail(id);
  };
}


/* ---------- Case Detail (drill-down) ---------- */
function renderCaseDetail(caseId) {
  const activeCaseId = caseId;
  let step4Shown = false;
  let ratings = 0;
  let ratingSubmitted = false;
  let stepVerdicts = {};

  const eddAgent = mockAgents.find(a => a.name === 'Namescreen-Agent-002') || mockAgents[0];
  const fciAgent = mockAgents.find(a => a.name === 'FCI-Agent-002') || mockAgents[1];

  const cases = {
    'EDD-20260410-0892': {
      agent: eddAgent, skill: 'EDD-SOF&SOW-Skill', startTime: '2026-04-10 09:42 UTC',
      steps: [
        { icon:'✅', label:'触发识别', color:'text-emerald-400', done:true,
          items:['自动检测：高风险评级客户','触发条件：SOF金额超过阈值','$500K crypto deposit 入账记录'] },
        { icon:'✅', label:'KYC 身份核验', color:'text-emerald-400', done:true,
          items:['PEP筛查：未命中 ✓','Adverse Media：未发现 ✓','身份验证：通过 ✓'] },
        { icon:'🔄', label:'SOF/SOW 文件收集', color:'text-blue-400', done:false, spinning:true,
          items:['已收到银行对账单 ✓','<span class="text-amber-300">⚠️ 加密货币SOF文件缺失</span>'] },
        { icon:'⏳', label:'OSINT 核查', color:'text-gray-500', done:false, pending:true, items:['等待上一步完成…'] },
        { icon:'⏳', label:'综合判断 & 上报路由', color:'text-gray-500', done:false, pending:true, items:['等待上一步完成…'] },
      ],
      step4Result: { icon:'✅', label:'OSINT 核查', color:'text-emerald-400',
        items:['OSINT 姓名搜索：无负面发现 ✓','OSINT 雇主核查：公司注册在案，状态活跃 ✓','LinkedIn 职业背景：一致 ✓','无制裁名单命中 ✓'] },
      warningText:'加密货币SOF文件缺失，需向客户发送RFI请求补充材料',
      actions:[ { label:'📩 发送 RFI', cls:'bg-blue-600 hover:bg-blue-500', fn:'sendRFI' }, { label:'⬆️ 升级至 L2', cls:'bg-amber-600 hover:bg-amber-500', fn:'escalateCase' } ],
      continueBtn: true,
    },
    'FCI-20260410-1034': {
      agent: fciAgent, skill: 'FCI-Full-Review-Skill', startTime: '2026-04-10 08:15 UTC',
      steps: [
        { icon:'✅', label:'Phase 1: Pre-Check 自动预检', color:'text-emerald-400', done:true,
          items:['180天内无相似案件','ML评分偏差 > 3%','新增 2 个风险因素','<span class="text-amber-300">→ 不符合自动关闭条件</span>'] },
        { icon:'✅', label:'Phase 2: Initial Investigation', color:'text-emerald-400', done:true,
          items:['Factor 1 ✅ Agree：异常大额转账','Factor 2 ❌ Disagree：低风险地区','Factor 3 ✅ Agree：新增高风险钱包交互','<span class="text-amber-300">→ 存在 Agree 项，必须进入 Phase 3</span>'] },
        { icon:'🔄', label:'Phase 3: Full Review', color:'text-blue-400', done:false, spinning:true,
          items:['KYC核查 ✅','交易模式分析 ✅','<span class="text-blue-300">🔄 On-chain暴露分析（进行中）</span>','<span class="text-gray-500">⏳ OSINT待执行</span>','<span class="text-gray-500">⏳ RFI历史回顾待执行</span>'] },
      ],
      step4Result: null,
      warningText:'On-chain暴露超过阈值，建议提交SAR/STR',
      actions:[ { label:'📋 生成审查报告', cls:'bg-blue-600 hover:bg-blue-500', fn:'genReport' }, { label:'🚨 提交 STR', cls:'bg-red-600 hover:bg-red-500', fn:'submitSTR' } ],
      fciDetail: true, continueBtn: false,
    },
  };

  const c = cases[activeCaseId];
  // for cases without detail data, show a placeholder
  if (!c) {
    const rc = mockRecentCases.find(x => x.id === activeCaseId);
    setContent(`
    <div class="flex flex-col h-full overflow-hidden">
      <div class="flex items-center gap-3 px-5 h-12 border-b border-gray-700/50">
        <button onclick="renderCaseList()" class="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">← 返回列表</button>
        <span class="text-xs text-gray-600">|</span>
        <span class="text-sm font-mono text-white">${activeCaseId}</span>
      </div>
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="text-4xl mb-3">📄</div>
          <div class="text-sm text-gray-400 mb-1">Case ${activeCaseId}</div>
          <div class="text-xs text-gray-500 mb-1">结果: ${rc ? rc.result : '—'} · Agent: ${rc ? rc.agent : '—'}</div>
          <div class="text-xs text-gray-600">详细思维链数据暂未接入（仅 EDD-0892 和 FCI-1034 有完整演示数据）</div>
        </div>
      </div>
    </div>`);
    return;
  }

  // ---- step chain ----
  function chainHtml(showOSINT) {
    const steps = [...c.steps];
    if (showOSINT && c.step4Result && activeCaseId === 'EDD-20260410-0892') { steps[3] = { ...c.step4Result, done:true }; }
    let h = '';
    steps.forEach((s, i) => {
      const last = i === steps.length - 1;
      const opacity = s.pending && !showOSINT ? 'opacity-40' : '';
      const vKey = activeCaseId + '_' + i;
      const verdict = stepVerdicts[vKey];
      h += `<div class="flex gap-3 ${opacity}">`;
      h += `<div class="flex flex-col items-center">`;
      h += `<div class="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 ${s.done ? 'bg-emerald-900/60' : s.spinning ? 'bg-blue-900/60' : 'bg-gray-700/60'}">`;
      h += s.spinning ? `<span class="inline-block animate-spin">${s.icon}</span>` : s.icon;
      h += `</div>`;
      if (!last) h += `<div class="w-0.5 flex-1 ${s.done ? 'bg-emerald-700' : 'bg-gray-700'} my-1"></div>`;
      h += `</div>`;
      h += `<div class="flex-1 ${last ? '' : 'pb-5'}">`;
      h += `<div class="flex items-center gap-2">`;
      h += `<span class="text-sm font-semibold ${s.color}">${s.label}</span>`;
      if (s.done || s.spinning) {
        h += `<div class="flex items-center gap-1 ml-auto">`;
        if (verdict === 'correct') {
          h += `<span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-400 text-[10px] font-medium">✓ 正确</span>`;
          h += `<button onclick="reviewStep('${vKey}',null)" class="text-[10px] text-gray-500 hover:text-gray-300">撤回</button>`;
        } else if (verdict === 'incorrect') {
          h += `<span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-900/50 text-red-400 text-[10px] font-medium">✗ 错误</span>`;
          h += `<button onclick="reviewStep('${vKey}',null)" class="text-[10px] text-gray-500 hover:text-gray-300">撤回</button>`;
        } else {
          h += `<button onclick="reviewStep('${vKey}','correct')" class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/60 transition-colors" title="Agent判断正确">✓</button>`;
          h += `<button onclick="reviewStep('${vKey}','incorrect')" class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-900/30 text-red-400 hover:bg-red-900/60 transition-colors" title="Agent判断错误">✗</button>`;
        }
        h += `</div>`;
      }
      h += `</div>`;
      h += `<ul class="mt-1 space-y-0.5">`;
      s.items.forEach(it => { h += `<li class="text-xs text-gray-400 flex gap-1.5"><span class="text-gray-600 mt-0.5">•</span><span>${it}</span></li>`; });
      h += `</ul></div></div>`;
    });
    return h;
  }

  // ---- right panel ----
  function rightHtml() {
    const ag = c.agent;
    let h = `<div class="h-full overflow-y-auto p-5 space-y-4">`;
    h += `<div class="bg-gray-800 rounded-xl p-4 space-y-2 border border-gray-700/60">`;
    h += `<div class="flex items-center justify-between"><span class="text-xs text-gray-500">Case ID</span><span class="text-xs font-mono text-blue-300">${activeCaseId}</span></div>`;
    h += `<div class="flex items-center justify-between"><span class="text-xs text-gray-500">Agent</span><div class="flex items-center gap-2">${avatarImg(ag.avatar,'w-5 h-5')}<span class="text-xs text-white">${ag.name}</span></div></div>`;
    h += `<div class="flex items-center justify-between"><span class="text-xs text-gray-500">Skill</span><span class="text-xs text-indigo-300">${c.skill}</span></div>`;
    h += `<div class="flex items-center justify-between"><span class="text-xs text-gray-500">Duration</span><span class="text-xs text-white">since ${c.startTime}</span></div>`;
    h += `</div>`;
    if (c.fciDetail) {
      h += `<div class="bg-gray-800 rounded-xl p-4 border border-gray-700/60">`;
      h += `<div class="text-xs font-semibold text-blue-300 mb-2">🔍 On-chain Analysis — 当前子步骤</div>`;
      h += `<div class="bg-gray-700 rounded-lg p-3 space-y-1 text-xs text-gray-300">`;
      h += `<div>Elliptic 风险评分：<span class="text-amber-300 font-semibold">7.2 / 10</span></div>`;
      h += `<div>检测到与高风险钱包的 <span class="text-red-400 font-semibold">2 跳交互</span></div>`;
      h += `</div></div>`;
    }
    h += `<div class="rounded-xl p-4 border ${c.fciDetail ? 'bg-red-900/20 border-red-500/30' : 'bg-amber-900/20 border-amber-500/30'}">`;
    h += `<div class="text-xs font-semibold ${c.fciDetail ? 'text-red-400' : 'text-amber-400'} mb-1">⚠️ 当前步骤提示</div>`;
    h += `<div class="text-xs text-gray-300 mb-3">${c.warningText}</div>`;
    h += `<div class="flex gap-2">`;
    c.actions.forEach(a => { h += `<button onclick="${a.fn}()" class="flex-1 py-1.5 rounded-lg text-xs font-medium text-white transition-colors ${a.cls}">${a.label}</button>`; });
    h += `</div></div>`;
    h += `<div class="bg-gray-800 rounded-xl p-4 border border-gray-700/60">`;
    h += `<div class="text-xs font-semibold text-gray-300 mb-3">⭐ Agent 工作评分</div>`;
    h += `<div id="rating-area">${ratingHtml()}</div></div>`;
    h += accuracySummaryHtml();
    h += `</div>`;
    return h;
  }

  function ratingHtml() {
    if (ratingSubmitted) return `<div class="text-center text-sm text-emerald-400 py-2">评分已提交 ✓</div>`;
    let h = `<div class="flex justify-center gap-1 mb-3">`;
    for (let i = 1; i <= 5; i++) h += `<button onclick="setRating(${i})" class="text-2xl transition-transform hover:scale-125 ${i <= ratings ? 'text-amber-400' : 'text-gray-600'}">★</button>`;
    h += `</div><button onclick="submitRating()" class="w-full py-2 rounded-lg text-xs font-medium bg-gray-700 hover:bg-gray-600 text-white transition-colors">提交评分</button>`;
    return h;
  }

  function accuracySummaryHtml() {
    const entries = Object.entries(stepVerdicts).filter(([k]) => k.startsWith(activeCaseId));
    if (entries.length === 0) return '';
    const correct = entries.filter(([,v]) => v === 'correct').length;
    const incorrect = entries.filter(([,v]) => v === 'incorrect').length;
    const total = correct + incorrect;
    const pct = total > 0 ? Math.round(correct / total * 100) : 0;
    const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
    let h = `<div class="bg-gray-800 rounded-xl p-4 border border-gray-700/60">`;
    h += `<div class="text-xs font-semibold text-gray-300 mb-3">📊 步骤准确度审核</div>`;
    h += `<div class="flex items-center gap-3 mb-2">`;
    h += `<span class="text-2xl font-bold ${pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'}">${pct}%</span>`;
    h += `<div class="flex-1"><div class="text-[10px] text-gray-500 mb-1">已审核 ${total} / ${c.steps.length} 步</div>`;
    h += `<div class="w-full bg-gray-700 rounded-full h-1.5"><div class="${barColor} h-1.5 rounded-full transition-all" style="width:${pct}%"></div></div></div></div>`;
    h += `<div class="flex gap-3 text-[11px]"><span class="text-emerald-400">✓ 正确 ${correct}</span><span class="text-red-400">✗ 错误 ${incorrect}</span></div></div>`;
    return h;
  }

  // ---- render ----
  setContent(`
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex items-center gap-3 px-5 h-12 border-b border-gray-700/50 flex-shrink-0">
      <button onclick="renderCaseList()" class="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">← 返回列表</button>
      <span class="text-xs text-gray-600">|</span>
      <span class="text-sm font-mono text-white">${activeCaseId}</span>
      <span class="text-xs text-gray-500">${c.agent.name} · ${c.skill}</span>
    </div>
    <div class="flex flex-1 overflow-hidden">
      <div class="flex-1 overflow-y-auto p-5 border-r border-gray-700/50 flex flex-col">
        <div class="text-xs font-semibold text-gray-400 mb-4 flex items-center gap-2"><span class="w-1 h-4 bg-blue-500 rounded"></span>Agent 推理链 / 思维过程</div>
        <div id="chain-content">${chainHtml(step4Shown)}</div>
        ${c.continueBtn && !step4Shown ? `<div class="mt-auto pt-4"><button id="continue-btn" onclick="continueChain()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">▶️ 继续执行</button></div>` : ''}
      </div>
      <div class="w-80 flex-shrink-0" id="right-panel">${rightHtml()}</div>
    </div>
  </div>`);

  // ---- event handlers ----
  window.continueChain = function() {
    const btn = document.getElementById('continue-btn');
    if (btn) { btn.textContent = '⏳ 执行中…'; btn.disabled = true; btn.classList.add('opacity-60'); }
    setTimeout(() => {
      step4Shown = true;
      document.getElementById('chain-content').innerHTML = chainHtml(true);
      if (btn) btn.remove();
      showToast('Step 4 OSINT 核查完成 ✔');
    }, 1500);
  };

  window.sendRFI = function() { showToast('📩 RFI 已发送至客户邮件系统'); };
  window.escalateCase = function() { showToast('⬆️ 已升级至 L2 审批队列', 'warning'); };
  window.genReport = function() { showToast('📋 审查报告已生成'); };
  window.submitSTR = function() { showToast('🚨 STR 已提交至合规团队', 'warning'); };

  window.setRating = function(n) { ratings = n; document.getElementById('rating-area').innerHTML = ratingHtml(); };
  window.submitRating = function() {
    if (!ratings) { showToast('请先选择星级评分', 'warning'); return; }
    ratingSubmitted = true;
    document.getElementById('rating-area').innerHTML = ratingHtml();
    showToast(`已提交 ${ratings} 星评分 ⭐`);
  };

  window.reviewStep = function(key, verdict) {
    if (verdict === null) { delete stepVerdicts[key]; } else { stepVerdicts[key] = verdict; }
    document.getElementById('chain-content').innerHTML = chainHtml(step4Shown);
    document.getElementById('right-panel').innerHTML = rightHtml();
  };
}

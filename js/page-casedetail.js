// ============================================================
// Page: Case Detail  (EDD L1 + FCI ML Review)
// ============================================================
function renderCaseDetailPage(caseId) {
  const activeCaseId = caseId || 'EDD-20260410-0892';
  let step4Shown = false;
  let ratings = 0;
  let ratingSubmitted = false;

  // ---- lookup agents from global mockAgents ----
  const eddAgent = mockAgents.find(a => a.name === 'Namescreen-Agent-002') || mockAgents[0];
  const fciAgent = mockAgents.find(a => a.name === 'FCI-Agent-002') || mockAgents[1];

  // ---- two demo cases ----
  const cases = {
    'EDD-20260410-0892': {
      agent: eddAgent, skill: 'EDD-SOF&SOW-Skill', startTime: '2026-04-10 09:42 UTC',
      steps: [
        { icon:'\u2705', label:'\u89E6\u53D1\u8BC6\u522B', color:'text-emerald-400', done:true,
          items:['\u81EA\u52A8\u68C0\u6D4B\uFF1A\u9AD8\u98CE\u9669\u8BC4\u7EA7\u5BA2\u6237','\u89E6\u53D1\u6761\u4EF6\uFF1ASOF\u91D1\u989D\u8D85\u8FC7\u9608\u503C','$500K crypto deposit \u5165\u8D26\u8BB0\u5F55'] },
        { icon:'\u2705', label:'KYC \u8EAB\u4EFD\u6838\u9A8C', color:'text-emerald-400', done:true,
          items:['PEP\u7B5B\u67E5\uFF1A\u672A\u547D\u4E2D \u2713','Adverse Media\uFF1A\u672A\u53D1\u73B0 \u2713','\u8EAB\u4EFD\u9A8C\u8BC1\uFF1A\u901A\u8FC7 \u2713'] },
        { icon:'\uD83D\uDD04', label:'SOF/SOW \u6587\u4EF6\u6536\u96C6', color:'text-blue-400', done:false, spinning:true,
          items:['\u5DF2\u6536\u5230\u94F6\u884C\u5BF9\u8D26\u5355 \u2713','<span class="text-amber-300">\u26A0\uFE0F \u52A0\u5BC6\u8D27\u5E01SOF\u6587\u4EF6\u7F3A\u5931</span>'] },
        { icon:'\u23F3', label:'OSINT \u6838\u67E5', color:'text-gray-500', done:false, pending:true, items:['\u7B49\u5F85\u4E0A\u4E00\u6B65\u5B8C\u6210\u2026'] },
        { icon:'\u23F3', label:'\u7EFC\u5408\u5224\u65AD & \u4E0A\u62A5\u8DEF\u7531', color:'text-gray-500', done:false, pending:true, items:['\u7B49\u5F85\u4E0A\u4E00\u6B65\u5B8C\u6210\u2026'] },
      ],
      step4Result: {
        icon:'\u2705', label:'OSINT \u6838\u67E5', color:'text-emerald-400',
        items:['OSINT \u59D3\u540D\u641C\u7D22\uFF1A\u65E0\u8D1F\u9762\u53D1\u73B0 \u2713','OSINT \u96C7\u4E3B\u6838\u67E5\uFF1A\u516C\u53F8\u6CE8\u518C\u5728\u6848\uFF0C\u72B6\u6001\u6D3B\u8DC3 \u2713','LinkedIn \u804C\u4E1A\u80CC\u666F\uFF1A\u4E00\u81F4 \u2713','\u65E0\u5236\u88C1\u540D\u5355\u547D\u4E2D \u2713']
      },
      warningText:'\u52A0\u5BC6\u8D27\u5E01SOF\u6587\u4EF6\u7F3A\u5931\uFF0C\u9700\u5411\u5BA2\u6237\u53D1\u9001RFI\u8BF7\u6C42\u8865\u5145\u6750\u6599',
      actions:[
        { label:'\uD83D\uDCE9 \u53D1\u9001 RFI', cls:'bg-blue-600 hover:bg-blue-500', fn:'sendRFI' },
        { label:'\u2B06\uFE0F \u5347\u7EA7\u81F3 L2', cls:'bg-amber-600 hover:bg-amber-500', fn:'escalateCase' },
      ],
      continueBtn: true,
    },
    'FCI-20260410-1034': {
      agent: fciAgent, skill: 'FCI-Full-Review-Skill', startTime: '2026-04-10 08:15 UTC',
      steps: [
        { icon:'\u2705', label:'Phase 1: Pre-Check \u81EA\u52A8\u9884\u68C0', color:'text-emerald-400', done:true,
          items:['180\u5929\u5185\u65E0\u76F8\u4F3C\u6848\u4EF6','ML\u8BC4\u5206\u504F\u5DEE > 3%','\u65B0\u589E 2 \u4E2A\u98CE\u9669\u56E0\u7D20','<span class="text-amber-300">\u2192 \u4E0D\u7B26\u5408\u81EA\u52A8\u5173\u95ED\u6761\u4EF6</span>'] },
        { icon:'\u2705', label:'Phase 2: Initial Investigation', color:'text-emerald-400', done:true,
          items:['Factor 1 \u2705 Agree\uFF1A\u5F02\u5E38\u5927\u989D\u8F6C\u8D26','Factor 2 \u274C Disagree\uFF1A\u4F4E\u98CE\u9669\u5730\u533A','Factor 3 \u2705 Agree\uFF1A\u65B0\u589E\u9AD8\u98CE\u9669\u94B1\u5305\u4EA4\u4E92','<span class="text-amber-300">\u2192 \u5B58\u5728 Agree \u9879\uFF0C\u5FC5\u987B\u8FDB\u5165 Phase 3</span>'] },
        { icon:'\uD83D\uDD04', label:'Phase 3: Full Review', color:'text-blue-400', done:false, spinning:true,
          items:['KYC\u6838\u67E5 \u2705','\u4EA4\u6613\u6A21\u5F0F\u5206\u6790 \u2705','<span class="text-blue-300">\uD83D\uDD04 On-chain\u66B4\u9732\u5206\u6790\uFF08\u8FDB\u884C\u4E2D\uFF09</span>','<span class="text-gray-500">\u23F3 OSINT\u5F85\u6267\u884C</span>','<span class="text-gray-500">\u23F3 RFI\u5386\u53F2\u56DE\u987E\u5F85\u6267\u884C</span>'] },
      ],
      step4Result: null,
      warningText:'On-chain\u66B4\u9732\u8D85\u8FC7\u9608\u503C\uFF0C\u5EFA\u8BAE\u63D0\u4EA4SAR/STR',
      actions:[
        { label:'\uD83D\uDCCB \u751F\u6210\u5BA1\u67E5\u62A5\u544A', cls:'bg-blue-600 hover:bg-blue-500', fn:'genReport' },
        { label:'\uD83D\uDEA8 \u63D0\u4EA4 STR', cls:'bg-red-600 hover:bg-red-500', fn:'submitSTR' },
      ],
      fciDetail: true,
      continueBtn: false,
    },
  };

  const c = cases[activeCaseId] || cases['EDD-20260410-0892'];

  // ---- step chain (left panel) ----
  function chainHtml(showOSINT) {
    const steps = [...c.steps];
    // For EDD case: when continue is clicked, reveal step 4 as completed
    if (showOSINT && c.step4Result && activeCaseId === 'EDD-20260410-0892') {
      steps[3] = { ...c.step4Result, done:true };
    }
    let h = '';
    steps.forEach((s, i) => {
      const last = i === steps.length - 1;
      const opacity = s.pending && !showOSINT ? 'opacity-40' : '';
      h += `<div class="flex gap-3 ${opacity}">`;
      // icon column with connector line
      h += `<div class="flex flex-col items-center">`;
      h += `<div class="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 ${s.done ? 'bg-emerald-900/60' : s.spinning ? 'bg-blue-900/60' : 'bg-gray-700/60'}">`;
      h += s.spinning ? `<span class="inline-block animate-spin">${s.icon}</span>` : s.icon;
      h += `</div>`;
      if (!last) h += `<div class="w-0.5 flex-1 ${s.done ? 'bg-emerald-700' : 'bg-gray-700'} my-1"></div>`;
      h += `</div>`;
      // content
      h += `<div class="flex-1 ${last ? '' : 'pb-5'}">`;
      h += `<div class="text-sm font-semibold ${s.color}">${s.label}</div>`;
      h += `<ul class="mt-1 space-y-0.5">`;
      s.items.forEach(it => { h += `<li class="text-xs text-gray-400 flex gap-1.5"><span class="text-gray-600 mt-0.5">\u2022</span><span>${it}</span></li>`; });
      h += `</ul></div></div>`;
    });
    return h;
  }

  // ---- right panel ----
  function rightHtml() {
    const ag = c.agent;
    let h = `<div class="h-full overflow-y-auto p-5 space-y-4">`;
    // case info box
    h += `<div class="bg-gray-800 rounded-xl p-4 space-y-2 border border-gray-700/60">`;
    h += `<div class="flex items-center justify-between"><span class="text-xs text-gray-500">Case ID</span><span class="text-xs font-mono text-blue-300">${activeCaseId}</span></div>`;
    h += `<div class="flex items-center justify-between"><span class="text-xs text-gray-500">Agent</span><div class="flex items-center gap-2">${avatarImg(ag.avatar,'w-5 h-5')}<span class="text-xs text-white">${ag.name}</span></div></div>`;
    h += `<div class="flex items-center justify-between"><span class="text-xs text-gray-500">Skill</span><span class="text-xs text-indigo-300">${c.skill}</span></div>`;
    h += `<div class="flex items-center justify-between"><span class="text-xs text-gray-500">Duration</span><span class="text-xs text-white">since ${c.startTime}</span></div>`;
    h += `</div>`;

    // current step detail
    if (c.fciDetail) {
      h += `<div class="bg-gray-800 rounded-xl p-4 border border-gray-700/60">`;
      h += `<div class="text-xs font-semibold text-blue-300 mb-2">\uD83D\uDD0D On-chain Analysis \u2014 \u5F53\u524D\u5B50\u6B65\u9AA4</div>`;
      h += `<div class="bg-gray-700 rounded-lg p-3 space-y-1 text-xs text-gray-300">`;
      h += `<div>Elliptic \u98CE\u9669\u8BC4\u5206\uFF1A<span class="text-amber-300 font-semibold">7.2 / 10</span></div>`;
      h += `<div>\u68C0\u6D4B\u5230\u4E0E\u9AD8\u98CE\u9669\u94B1\u5305\u7684 <span class="text-red-400 font-semibold">2 \u8DF3\u4EA4\u4E92</span></div>`;
      h += `</div></div>`;
    }

    // warning box
    h += `<div class="rounded-xl p-4 border ${c.fciDetail ? 'bg-red-900/20 border-red-500/30' : 'bg-amber-900/20 border-amber-500/30'}">`;
    h += `<div class="text-xs font-semibold ${c.fciDetail ? 'text-red-400' : 'text-amber-400'} mb-1">\u26A0\uFE0F \u5F53\u524D\u6B65\u9AA4\u63D0\u793A</div>`;
    h += `<div class="text-xs text-gray-300 mb-3">${c.warningText}</div>`;
    h += `<div class="flex gap-2">`;
    c.actions.forEach(a => {
      h += `<button onclick="${a.fn}()" class="flex-1 py-1.5 rounded-lg text-xs font-medium text-white transition-colors ${a.cls}">${a.label}</button>`;
    });
    h += `</div></div>`;

    // rating
    h += `<div class="bg-gray-800 rounded-xl p-4 border border-gray-700/60">`;
    h += `<div class="text-xs font-semibold text-gray-300 mb-3">\u2B50 Agent \u5DE5\u4F5C\u8BC4\u5206</div>`;
    h += `<div id="rating-area">${ratingHtml()}</div></div>`;
    h += `</div>`;
    return h;
  }

  function ratingHtml() {
    if (ratingSubmitted) return `<div class="text-center text-sm text-emerald-400 py-2">\u8BC4\u5206\u5DF2\u63D0\u4EA4 \u2713</div>`;
    let h = `<div class="flex justify-center gap-1 mb-3">`;
    for (let i = 1; i <= 5; i++) h += `<button onclick="setRating(${i})" class="text-2xl transition-transform hover:scale-125 ${i <= ratings ? 'text-amber-400' : 'text-gray-600'}">\u2605</button>`;
    h += `</div><button onclick="submitRating()" class="w-full py-2 rounded-lg text-xs font-medium bg-gray-700 hover:bg-gray-600 text-white transition-colors">\u63D0\u4EA4\u8BC4\u5206</button>`;
    return h;
  }

  // ---- render full page ----
  setContent(`
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex-shrink-0 border-b border-gray-700/50 px-5 flex items-center gap-2 h-12">
      <span class="text-xs text-gray-500 mr-2">\u5F53\u524D Case:</span>
      <button onclick="switchCase('EDD-20260410-0892')" class="px-3 py-1 rounded-full text-xs font-mono transition-all ${activeCaseId==='EDD-20260410-0892'?'bg-blue-600 text-white':'bg-gray-700 text-gray-400 hover:bg-gray-600'}">EDD-0892</button>
      <button onclick="switchCase('FCI-20260410-1034')" class="px-3 py-1 rounded-full text-xs font-mono transition-all ${activeCaseId==='FCI-20260410-1034'?'bg-red-600 text-white':'bg-gray-700 text-gray-400 hover:bg-gray-600'}">FCI-1034</button>
    </div>
    <div class="flex flex-1 overflow-hidden">
      <div class="flex-1 overflow-y-auto p-5 border-r border-gray-700/50 flex flex-col">
        <div class="text-xs font-semibold text-gray-400 mb-4 flex items-center gap-2"><span class="w-1 h-4 bg-blue-500 rounded"></span>Agent \u63A8\u7406\u94FE</div>
        <div id="chain-content">${chainHtml(step4Shown)}</div>
        ${c.continueBtn && !step4Shown ? `<div class="mt-auto pt-4"><button id="continue-btn" onclick="continueChain()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">\u25B6\uFE0F \u7EE7\u7EED\u6267\u884C</button></div>` : ''}
      </div>
      <div class="w-80 flex-shrink-0" id="right-panel">${rightHtml()}</div>
    </div>
  </div>`);

  // ---- event handlers ----
  window.switchCase = function(id) { step4Shown = false; ratings = 0; ratingSubmitted = false; renderCaseDetailPage(id); };

  window.continueChain = function() {
    const btn = document.getElementById('continue-btn');
    if (btn) { btn.textContent = '\u23F3 \u6267\u884C\u4E2D\u2026'; btn.disabled = true; btn.classList.add('opacity-60'); }
    setTimeout(() => {
      step4Shown = true;
      document.getElementById('chain-content').innerHTML = chainHtml(true);
      if (btn) btn.remove();
      showToast('Step 4 OSINT \u6838\u67E5\u5B8C\u6210 \u2714');
    }, 1500);
  };

  window.sendRFI = function() { showToast('\uD83D\uDCE9 RFI \u5DF2\u53D1\u9001\u81F3\u5BA2\u6237\u90AE\u4EF6\u7CFB\u7EDF'); };
  window.escalateCase = function() { showToast('\u2B06\uFE0F \u5DF2\u5347\u7EA7\u81F3 L2 \u5BA1\u6279\u961F\u5217', 'warning'); };
  window.genReport = function() { showToast('\uD83D\uDCCB \u5BA1\u67E5\u62A5\u544A\u5DF2\u751F\u6210'); };
  window.submitSTR = function() { showToast('\uD83D\uDEA8 STR \u5DF2\u63D0\u4EA4\u81F3\u5408\u89C4\u56E2\u961F', 'warning'); };

  window.setRating = function(n) { ratings = n; document.getElementById('rating-area').innerHTML = ratingHtml(); };
  window.submitRating = function() {
    if (!ratings) { showToast('\u8BF7\u5148\u9009\u62E9\u661F\u7EA7\u8BC4\u5206', 'warning'); return; }
    ratingSubmitted = true;
    document.getElementById('rating-area').innerHTML = ratingHtml();
    showToast(`\u5DF2\u63D0\u4EA4 ${ratings} \u661F\u8BC4\u5206 \u2B50`);
  };
}

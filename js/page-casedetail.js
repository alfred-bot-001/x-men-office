// ============================================================
// Page: Case Detail
// ============================================================
function renderCaseDetailPage(caseId) {
  const activeCaseId = caseId || 'CASE-20260410-0892';
  let step4Shown = false;
  let judgeState = {}; // {0: 'accurate', 1: 'inaccurate', ...}
  let ratings = 0;
  let ratingSubmitted = false;

  const cases = {
    'CASE-20260410-0892': {
      agent: 'EDD-Agent-002', skill: 'EDD-SOF-Review',
      trigger: 'EDD_EXCESSIVE_FUND (存款 >$100,000 USD)',
      startTime: '2026-04-10 12:31 UTC',
      steps: [
        { icon:'✅', label:'KYC 基本核验', color:'text-emerald-400', items:[
          '护照有效，到期日 2029-03-15 ✓','居住证明（银行流水，3个月内）✓',
          'PEP 筛查：未命中 ✓','Adverse Media：无结果 ✓'
        ], time:'12:31:45 UTC' },
        { icon:'✅', label:'SOF 申报分析', color:'text-emerald-400', items:[
          '申报来源：薪资 + 加密货币交易','申报年收入：$85,000',
          '过去12个月存款：$112,000','<span class="text-amber-300">⚠️ 差额 $27,000 — 需进一步核实</span>'
        ], time:'12:32:12 UTC' },
        { icon:'🔄', label:'文件核验（进行中）', color:'text-blue-400', items:[
          '工资单（近3个月）：✅ 已核实，与申报一致',
          '银行流水：✅ 可见定期薪资入账',
          '<span class="text-amber-300">⚠️ 加密货币交易所对账单：未提供</span>',
          'OSINT 1（姓名搜索）：✅ 无负面发现',
          'OSINT 2（雇主核查）：✅ 公司注册在案，状态活跃',
          'OSINT 3（职业背景）：✅ LinkedIn 资料一致',
        ], time:null, spinning:true },
        { icon:'⏳', label:'综合风险评估', color:'text-slate-500', items:['等待文件核验完成...'], time:null, hidden:true },
      ],
      step4Result: { icon:'⚠️', label:'综合风险评估', color:'text-amber-400', items:[
          '薪资覆盖率：$85,000 / $112,000 = <span class="text-amber-300 font-semibold">75.9%</span> ⚠️',
          '加密差额：<span class="text-amber-300">$27,000 未核实</span>',
          '风险等级：<span class="text-amber-400 font-bold">MEDIUM</span>',
          '建议：发送 RFI 要求提供加密交易所对账单'
        ], time:'12:35:08 UTC'
      },
      judgments: [
        { label:'KYC 核验结果', conclusion:'通过 / Pass' },
        { label:'SOF 覆盖度评估', conclusion:'薪资覆盖 75.9%，Crypto 缺口 $27K' },
        { label:'风险等级判断', conclusion:'Medium Risk' },
      ],
      warningTitle:'⚠️ 升级提示',
      warningText:'Crypto SOF 文件缺失，无法完成覆盖验证',
      escalateLabel:'升级至 L2',
      escalateClass:'text-amber-400',
    },
    'CASE-20260410-0765': {
      agent: 'EDD-Agent-003', skill: 'EDD-KYC-Review',
      trigger: 'PERIODIC_EDD_REVIEW (定期审查)',
      startTime: '2026-04-10 11:18 UTC',
      steps: [
        { icon:'✅', label:'KYC 基本核验', color:'text-emerald-400', items:['全部文件核验通过','身份证明有效 ✓'], time:'11:18:40 UTC' },
        { icon:'✅', label:'初步 SOF 核查', color:'text-emerald-400', items:['收入申报已提交','初步分析完成'], time:'11:20:12 UTC' },
        { icon:'🔴', label:'PEP 筛查 — 命中！', color:'text-red-400', items:[
          '<span class="text-red-400 font-semibold">⚠️ 命中：WorldCheck 匹配度 87%</span>',
          '司法管辖：尼日利亚（Nigeria）',
          '角色：前政府官员（Former Government Official）',
          '<span class="text-red-400 font-bold">→ 需立即升级至 L3 合规团队</span>',
        ], time:'11:21:05 UTC' },
      ],
      step4Result: null,
      judgments: [
        { label:'PEP 命中判断', conclusion:'疑似命中（87% 匹配度）' },
        { label:'管辖区风险', conclusion:'尼日利亚 - 高风险司法管辖' },
        { label:'升级决定', conclusion:'必须升级 L3 MLRO 审批' },
      ],
      warningTitle:'🔴 需立即升级',
      warningText:'疑似 PEP 命中 — 需要 L3 合规团队审批',
      escalateLabel:'升级至 L3',
      escalateClass:'text-red-400',
      isPEP: true,
    },
  };

  const c = cases[activeCaseId] || cases['CASE-20260410-0892'];
  const otherCase = activeCaseId === 'CASE-20260410-0892' ? 'CASE-20260410-0765' : 'CASE-20260410-0892';

  function chainHtml(showStep4) {
    let html = `<div class="space-y-5">`;
    const stepsToShow = showStep4
      ? [...c.steps.slice(0,3), {...c.step4Result, icon:'⚠️', label:c.step4Result.label, color:c.step4Result.color}]
      : c.steps;
    stepsToShow.forEach((step, i) => {
      if (step.hidden && !showStep4) {
        html += `<div class="flex items-start gap-3 opacity-40">
          <span class="text-lg">${step.icon}</span>
          <div class="flex-1">
            <div class="text-xs font-semibold ${step.color}">[Step ${i+1}] ${step.label}</div>
            <div class="text-xs text-slate-500 mt-1">${step.items[0]}</div>
          </div>
        </div>`;
        return;
      }
      html += `<div class="flex items-start gap-3">
        <span class="text-lg ${step.spinning?'animate-spin':''}">${step.icon}</span>
        <div class="flex-1">
          <div class="text-xs font-semibold ${step.color} flex items-center gap-2">
            [Step ${i+1}] ${step.label}
            ${step.time ? `<span class="text-slate-600 font-normal">• ${step.time}</span>` : ''}
          </div>
          <ul class="mt-1.5 space-y-1">
            ${step.items.map(item => `<li class="text-xs text-slate-400 flex items-start gap-1.5"><span class="text-slate-600 mt-0.5">•</span><span>${item}</span></li>`).join('')}
          </ul>
        </div>
      </div>`;
    });
    html += `</div>`;
    return html;
  }

  function judgmentCards() {
    return c.judgments.map((j, idx) => {
      const st = judgeState[idx];
      return `<div class="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50">
        <div class="text-xs text-slate-400 mb-1">${j.label}</div>
        <div class="text-sm font-medium text-white mb-2.5">${j.conclusion}</div>
        <div class="flex gap-2">
          <button onclick="judgeClick(${idx},'accurate')"
            class="flex-1 py-1.5 rounded text-xs font-medium transition-all border
            ${st==='accurate' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-700/60 border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-300'}">
            ✅ 准确</button>
          <button onclick="judgeClick(${idx},'inaccurate')"
            class="flex-1 py-1.5 rounded text-xs font-medium transition-all border
            ${st==='inaccurate' ? 'bg-red-700 border-red-500 text-white' : 'bg-slate-700/60 border-slate-600 text-slate-300 hover:border-red-500 hover:text-red-300'}">
            ❌ 不准确</button>
        </div>
      </div>`;
    }).join('');
  }

  function ratingHtml() {
    if (ratingSubmitted) return `<div class="text-center text-sm text-emerald-400 py-2">评分已提交 ✓</div>`;
    return `
      <div class="flex justify-center gap-1 mb-3">
        ${[1,2,3,4,5].map(i => `<button onclick="setRating(${i})" class="text-2xl transition-transform hover:scale-125 ${i<=ratings?'text-amber-400':'text-slate-600'}">★</button>`).join('')}
      </div>
      <button onclick="submitRating()" class="w-full py-2 rounded-lg text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white transition-colors">提交评分</button>`;
  }

  function rightPanel() {
    return `
    <div class="h-full overflow-y-auto p-5 space-y-5">
      <!-- Case info -->
      <div class="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50 space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="text-xs text-slate-500">Case ID</span>
          <span class="text-xs font-mono text-blue-300">${activeCaseId}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-slate-500">Agent</span>
          <span class="text-xs text-white">${c.agent}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-slate-500">Skill</span>
          <span class="text-xs text-white">${c.skill}</span>
        </div>
      </div>
      <!-- Judgments -->
      <div>
        <div class="text-xs font-semibold text-slate-300 mb-2.5">🎯 关键判断节点</div>
        <div class="space-y-2" id="judgment-cards">${judgmentCards()}</div>
      </div>
      <!-- Warning -->
      <div class="rounded-lg p-3 border ${c.isPEP ? 'bg-red-900/20 border-red-500/40' : 'bg-amber-900/20 border-amber-500/30'}">
        <div class="text-xs font-semibold ${c.escalateClass} mb-1">${c.warningTitle}</div>
        <div class="text-xs text-slate-300 mb-3">${c.warningText}</div>
        <div class="flex gap-2">
          ${!c.isPEP ? `<button onclick="sendRFI()" class="flex-1 py-1.5 rounded text-xs bg-blue-700 hover:bg-blue-600 text-white transition-colors">📤 发送 RFI</button>` : ''}
          <button onclick="escalate()" class="flex-1 py-1.5 rounded text-xs bg-red-700 hover:bg-red-600 text-white font-medium transition-colors">⬆️ ${c.escalateLabel}</button>
        </div>
      </div>
      <!-- Rating -->
      <div class="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50">
        <div class="text-xs font-semibold text-slate-300 mb-3">⭐ Agent 工作评分</div>
        <div id="rating-area">${ratingHtml()}</div>
      </div>
    </div>`;
  }

  setContent(`
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Case Selector bar -->
    <div class="flex-shrink-0 border-b border-slate-700/50 px-5 flex items-center gap-2 h-12">
      <span class="text-xs text-slate-500 mr-2">当前 Case:</span>
      <button onclick="switchCase('CASE-20260410-0892')"
        class="px-3 py-1 rounded-full text-xs font-mono transition-all ${activeCaseId==='CASE-20260410-0892' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}">
        CASE-0892
      </button>
      <button onclick="switchCase('CASE-20260410-0765')"
        class="px-3 py-1 rounded-full text-xs font-mono transition-all ${activeCaseId==='CASE-20260410-0765' ? 'bg-red-700 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}">
        CASE-0765 🔴
      </button>
    </div>
    <!-- Main split view -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left: Chain of thought -->
      <div class="flex-1 overflow-y-auto p-5 border-r border-slate-700/50 flex flex-col">
        <div class="mb-4 space-y-1">
          <div class="text-xs text-slate-500">Agent: <span class="text-white">${c.agent}</span> &nbsp;|&nbsp; Skill: <span class="text-white">${c.skill}</span></div>
          <div class="text-xs text-slate-500">触发: <span class="text-amber-300">${c.trigger}</span></div>
          <div class="text-xs text-slate-500">开始: ${c.startTime}</div>
        </div>
        <div class="border-t border-slate-700/50 pt-4 mb-4">
          <div class="text-xs font-semibold text-slate-400 mb-4 flex items-center gap-2">
            <span class="w-1 h-4 bg-blue-500 rounded"></span> Agent 推理链
          </div>
          <div id="chain-content">${chainHtml(step4Shown)}</div>
        </div>
        ${c.step4Result && !step4Shown ? `
        <div class="mt-auto pt-4">
          <button id="continue-btn" onclick="continueChain()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
            ▶ 继续执行
          </button>
        </div>` : ''}
      </div>
      <!-- Right: Decision panel -->
      <div class="w-80 flex-shrink-0" id="right-panel">${rightPanel()}</div>
    </div>
  </div>`);

  window.switchCase = function(id) {
    step4Shown = false; judgeState = {}; ratings = 0; ratingSubmitted = false;
    renderCaseDetailPage(id);
  };

  window.continueChain = function() {
    const btn = document.getElementById('continue-btn');
    if (btn) { btn.textContent = '⏳ 执行中...'; btn.disabled = true; }
    setTimeout(() => {
      step4Shown = true;
      document.getElementById('chain-content').innerHTML = chainHtml(true);
      const btnEl = document.getElementById('continue-btn');
      if (btnEl) btnEl.remove();
      showToast('Step 4 综合风险评估完成');
    }, 1500);
  };

  window.judgeClick = function(idx, val) {
    judgeState[idx] = val;
    document.getElementById('judgment-cards').innerHTML = judgmentCards();
    showToast(val==='accurate' ? '已标记：准确 ✅' : '已标记：不准确，反馈已记录');
  };

  window.sendRFI = function() { showToast('RFI 已发送至客户邮件系统 📤'); };
  window.escalate = function() { showToast(`已升级至 ${c.escalateLabel.replace('升级至','')} 审批队列 🚨`, 'warning'); };

  window.setRating = function(n) {
    ratings = n;
    document.getElementById('rating-area').innerHTML = ratingHtml();
    // re-bind since we re-rendered
  };

  window.submitRating = function() {
    if (ratings === 0) { showToast('请先选择星级评分','warning'); return; }
    ratingSubmitted = true;
    document.getElementById('rating-area').innerHTML = ratingHtml();
    showToast(`已提交 ${ratings} 星评分 ⭐`);
  };
}

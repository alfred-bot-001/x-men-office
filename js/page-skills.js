// ============================================================
// Page: Skill Management
// ============================================================
function renderSkillsPage() {
  let activeSkillId = 'skill-001';
  let activeTab = 'sop';
  let generatingSkill = false;
  let skillGenerated = false;

  const workflowNodes = [
    { id:'trigger', label:'触发条件', desc:'EDD_EXCESSIVE_FUND / 定期审查 / 手动触发', color:'border-blue-500/60 bg-blue-900/20' },
    { id:'step1',   label:'Step 1: KYC 核验', desc:'检查项: ID有效性 / POA / PEP / Adverse Media\n通过 → 继续 | PEP命中 → 🔴 升级L3', color:'border-emerald-500/60 bg-emerald-900/20' },
    { id:'step2',   label:'Step 2: SOF 核实', desc:'差异<10% → 通过 | 差异>10% → RFI | 无法核实 → 升级L2', color:'border-emerald-500/60 bg-emerald-900/20' },
    { id:'step3',   label:'Step 3: OSINT 检查（3项）', desc:'姓名搜索 / 雇主核查 / 职业背景\n全部通过 → 继续 | 有发现 → 标注', color:'border-violet-500/60 bg-violet-900/20' },
    { id:'step4',   label:'Step 4: 综合判断 & 输出', desc:'Approve / Reject / Pending RFI / Escalate', color:'border-amber-500/60 bg-amber-900/20' },
  ];

  let selectedNode = null;

  function skillCardHtml(s) {
    const isActive = s.id === activeSkillId;
    return `
    <div onclick="selectSkill('${s.id}')" class="p-4 rounded-xl border cursor-pointer transition-all ${isActive ? 'bg-slate-700/80 border-blue-500/50' : 'bg-slate-800/60 border-slate-700/30 hover:border-slate-600'}">
      <div class="flex items-start justify-between mb-2">
        <div>
          <div class="text-sm font-semibold text-white">${s.name}</div>
          <div class="text-xs text-slate-500 mt-0.5">${s.desc}</div>
        </div>
        <span class="text-xs font-mono ${isActive ? 'text-blue-300' : 'text-slate-500'} flex-shrink-0 ml-2">${s.version}</span>
      </div>
      <div class="text-xs text-slate-600 mb-3">SOP: ${s.sop}</div>
      <div class="flex items-center justify-between">
        <span class="text-xs text-slate-500">${s.agentCount} agents 使用中</span>
        <div class="flex gap-1">
          <button onclick="event.stopPropagation();selectSkill('${s.id}')" class="px-2 py-0.5 rounded text-xs bg-blue-700 hover:bg-blue-600 text-white transition-colors">编辑</button>
          <button onclick="event.stopPropagation();showToast('Skill 已复制','info')" class="px-2 py-0.5 rounded text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">复制</button>
          <button onclick="event.stopPropagation();showToast('Skill 已停用')" class="px-2 py-0.5 rounded text-xs bg-slate-700 hover:bg-red-800 text-slate-400 hover:text-red-300 transition-colors">停用</button>
        </div>
      </div>
    </div>`;
  }

  function editorHtml() {
    const s = mockSkills.find(x=>x.id===activeSkillId);
    const tabs = [['sop','📄 SOP 上传'],['flow','🔀 流程编辑器'],['gen','⚡ 生成 Skill']];
    return `
    <div class="flex flex-col h-full overflow-hidden">
      <div class="flex-shrink-0 p-4 border-b border-slate-700/50">
        <div class="text-sm font-semibold text-white mb-1">${s.name}</div>
        <div class="flex gap-1">
          ${tabs.map(([id,label]) => `
          <button onclick="switchTab('${id}')"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab===id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}">
            ${label}
          </button>`).join('')}
        </div>
      </div>
      <div class="flex-1 overflow-y-auto p-4" id="tab-content">${tabContent()}</div>
    </div>`;
  }

  function tabContent() {
    if (activeTab === 'sop') {
      return `
      <div class="space-y-4">
        <div class="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer" onclick="showToast('上传功能在 Demo 中仅供展示','info')">
          <div class="text-3xl mb-3">📂</div>
          <div class="text-sm text-slate-300 mb-1">拖拽上传 SOP 文件</div>
          <div class="text-xs text-slate-500">支持 PDF / Markdown / Word (.docx)</div>
          <button class="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs text-white rounded-lg transition-colors">选择文件</button>
        </div>
        <div class="bg-slate-700/40 rounded-xl p-4 border border-slate-600/50">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-lg">📄</span>
            <div class="flex-1">
              <div class="text-sm text-white">Enhanced Due Diligence Program v2.3.md</div>
              <div class="text-xs text-slate-500">上传于 2026-04-01 &nbsp;|&nbsp; 4.2 KB</div>
            </div>
            <span class="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded">已解析</span>
          </div>
          <div class="grid grid-cols-3 gap-2 text-xs">
            <div class="bg-slate-800/60 rounded-lg p-2 text-center"><div class="text-white font-bold">12</div><div class="text-slate-500">流程节点</div></div>
            <div class="bg-slate-800/60 rounded-lg p-2 text-center"><div class="text-white font-bold">5</div><div class="text-slate-500">升级规则</div></div>
            <div class="bg-slate-800/60 rounded-lg p-2 text-center"><div class="text-white font-bold">4</div><div class="text-slate-500">可执行 Skills</div></div>
          </div>
        </div>
        <button onclick="showToast('SOP 重新解析完成 ✅')" class="w-full py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white transition-colors flex items-center justify-center gap-2">
          🔄 重新解析 SOP
        </button>
      </div>`;
    }

    if (activeTab === 'flow') {
      return `
      <div class="space-y-1">
        <div class="text-xs text-slate-500 mb-4">点击节点查看详情并编辑</div>
        ${workflowNodes.map((n,i) => `
        <div>
          <div onclick="selectNode('${n.id}')" id="node-${n.id}"
            class="border rounded-xl p-3 cursor-pointer transition-all ${n.color} ${selectedNode===n.id?'ring-2 ring-blue-400':'hover:brightness-110'}">
            <div class="text-xs font-semibold text-white">${n.label}</div>
            <div class="text-xs text-slate-400 mt-1 whitespace-pre-line">${n.desc}</div>
          </div>
          ${i < workflowNodes.length-1 ? `<div class="flex justify-center my-1 text-slate-600 text-sm">↓</div>` : ''}
        </div>`).join('')}
        ${selectedNode ? `
        <div class="mt-4 bg-slate-700/40 rounded-xl p-4 border border-slate-600/50">
          <div class="text-xs font-semibold text-slate-300 mb-2">编辑节点: ${workflowNodes.find(n=>n.id===selectedNode)?.label}</div>
          <textarea class="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-xs text-slate-300 h-16 resize-none focus:outline-none focus:border-blue-500">${workflowNodes.find(n=>n.id===selectedNode)?.desc}</textarea>
          <div class="flex gap-2 mt-2">
            <button onclick="showToast('节点已保存')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs text-white rounded-lg transition-colors">保存</button>
            <button onclick="selectedNode=null;document.getElementById('tab-content').innerHTML=tabContent();" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 rounded-lg transition-colors">取消</button>
          </div>
        </div>` : ''}
      </div>`;
    }

    if (activeTab === 'gen') {
      if (skillGenerated) {
        return `
        <div class="text-center space-y-4 py-8">
          <div class="text-5xl">✅</div>
          <div class="text-base font-semibold text-emerald-400">Skill 已生成并可分配给 Agent</div>
          <div class="text-xs text-slate-400">skill.json 已写入配置库</div>
          <div class="bg-slate-800/60 rounded-xl p-4 text-left">
            <div class="text-xs font-mono text-slate-300 space-y-1">
              <div><span class="text-blue-300">"skillId"</span>: <span class="text-amber-300">"EDD-KYC-Review-v2.3"</span>,</div>
              <div><span class="text-blue-300">"steps"</span>: [<span class="text-emerald-300">4 nodes</span>],</div>
              <div><span class="text-blue-300">"escalationRules"</span>: [<span class="text-emerald-300">5 rules</span>],</div>
              <div><span class="text-blue-300">"sopVersion"</span>: <span class="text-amber-300">"v2.3"</span></div>
            </div>
          </div>
          <button onclick="skillGenerated=false;document.getElementById('tab-content').innerHTML=tabContent()" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white transition-colors">重新生成</button>
        </div>`;
      }
      return `
      <div class="text-center space-y-4 py-8">
        <div class="text-5xl mb-2">⚡</div>
        <div class="text-sm text-slate-300">将 SOP 解析结果转换为可执行 Skill 配置</div>
        <div class="text-xs text-slate-500">包含：流程节点、升级规则、判断逻辑、输出模板</div>
        <button id="gen-btn" onclick="generateSkill()" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm transition-colors flex items-center gap-2 mx-auto">
          ⚡ 生成审核 Skill
        </button>
      </div>`;
    }
  }

  setContent(`
  <div class="flex h-full overflow-hidden">
    <!-- Left: Skill list -->
    <div class="w-80 flex-shrink-0 border-r border-slate-700/50 flex flex-col overflow-hidden">
      <div class="flex-shrink-0 p-4 border-b border-slate-700/50 flex items-center justify-between">
        <h2 class="text-sm font-semibold text-white">Skill 库</h2>
        <button onclick="showToast('新建 Skill 功能即将上线','info')" class="text-xs text-blue-400 hover:text-blue-300">＋ 新建</button>
      </div>
      <div class="flex-1 overflow-y-auto p-3 space-y-2" id="skill-list">
        ${mockSkills.map(skillCardHtml).join('')}
      </div>
    </div>
    <!-- Right: Editor -->
    <div class="flex-1 overflow-hidden" id="skill-editor">${editorHtml()}</div>
  </div>`);

  window.selectSkill = function(id) {
    activeSkillId = id; activeTab='sop'; selectedNode=null; skillGenerated=false;
    document.getElementById('skill-list').innerHTML = mockSkills.map(skillCardHtml).join('');
    document.getElementById('skill-editor').innerHTML = editorHtml();
  };

  window.switchTab = function(tab) {
    activeTab = tab;
    document.getElementById('skill-editor').innerHTML = editorHtml();
  };

  window.selectNode = function(id) {
    selectedNode = selectedNode===id ? null : id;
    document.getElementById('tab-content').innerHTML = tabContent();
  };

  window.generateSkill = function() {
    const btn = document.getElementById('gen-btn');
    if (btn) { btn.innerHTML = '⏳ 生成中...'; btn.disabled=true; }
    setTimeout(() => {
      skillGenerated = true;
      document.getElementById('tab-content').innerHTML = tabContent();
      showToast('Skill 已生成 ✅');
    }, 2000);
  };
}

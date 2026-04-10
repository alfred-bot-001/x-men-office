// ============================================================
// Page: Agent Management
// ============================================================
function renderAgentsPage() {
  let agents = [...mockAgents];
  let editingId = null;

  function formHtml(agent) {
    const av = agent || { name:'', avatar:'🕵️', level:'L1', skills:[], workMode:'自动接任务' };
    return `
    <form id="agent-form" class="space-y-5">
      <div>
        <label class="block text-xs text-slate-400 mb-1.5">Agent 名称</label>
        <input id="f-name" type="text" value="${av.name}" placeholder="EDD-Agent-007"
          class="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-500"/>
      </div>
      <div>
        <label class="block text-xs text-slate-400 mb-1.5">头像</label>
        <div class="flex gap-2">
          ${AVATARS.map(em => `<button type="button" data-av="${em}" onclick="selectAvatar(this)"
            class="w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all
            ${av.avatar===em ? 'bg-blue-600 ring-2 ring-blue-400 scale-110' : 'bg-slate-700 hover:bg-slate-600'}">${em}</button>`).join('')}
        </div>
      </div>
      <div>
        <label class="block text-xs text-slate-400 mb-1.5">Skills（可多选）</label>
        <div class="grid grid-cols-2 gap-2">
          ${SKILLS_LIST.map(s => `
          <label class="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" name="skills" value="${s}" ${av.skills.includes(s)?'checked':''}
              class="accent-blue-500 w-4 h-4 rounded"/>
            <span class="text-xs text-slate-300 group-hover:text-white">${s}</span>
          </label>`).join('')}
        </div>
      </div>
      <div>
        <label class="block text-xs text-slate-400 mb-1.5">工作模式</label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="workMode" value="自动接任务" ${av.workMode==='自动接任务'?'checked':''} class="accent-blue-500"/>
            <span class="text-xs text-slate-300">🔵 自动接任务</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="workMode" value="手动触发任务" ${av.workMode==='手动触发任务'?'checked':''} class="accent-amber-500"/>
            <span class="text-xs text-slate-300">🟡 手动触发任务</span>
          </label>
        </div>
      </div>
      <div>
        <label class="block text-xs text-slate-400 mb-1.5">级别</label>
        <select id="f-level" class="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
          ${LEVEL_OPTIONS.map(l => `<option ${av.level===l?'selected':''}>${l}</option>`).join('')}
        </select>
      </div>
      <button type="button" onclick="saveAgent()" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
        ✅ 保存 Agent
      </button>
    </form>`;
  }

  function listHtml() {
    return agents.map(a => `
    <div id="aitem-${a.id}" onclick="editAgent('${a.id}')" class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-slate-700/60 ${editingId===a.id?'bg-slate-700/80 ring-1 ring-blue-500/50':''}">
      <div class="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center text-lg flex-shrink-0">${a.avatar}</div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-white truncate">${a.name}</div>
        <div class="flex items-center gap-1.5 mt-0.5">${statusDot(a.status)}</div>
      </div>
      ${levelBadge(a.level)}
    </div>`).join('');
  }

  setContent(`
  <div class="flex h-full">
    <!-- Left list -->
    <div class="w-72 flex-shrink-0 border-r border-slate-700/50 flex flex-col">
      <div class="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <h2 class="text-sm font-semibold text-white">Agent 列表 <span class="ml-1 text-xs text-slate-500">(${agents.length})</span></h2>
        <button onclick="newAgent()" class="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">＋ 新建</button>
      </div>
      <div id="agent-list" class="flex-1 overflow-y-auto p-3 space-y-1">${listHtml()}</div>
    </div>
    <!-- Right form -->
    <div class="flex-1 overflow-y-auto p-6">
      <div class="max-w-lg">
        <h2 class="text-base font-semibold text-white mb-5" id="form-title">✏️ 编辑 Agent</h2>
        <div id="form-area">${formHtml(agents[0])}</div>
      </div>
    </div>
  </div>`);

  editingId = agents[0].id;

  window.selectAvatar = function(btn) {
    document.querySelectorAll('[data-av]').forEach(b => {
      b.className = b.className.replace('bg-blue-600 ring-2 ring-blue-400 scale-110','bg-slate-700 hover:bg-slate-600');
    });
    btn.className = btn.className.replace('bg-slate-700 hover:bg-slate-600','bg-blue-600 ring-2 ring-blue-400 scale-110');
  };

  window.editAgent = function(id) {
    editingId = id;
    const a = agents.find(x=>x.id===id);
    document.getElementById('form-title').textContent = `✏️ 编辑 Agent — ${a.name}`;
    document.getElementById('form-area').innerHTML = formHtml(a);
    document.getElementById('agent-list').innerHTML = listHtml();
  };

  window.newAgent = function() {
    editingId = null;
    document.getElementById('form-title').textContent = '➕ 新建 Agent';
    document.getElementById('form-area').innerHTML = formHtml(null);
    document.getElementById('agent-list').innerHTML = listHtml();
  };

  window.saveAgent = function() {
    const name = document.getElementById('f-name').value.trim();
    if (!name) { showToast('请填写 Agent 名称','warning'); return; }
    const avatar = (document.querySelector('[data-av].bg-blue-600')||{}).dataset?.av || '🕵️';
    const skills = [...document.querySelectorAll('input[name=skills]:checked')].map(x=>x.value);
    const workMode = document.querySelector('input[name=workMode]:checked')?.value || '自动接任务';
    const level = document.getElementById('f-level').value;
    if (editingId) {
      const idx = agents.findIndex(x=>x.id===editingId);
      agents[idx] = { ...agents[idx], name, avatar, skills, workMode, level };
    } else {
      const id = 'agent-' + String(agents.length+1).padStart(3,'0');
      agents.push({ id, name, avatar, level, skills, workMode, status:'idle', currentCase:null, todayCases:0 });
      editingId = id;
    }
    document.getElementById('agent-list').innerHTML = listHtml();
    showToast('Agent 已保存');
  };
}

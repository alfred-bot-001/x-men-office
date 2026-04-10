// ============================================================
// Page: Agent Management — Org-Tree View
// ============================================================
function renderAgentsPage() {
  const agents = [...mockAgents];
  const orgs   = [...mockOrgAgents];
  let editingId = null;          // currently editing agent id
  let collapsed = {};            // collapsed group state

  /* ---- helper: small avatar card (child agent) ---- */
  function childCard(a) {
    return `
    <div class="bg-gray-700/60 rounded-xl p-3 flex flex-col items-center text-center gap-2 hover:bg-gray-700 transition-colors group relative min-w-[130px]">
      ${avatarImg(a.avatar, 'w-14 h-14')}
      <div class="text-xs font-semibold text-white leading-tight truncate w-full">${a.name}</div>
      <div class="flex items-center gap-1">${statusDot(a.status)} ${levelBadge(a.level)}</div>
      <div class="flex flex-wrap justify-center gap-1 mt-0.5">
        ${a.skills.map(s => skillTag(s)).join('')}
      </div>
      <div class="text-[10px] text-gray-500">今日 ${a.todayCases} 案例</div>
      <button onclick="editAgent('${a.id}')"
        class="mt-1 text-[11px] text-blue-400 hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        ✏️ 编辑
      </button>
    </div>`;
  }

  /* ---- helper: organizer header + children row ---- */
  function groupBlock(org) {
    const kids = org.children.map(cid => agents.find(x => x.id === cid)).filter(Boolean);
    const isCollapsed = collapsed[org.group];
    return `
    <div class="mb-6">
      <!-- Organizer banner -->
      <div class="flex items-center gap-3 bg-gray-800 rounded-xl p-4 border border-gray-700/60 cursor-pointer select-none"
           onclick="toggleGroup('${org.group}')">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br ${gradientFor(org.group)} flex items-center justify-center text-xl font-bold text-white shadow-lg flex-shrink-0">
          ${orgIcon(org.group)}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-white flex items-center gap-2">
            ${org.name}
            <span class="text-[10px] font-normal px-1.5 py-0.5 rounded bg-gray-700 text-gray-400">${org.role}</span>
            ${statusDot(org.status)}
          </div>
          <div class="text-xs text-gray-400 mt-0.5 truncate">${org.desc}</div>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          <span class="text-[11px] text-gray-500">${kids.length} 子 Agent</span>
          <button onclick="event.stopPropagation();editOrg('${org.id}')"
            class="text-[11px] text-blue-400 hover:text-blue-300">✏️ 编辑</button>
          <svg class="w-4 h-4 text-gray-500 transition-transform ${isCollapsed?'':'rotate-180'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
      <!-- Connector line -->
      ${isCollapsed ? '' : `
      <div class="flex justify-center"><div class="w-px h-4 bg-gray-700"></div></div>
      <!-- Children row -->
      <div class="flex gap-3 overflow-x-auto pl-6 pr-2 pb-2">
        ${kids.map(a => `
          <div class="flex flex-col items-center">
            <div class="w-px h-3 bg-gray-700 mb-1"></div>
            ${childCard(a)}
          </div>`).join('')}
      </div>`}
    </div>`;
  }

  /* ---- helper: gradient color per group ---- */
  function gradientFor(g) {
    return { namescreen:'from-emerald-600 to-emerald-800', edd:'from-blue-600 to-indigo-800', fci:'from-orange-600 to-red-800' }[g] || 'from-gray-600 to-gray-800';
  }
  function orgIcon(g) {
    return { namescreen:'🛡️', edd:'🔍', fci:'⚖️' }[g] || '🤖';
  }

  /* ---- form html for editing an agent ---- */
  function formHtml(agent) {
    const av = agent || { name:'', avatar:AVATARS[0], level:'L1', skills:[], workMode:'自动接任务' };
    return `
    <form id="agent-form" class="space-y-5">
      <div>
        <label class="block text-xs text-gray-400 mb-1.5">Agent 名称</label>
        <input id="f-name" type="text" value="${av.name}" placeholder="Agent-007"
          class="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-gray-500"/>
      </div>
      <div>
        <label class="block text-xs text-gray-400 mb-1.5">头像</label>
        <div class="flex gap-2 flex-wrap">
          ${AVATARS.map(img => `<button type="button" data-av="${img}" onclick="selectAvatar(this)"
            class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 transition-all
            ${av.avatar===img ? 'ring-2 ring-blue-400 scale-110' : 'opacity-70 hover:opacity-100'}"><img src="${img}" style="width:100%;height:100%;object-fit:cover;display:block;"/></button>`).join('')}
        </div>
      </div>
      <div>
        <label class="block text-xs text-gray-400 mb-1.5">Skills（可多选）</label>
        <div class="grid grid-cols-2 gap-2">
          ${SKILLS_LIST.map(s => `
          <label class="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" name="skills" value="${s}" ${av.skills.includes(s)?'checked':''}
              class="accent-blue-500 w-4 h-4 rounded"/>
            <span class="text-xs text-gray-300 group-hover:text-white">${s}</span>
          </label>`).join('')}
        </div>
      </div>
      <div>
        <label class="block text-xs text-gray-400 mb-1.5">工作模式</label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="workMode" value="自动接任务" ${av.workMode==='自动接任务'?'checked':''} class="accent-blue-500"/>
            <span class="text-xs text-gray-300">🔵 自动接任务</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="workMode" value="手动触发任务" ${av.workMode==='手动触发任务'?'checked':''} class="accent-amber-500"/>
            <span class="text-xs text-gray-300">🟡 手动触发任务</span>
          </label>
        </div>
      </div>
      <div>
        <label class="block text-xs text-gray-400 mb-1.5">级别</label>
        <select id="f-level" class="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
          ${LEVEL_OPTIONS.map(l => `<option ${av.level===l?'selected':''}>${l}</option>`).join('')}
        </select>
      </div>
      <button type="button" onclick="saveAgent()" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
        ✅ 保存 Agent
      </button>
    </form>`;
  }

  /* ---- main render ---- */
  function render() {
    setContent(`
    <div class="flex h-full">
      <!-- Left: Org Tree -->
      <div class="flex-1 overflow-y-auto p-5" id="org-tree">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-base font-semibold text-white">🏗️ Agent 组织结构</h2>
          <button onclick="newAgent()" class="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors">＋ 新建 Agent</button>
        </div>
        ${orgs.map(o => groupBlock(o)).join('')}
      </div>
      <!-- Right: Edit panel (hidden by default) -->
      <div id="edit-panel" class="w-96 flex-shrink-0 border-l border-gray-700/50 overflow-y-auto ${editingId ? '' : 'hidden'}">
        <div class="p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-semibold text-white" id="form-title">✏️ 编辑 Agent</h2>
            <button onclick="closeEdit()" class="text-xs text-gray-400 hover:text-white">✕ 关闭</button>
          </div>
          <div id="form-area"></div>
        </div>
      </div>
    </div>`);
  }

  render();

  /* ---- global actions ---- */
  window.toggleGroup = function(group) {
    collapsed[group] = !collapsed[group];
    document.getElementById('org-tree').innerHTML = `
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-base font-semibold text-white">🏗️ Agent 组织结构</h2>
        <button onclick="newAgent()" class="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors">＋ 新建 Agent</button>
      </div>
      ${orgs.map(o => groupBlock(o)).join('')}`;
  };

  window.selectAvatar = function(btn) {
    document.querySelectorAll('[data-av]').forEach(b => {
      b.className = b.className.replace('ring-2 ring-blue-400 scale-110','opacity-70 hover:opacity-100');
    });
    btn.className = btn.className.replace('opacity-70 hover:opacity-100','ring-2 ring-blue-400 scale-110');
  };

  window.editAgent = function(id) {
    editingId = id;
    const a = agents.find(x => x.id === id);
    const panel = document.getElementById('edit-panel');
    panel.classList.remove('hidden');
    document.getElementById('form-title').textContent = `✏️ 编辑 — ${a.name}`;
    document.getElementById('form-area').innerHTML = formHtml(a);
  };

  window.editOrg = function(id) {
    const o = orgs.find(x => x.id === id);
    editingId = id;
    const panel = document.getElementById('edit-panel');
    panel.classList.remove('hidden');
    document.getElementById('form-title').textContent = `✏️ 编辑 Organizer — ${o.name}`;
    document.getElementById('form-area').innerHTML = `
      <div class="space-y-4">
        <div>
          <label class="block text-xs text-gray-400 mb-1.5">名称</label>
          <input id="f-org-name" type="text" value="${o.name}"
            class="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"/>
        </div>
        <div>
          <label class="block text-xs text-gray-400 mb-1.5">描述</label>
          <textarea id="f-org-desc" rows="3"
            class="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">${o.desc}</textarea>
        </div>
        <div>
          <label class="block text-xs text-gray-400 mb-1.5">子 Agent</label>
          <div class="space-y-1">
            ${o.children.map(cid => {
              const c = agents.find(x => x.id === cid);
              return c ? `<div class="text-xs text-gray-300 bg-gray-700/50 rounded px-2 py-1.5 flex items-center gap-2">${avatarImg(c.avatar,'w-5 h-5')} ${c.name} ${statusDot(c.status)}</div>` : '';
            }).join('')}
          </div>
        </div>
        <button type="button" onclick="saveOrg()" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">✅ 保存 Organizer</button>
      </div>`;
  };

  window.closeEdit = function() {
    editingId = null;
    document.getElementById('edit-panel').classList.add('hidden');
  };

  window.newAgent = function() {
    editingId = null;
    const panel = document.getElementById('edit-panel');
    panel.classList.remove('hidden');
    document.getElementById('form-title').textContent = '➕ 新建 Agent';
    document.getElementById('form-area').innerHTML = formHtml(null);
  };

  window.saveAgent = function() {
    const name = document.getElementById('f-name').value.trim();
    if (!name) { showToast('请填写 Agent 名称','warning'); return; }
    const avatar = (document.querySelector('[data-av].ring-2')||{}).dataset?.av || AVATARS[0];
    const skills = [...document.querySelectorAll('input[name=skills]:checked')].map(x => x.value);
    const workMode = document.querySelector('input[name=workMode]:checked')?.value || '自动接任务';
    const level = document.getElementById('f-level').value;
    if (editingId) {
      const idx = agents.findIndex(x => x.id === editingId);
      if (idx >= 0) agents[idx] = { ...agents[idx], name, avatar, skills, workMode, level };
    } else {
      const id = 'agent-' + String(agents.length + 1).padStart(3, '0');
      agents.push({ id, name, avatar, level, skills, workMode, status:'idle', currentCase:null, todayCases:0, group:'edd' });
      editingId = id;
    }
    render();
    showToast('Agent 已保存');
  };

  window.saveOrg = function() {
    const name = document.getElementById('f-org-name').value.trim();
    const desc = document.getElementById('f-org-desc').value.trim();
    if (!name) { showToast('请填写名称','warning'); return; }
    const idx = orgs.findIndex(x => x.id === editingId);
    if (idx >= 0) { orgs[idx].name = name; orgs[idx].desc = desc; }
    render();
    showToast('Organizer 已保存');
  };
}

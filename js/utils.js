// ============================================================
// Utilities
// ============================================================
function statusDot(status) {
  const map = { idle:'bg-emerald-400', busy:'bg-amber-400', 'needs-approval':'bg-red-400' };
  const label = { idle:'空闲', busy:'忙碌', 'needs-approval':'需人工审批' };
  return `<span class="inline-flex items-center gap-1.5">
    <span class="w-2 h-2 rounded-full ${map[status]||'bg-slate-400'} ${status==='busy'?'animate-pulse':''}"></span>
    <span class="text-xs ${status==='needs-approval'?'text-red-400':status==='busy'?'text-amber-400':'text-emerald-400'}">${label[status]||status}</span>
  </span>`;
}

function levelBadge(level) {
  const map = { 'L1':'bg-blue-900/60 text-blue-300 border border-blue-700/50', 'L2':'bg-violet-900/60 text-violet-300 border border-violet-700/50', 'L3':'bg-amber-900/40 text-amber-300 border border-amber-700/50', 'L4':'bg-red-900/40 text-red-300 border border-red-700/50' };
  return `<span class="px-2 py-0.5 rounded text-xs font-mono ${map[level]||'bg-slate-700 text-slate-300'}">${level}</span>`;
}

function skillTag(skill) {
  const colors = {
    'EDD-Trigger-Skill':'bg-blue-900/30 text-blue-300',
    'EDD-KYC-Skill':'bg-blue-900/30 text-blue-300',
    'EDD-SOF&SOW-Skill':'bg-indigo-900/30 text-indigo-300',
    'EDD-OSINT-Skill':'bg-cyan-900/30 text-cyan-300',
    'EDD-RFI-Skill':'bg-teal-900/30 text-teal-300',
    'FCI-PreCheck-Skill':'bg-orange-900/30 text-orange-300',
    'FCI-Initial-Investigation-Skill':'bg-amber-900/30 text-amber-300',
    'FCI-Full-Review-Skill':'bg-red-900/30 text-red-300',
    'FCI-OnChain-Analysis-Skill':'bg-rose-900/30 text-rose-300',
  };
  return `<span class="px-1.5 py-0.5 rounded text-xs ${colors[skill]||'bg-slate-700 text-slate-400'}">${skill}</span>`;
}

function showToast(msg, type='success') {
  const t = document.createElement('div');
  const bg = type==='success' ? 'bg-emerald-600' : type==='warning' ? 'bg-amber-600' : 'bg-blue-600';
  t.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-xl text-white text-sm font-medium flex items-center gap-2 ${bg} transition-all`;
  t.innerHTML = (type==='success'?'✅ ':'⚡ ') + msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; setTimeout(()=>t.remove(),300); }, 2800);
}

function setContent(html) {
  document.getElementById('page-content').innerHTML = html;
}

function avatarImg(src, sizeClass) {
  sizeClass = sizeClass || 'w-9 h-9';
  return `<div class="${sizeClass} rounded-lg overflow-hidden flex-shrink-0 bg-slate-700"><img src="${src}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.style.display='none'"/></div>`;
}

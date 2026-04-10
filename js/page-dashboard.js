// ============================================================
// Page: Dashboard
// ============================================================
function renderDashboardPage() {
  const kpis = [
    { label:'今日处理 Cases', value:'156', icon:'📋', trend:'+12%', up:true, color:'text-blue-400', bg:'bg-blue-900/20 border-blue-700/30' },
    { label:'平均处理时长', value:'18 min', icon:'⏱️', trend:'-8%', up:false, color:'text-emerald-400', bg:'bg-emerald-900/20 border-emerald-700/30' },
    { label:'自动完成率', value:'73%', icon:'🤖', trend:'+3%', up:true, color:'text-violet-400', bg:'bg-violet-900/20 border-violet-700/30' },
    { label:'整体准确率', value:'91.3%', icon:'🎯', trend:'+1.2%', up:true, color:'text-amber-400', bg:'bg-amber-900/20 border-amber-700/30' },
  ];

  const agentWorkload = [
    { name:'Namescreen-Agent-001', cases:28 },{ name:'Namescreen-Agent-002', cases:31 },
    { name:'FCI-Agent-001', cases:12 },{ name:'FCI-Agent-002', cases:35 },
    { name:'EDD-Agent-001', cases:29 },{ name:'EDD-Agent-002', cases:21 },
  ];

  const recentCases = mockRecentCases;

  setContent(`
  <div class="h-full overflow-y-auto p-5 space-y-5">
    <!-- KPI Cards -->
    <div class="grid grid-cols-4 gap-4">
      ${kpis.map(k => `
      <div class="bg-slate-800/60 rounded-xl border ${k.bg} p-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-slate-400 text-xs">${k.label}</span>
          <span class="text-lg">${k.icon}</span>
        </div>
        <div class="text-2xl font-bold ${k.color} mb-1">${k.value}</div>
        <div class="text-xs ${k.up ? 'text-emerald-400' : 'text-red-400'}">${k.trend} vs 昨日</div>
      </div>`).join('')}
    </div>

    <!-- Charts row 1 -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Agent Workload bar -->
      <div class="bg-slate-800/60 rounded-xl border border-slate-700/30 p-4">
        <div class="text-xs font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <span class="w-1 h-4 bg-blue-500 rounded"></span> Agent 工作负荷（今日）
        </div>
        <div class="space-y-3">
          ${agentWorkload.map(a => {
            const pct = Math.round(a.cases/35*100);
            const barColor = a.cases===35?'bg-amber-500':a.cases===12?'bg-red-400':'bg-blue-500';
            return `<div class="flex items-center gap-3">
              <span class="text-xs text-slate-400 w-28 flex-shrink-0">${a.name}</span>
              <div class="flex-1 bg-slate-700/50 rounded-full h-2">
                <div class="${barColor} h-2 rounded-full transition-all" style="width:${pct}%"></div>
              </div>
              <span class="text-xs text-white w-8 text-right">${a.cases}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
      <!-- Escalation Pie -->
      <div class="bg-slate-800/60 rounded-xl border border-slate-700/30 p-4">
        <div class="text-xs font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <span class="w-1 h-4 bg-violet-500 rounded"></span> 升级率分布
        </div>
        <canvas id="pie-chart" height="160"></canvas>
      </div>
    </div>

    <!-- Charts row 2 -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Accuracy trend line -->
      <div class="bg-slate-800/60 rounded-xl border border-slate-700/30 p-4">
        <div class="text-xs font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <span class="w-1 h-4 bg-emerald-500 rounded"></span> 准确率趋势（近30天）
        </div>
        <canvas id="line-chart" height="130"></canvas>
      </div>
      <!-- Heatmap simplified -->
      <div class="bg-slate-800/60 rounded-xl border border-slate-700/30 p-4">
        <div class="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <span class="w-1 h-4 bg-amber-500 rounded"></span> 案件量时间热力图（UTC, 7天）
        </div>
        <div id="heatmap" class="grid gap-0.5" style="grid-template-columns: repeat(24,1fr)"></div>
        <div class="flex justify-between text-xs text-slate-600 mt-1"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:59</span></div>
        <div class="flex items-center gap-2 mt-2 text-xs text-slate-500">
          <span>低</span>
          <div class="flex gap-0.5">${[0.1,0.3,0.5,0.7,0.9].map(o=>`<div class="w-3 h-3 rounded-sm bg-amber-400" style="opacity:${o}"></div>`).join('')}</div>
          <span>高</span>
        </div>
      </div>
    </div>

    <!-- Skip-L2 unlock status -->
    <div class="bg-slate-800/60 rounded-xl border border-emerald-700/30 p-4 flex items-center gap-4">
      <div class="w-10 h-10 rounded-full bg-emerald-900/40 flex items-center justify-center text-xl flex-shrink-0">🔓</div>
      <div class="flex-1">
        <div class="text-sm font-semibold text-emerald-300">FCI Pre-Check 自动关闭率</div>
        <div class="text-xs text-slate-400 mt-0.5">当前自动关闭率：<span class="text-emerald-400 font-semibold">38.5%</span> &nbsp;|&nbsp; 目标阈值：35% &nbsp;|&nbsp; 已超过阈值 ✅</div>
      </div>
      <div class="text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-700/40 px-3 py-1.5 rounded-lg">已启用</div>
    </div>

    <!-- Recent cases table -->
    <div class="bg-slate-800/60 rounded-xl border border-slate-700/30 p-4">
      <div class="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
        <span class="w-1 h-4 bg-slate-500 rounded"></span> 最近案件记录
      </div>
      <table class="w-full text-xs">
        <thead>
          <tr class="text-slate-500 border-b border-slate-700/50">
            <th class="text-left pb-2 font-medium">Case ID</th>
            <th class="text-left pb-2 font-medium">Agent</th>
            <th class="text-left pb-2 font-medium">Skill</th>
            <th class="text-left pb-2 font-medium">耗时</th>
            <th class="text-left pb-2 font-medium">结果</th>
            <th class="text-left pb-2 font-medium">评分</th>
            <th class="text-left pb-2 font-medium">升级</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700/30">
          ${recentCases.map(c => `
          <tr class="hover:bg-slate-700/20 transition-colors">
            <td class="py-2 font-mono text-blue-300">${c.id}</td>
            <td class="py-2 text-slate-300">${c.agent}</td>
            <td class="py-2 text-slate-400">${c.skill}</td>
            <td class="py-2 text-slate-400">${c.duration}</td>
            <td class="py-2">
              <span class="px-1.5 py-0.5 rounded text-xs ${
                c.result==='Approved'?'bg-emerald-900/40 text-emerald-300':
                c.result.includes('Escalated')||c.result==='Rejected'?'bg-red-900/40 text-red-300':
                c.result==='False Alert'?'bg-blue-900/40 text-blue-300':
                'bg-amber-900/40 text-amber-300'}">${c.result}</span>
            </td>
            <td class="py-2 text-amber-400">${'★'.repeat(c.rating)}<span class="text-slate-600">${'★'.repeat(5-c.rating)}</span></td>
            <td class="py-2">${c.escalated ? '<span class="text-red-400">是</span>' : '<span class="text-slate-500">否</span>'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`);

  // Build charts after DOM is ready
  setTimeout(() => {
    // Pie chart
    const pieCtx = document.getElementById('pie-chart');
    if (pieCtx && window.Chart) {
      new Chart(pieCtx, {
        type:'doughnut',
        data: {
          labels:['L1 Cases','L2 Escalated','L3 High Risk','L4 MLRO'],
          datasets:[{ data:[65,20,10,5],
            backgroundColor:['#10b981','#8b5cf6','#f59e0b','#ef4444'],
            borderColor:'#1e293b', borderWidth:2 }]
        },
        options:{ plugins:{ legend:{ position:'right', labels:{ color:'#94a3b8', font:{size:10}, boxWidth:10 }}}, cutout:'65%' }
      });
    }

    // Line chart
    const lineCtx = document.getElementById('line-chart');
    if (lineCtx && window.Chart) {
      const days = Array.from({length:30},(_,i)=>`4/${i+1}`);
      const acc = Array.from({length:30},()=>+(88+Math.random()*7).toFixed(1));
      new Chart(lineCtx, {
        type:'line',
        data:{
          labels:days,
          datasets:[{
            label:'准确率 (%)', data:acc,
            borderColor:'#10b981', backgroundColor:'rgba(16,185,129,0.1)',
            fill:true, tension:0.4, pointRadius:0, borderWidth:2
          }]
        },
        options:{
          plugins:{ legend:{ display:false }},
          scales:{
            x:{ ticks:{ color:'#475569', maxTicksLimit:6, font:{size:10} }, grid:{ color:'rgba(255,255,255,0.04)' }},
            y:{ ticks:{ color:'#475569', font:{size:10} }, grid:{ color:'rgba(255,255,255,0.04)' }, min:85, max:100 }
          }
        }
      });
    }

    // Heatmap
    const hm = document.getElementById('heatmap');
    if (hm) {
      const rows = 7;
      const cols = 24;
      for (let r=0; r<rows; r++) {
        for (let c=0; c<cols; c++) {
          const peak = (c>=8 && c<=20) ? 0.9 : 0.2;
          const rand = Math.random()*peak;
          const cell = document.createElement('div');
          cell.className = 'rounded-sm';
          cell.style.height = '14px';
          cell.style.backgroundColor = `rgba(251,191,36,${rand})`;
          cell.title = `Day ${r+1} ${String(c).padStart(2,'0')}:00 — ${Math.round(rand*50)} cases`;
          hm.appendChild(cell);
        }
      }
    }
  }, 100);
}

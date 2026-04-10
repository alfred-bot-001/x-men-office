// ============================================================
// Mock Data
// ============================================================
const SKILLS_LIST = [
  'EDD-KYC-Review', 'EDD-SOF-Review', 'EDD-SOW-Review',
  'Alert-Clearing-Review', 'EDD-OSINT-Check', 'EDD-Risk-Analysis'
];
const AVATARS = ['🕵️','👮','🔍','⚖️','🛡️','📋'];
const LEVEL_OPTIONS = ['L1','Skip-L2','L2'];

const mockAgents = [
  { id:'agent-001', name:'EDD-Agent-001', avatar:'🕵️', level:'L1',  skills:['EDD-KYC-Review','EDD-SOF-Review'],                  workMode:'自动接任务',  status:'idle',          currentCase:null,                  todayCases:28 },
  { id:'agent-002', name:'EDD-Agent-002', avatar:'👮', level:'L1',  skills:['EDD-SOF-Review','EDD-OSINT-Check'],                 workMode:'自动接任务',  status:'busy',          currentCase:'CASE-20260410-0892',  todayCases:31 },
  { id:'agent-003', name:'EDD-Agent-003', avatar:'⚖️', level:'L2',  skills:['EDD-KYC-Review','EDD-Risk-Analysis'],               workMode:'手动触发任务', status:'needs-approval', currentCase:'CASE-20260410-0765', todayCases:12 },
  { id:'agent-004', name:'EDD-Agent-004', avatar:'🔍', level:'L1',  skills:['Alert-Clearing-Review'],                            workMode:'自动接任务',  status:'busy',          currentCase:'CASE-20260410-1034',  todayCases:35 },
  { id:'agent-005', name:'EDD-Agent-005', avatar:'🛡️', level:'Skip-L2', skills:['EDD-KYC-Review','EDD-SOF-Review','EDD-SOW-Review'], workMode:'自动接任务',  status:'idle',          currentCase:null,                  todayCases:29 },
  { id:'agent-006', name:'EDD-Agent-006', avatar:'📋', level:'L1',  skills:['EDD-OSINT-Check'],                                 workMode:'手动触发任务', status:'idle',          currentCase:null,                   todayCases:21 },
];

const mockSkills = [
  { id:'skill-001', name:'EDD-KYC-Review',         version:'v2.3', desc:'身份核验 / PEP / Adverse Media 审查', sop:'Enhanced Due Diligence Program v2.3', agentCount:4, status:'active' },
  { id:'skill-002', name:'EDD-SOF-Review',          version:'v2.3', desc:'资金来源 (SOF/SOW) 验证',             sop:'Enhanced Due Diligence Program v2.3', agentCount:3, status:'active' },
  { id:'skill-003', name:'Alert-Clearing-Review',   version:'v2.0', desc:'警报处理 / 姓名筛查',                 sop:'L1 & L2 Alert Clearing SOP v2',       agentCount:2, status:'active' },
  { id:'skill-004', name:'EDD-OSINT-Check',         version:'v1.5', desc:'开源情报调查 (OSINT)',                 sop:'Enhanced Due Diligence Program v2.3', agentCount:2, status:'active' },
  { id:'skill-005', name:'EDD-Risk-Analysis',       version:'v1.0', desc:'综合风险评估与评分',                   sop:'Enhanced Due Diligence Program v2.3', agentCount:1, status:'active' },
];

const mockRecentCases = [
  { id:'CASE-20260410-0892', agent:'EDD-Agent-002', skill:'EDD-SOF-Review',      duration:'18 min', result:'Pending RFI',  rating:4, escalated:false },
  { id:'CASE-20260410-0765', agent:'EDD-Agent-003', skill:'EDD-KYC-Review',      duration:'9 min',  result:'Escalated L3', rating:5, escalated:true },
  { id:'CASE-20260410-0633', agent:'EDD-Agent-001', skill:'EDD-KYC-Review',      duration:'12 min', result:'Approved',     rating:5, escalated:false },
  { id:'CASE-20260410-0744', agent:'EDD-Agent-005', skill:'EDD-SOW-Review',      duration:'22 min', result:'Approved',     rating:4, escalated:false },
  { id:'CASE-20260410-0611', agent:'EDD-Agent-004', skill:'Alert-Clearing-Review',duration:'6 min', result:'False Alert',  rating:5, escalated:false },
  { id:'CASE-20260410-0580', agent:'EDD-Agent-006', skill:'EDD-OSINT-Check',     duration:'31 min', result:'Approved',     rating:3, escalated:false },
  { id:'CASE-20260410-0512', agent:'EDD-Agent-002', skill:'EDD-SOF-Review',      duration:'15 min', result:'Pending RFI',  rating:4, escalated:false },
  { id:'CASE-20260410-0488', agent:'EDD-Agent-001', skill:'EDD-Risk-Analysis',   duration:'11 min', result:'Rejected',     rating:4, escalated:true },
];

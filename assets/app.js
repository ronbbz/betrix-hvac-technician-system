/* =============================================
   Betrix HVAC Technician Business System
   assets/app.js — Interactive behavior only
   No view-switching logic. Real routes handle navigation.
   ============================================= */

/* ===== DARK MODE ===== */
function toggleTheme(){
  var isDark=document.documentElement.getAttribute('data-theme')==='dark';
  var next=isDark?'light':'dark';
  document.documentElement.setAttribute('data-theme',next);
  var btn=document.getElementById('themeToggle');
  if(btn) btn.textContent=isDark?'Dark':'Light';
  try{localStorage.setItem('betrixTheme',next);}catch(e){}
}

(function initTheme(){
  var saved=null;
  try{saved=localStorage.getItem('betrixTheme');}catch(e){}
  var theme=saved||'light';
  if(theme==='dark'){
    document.documentElement.setAttribute('data-theme','dark');
    var btn=document.getElementById('themeToggle');
    if(btn) btn.textContent='Light';
  }
})();

/* ===== LANDING FAQ ===== */
function toggleFaq(el){
  var item=el.parentElement;
  var wasOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open');});
  if(!wasOpen) item.classList.add('open');
}

/* ===== PHASE SECTION ACCORDIONS ===== */
function toggleSection(btn){
  var item=btn.parentElement;
  var wasOpen=item.classList.contains('open');
  document.querySelectorAll('.ps-item').forEach(function(i){i.classList.remove('open');});
  if(!wasOpen) item.classList.add('open');
}

/* ===== WORKFLOW ACCORDIONS ===== */
function toggleWF(btn){
  var item=btn.parentElement;
  var wasOpen=item.classList.contains('open');
  document.querySelectorAll('.wf-item').forEach(function(i){i.classList.remove('open');});
  if(!wasOpen) item.classList.add('open');
}

/* ===== QUESTION BANK ACCORDIONS ===== */
function toggleQB(btn){
  var item=btn.parentElement;
  var wasOpen=item.classList.contains('open');
  document.querySelectorAll('.qb-item').forEach(function(i){i.classList.remove('open');});
  if(!wasOpen) item.classList.add('open');
}

/* ===== CHECKLIST TOGGLE ===== */
function toggleCheck(row){
  row.classList.toggle('checked');
}

/* ===== PHASE 1 — FIT ASSESSMENT SCORECARD ===== */
function scoreBtn(btn,val){
  var row=btn.closest('.score-row');
  row.querySelectorAll('.s-btn').forEach(function(b){b.classList.remove('sel-0','sel-1','sel-2');});
  btn.classList.add('sel-'+val);
  updateFitScore();
}

function updateFitScore(){
  var total=0;var count=0;
  document.querySelectorAll('#fitAssessment .score-row').forEach(function(row){
    var sel=row.querySelector('.sel-0,.sel-1,.sel-2');
    if(sel){count++;total+=sel.classList.contains('sel-2')?2:sel.classList.contains('sel-1')?1:0;}
  });
  var scoreEl=document.getElementById('fitScore');
  var interp=document.getElementById('fitInterp');
  if(!scoreEl) return;
  if(count===0){scoreEl.textContent='—';if(interp) interp.classList.remove('visible');return;}
  scoreEl.textContent=total+'/'+(count*2);
  var pct=total/(count*2);
  var msg='';
  if(pct>=0.81) msg='<strong>Strong fit signal.</strong> HVAC may be worth exploring seriously. Move into Phase 2 with focus.';
  else if(pct>=0.5) msg='<strong>Possible fit signal.</strong> HVAC may fit, but you need more clarity before committing money or major time.';
  else msg='<strong>Caution zone.</strong> Do not ignore this. You may need to pause, gather more real-world insight, or compare another path.';
  if(interp){interp.innerHTML=msg;interp.classList.add('visible');}
}

/* ===== PHASE 1 — STARTING POSITION SELECTOR ===== */
function selectPosition(opt){
  document.querySelectorAll('#positionOpts .position-opt').forEach(function(o){o.classList.remove('selected');});
  opt.classList.add('selected');
}

/* ===== PHASE 1 — DIRECTION CONFIRM ===== */
function selectDirection(opt,val){
  document.querySelectorAll('.direction-opt').forEach(function(o){o.classList.remove('selected-go','selected-pause');});
  opt.classList.add(val==='go'?'selected-go':'selected-pause');
}

/* ===== PHASE 1 — NEXT-MOVE CHECKPOINT ===== */
function selectNM(opt){
  document.querySelectorAll('.nm-opt').forEach(function(o){o.classList.remove('selected');});
  opt.classList.add('selected');
}

/* ===== PHASE 2 — ENTRY PATH SCORECARD ===== */
var p2scores=[[null,null,null],[null,null,null],[null,null,null],[null,null,null],[null,null,null]];

function p2Score(btn,row,path,val){
  var cell=btn.closest('.p2-sc-cell');
  cell.querySelectorAll('.s-btn').forEach(function(b){b.classList.remove('sel-0','sel-1','sel-2');});
  btn.classList.add('sel-'+val);
  p2scores[row][path]=val;
  p2UpdateTotals();
}

function p2UpdateTotals(){
  var totals=[0,0,0];var counts=[0,0,0];
  for(var r=0;r<5;r++){
    for(var p=0;p<3;p++){
      if(p2scores[r][p]!==null){totals[p]+=p2scores[r][p];counts[p]++;}
    }
  }
  var labels=['p2t0','p2t1','p2t2'];
  var allScored=counts[0]===5&&counts[1]===5&&counts[2]===5;
  for(var p=0;p<3;p++){
    var el=document.getElementById(labels[p]);
    if(el) el.textContent=counts[p]===0?'—':totals[p]+'/'+(counts[p]*2);
  }
  var interp=document.getElementById('p2Interp');
  if(!interp) return;
  if(!allScored){interp.classList.remove('visible');return;}
  var names=['Direct-to-Work','Trade School','Hybrid'];
  var max=Math.max(totals[0],totals[1],totals[2]);
  var winners=names.filter(function(n,i){return totals[i]===max;});
  var msg='<strong>'+winners.join(' / ')+'</strong> scored highest ('+max+'/10). ';
  if(winners.length===1){
    msg+='Examine this path first. If the score feels right, move to the entry path selector and commit.';
  } else {
    msg+='Scores are close — choose based on execution probability and local availability, not just the score.';
  }
  msg+=' Do not treat the highest score as automatic if you know you will not act on it.';
  interp.innerHTML=msg;
  interp.classList.add('visible');
}

/* ===== PHASE 2 — PATH SELECTOR ===== */
function selectP2Path(opt){
  document.querySelectorAll('#p2PathOpts .position-opt').forEach(function(o){o.classList.remove('selected');});
  opt.classList.add('selected');
  var title=opt.querySelector('.position-opt-title').textContent.replace(/^Option [ABC] — /,'');
  var lc=title.charAt(0).toLowerCase()+title.slice(1);
  var el=document.getElementById('p2PathStatement');
  if(el){
    el.style.color='var(--black)';el.style.fontStyle='normal';
    el.textContent='My current entry path is '+lc+'. This is the path I should evaluate before moving into the first-income plan.';
  }
}

/* ===== PHASE 3 — READINESS SCORECARD ===== */
function p3Btn(btn,val){
  var row=btn.closest('.score-row');
  row.querySelectorAll('.s-btn').forEach(function(b){b.classList.remove('sel-0','sel-1','sel-2');});
  btn.classList.add('sel-'+val);
  p3UpdateScore();
}

function p3UpdateScore(){
  var total=0,count=0;
  document.querySelectorAll('#p3Scorecard .score-row').forEach(function(row){
    var sel=row.querySelector('.sel-0,.sel-1,.sel-2');
    if(sel){count++;total+=sel.classList.contains('sel-2')?2:sel.classList.contains('sel-1')?1:0;}
  });
  var el=document.getElementById('p3Score');
  var interp=document.getElementById('p3Interp');
  if(!el) return;
  if(!count){el.textContent='—';if(interp) interp.classList.remove('visible');return;}
  el.textContent=total+'/'+(count*2);
  var pct=total/(count*2);
  var msg='';
  if(pct>=0.81) msg='<strong>Strong action signal (13–16).</strong> You are likely ready to move into outreach and first-income execution.';
  else if(pct>=0.5) msg='<strong>Possible action signal (8–12).</strong> You may be close, but tighten your positioning or identify more realistic targets first.';
  else msg='<strong>Caution zone (0–7).</strong> You are not ready to rely on outreach yet. Revisit Phase 2 and clarify your entry path before pushing forward.';
  if(interp){interp.innerHTML=msg;interp.classList.add('visible');}
}

/* ===== PHASE 3 — PLAN BUILDER ===== */
function selectP3Entry(opt){
  document.querySelectorAll('#p3EntryPath .position-opt').forEach(function(o){o.classList.remove('selected');});
  opt.classList.add('selected');
  p3UpdateStatement();
}

function selectP3Role(opt){
  document.querySelectorAll('#p3FirstRole .position-opt').forEach(function(o){o.classList.remove('selected');});
  opt.classList.add('selected');
  p3UpdateStatement();
}

function selectP3Focus(opt){
  document.querySelectorAll('#p3Focus .position-opt').forEach(function(o){o.classList.remove('selected');});
  opt.classList.add('selected');
  p3UpdateStatement();
}

function p3UpdateStatement(){
  var role=document.querySelector('#p3FirstRole .position-opt.selected');
  var focus=document.querySelector('#p3Focus .position-opt.selected');
  var roleEl=document.getElementById('p3PlanRole');
  var focusEl=document.getElementById('p3PlanFocus');
  if(role&&roleEl) roleEl.textContent=role.querySelector('.position-opt-title').textContent.toLowerCase();
  if(focus&&focusEl) focusEl.textContent=focus.querySelector('.position-opt-title').textContent.toLowerCase();
}

/* ===== PHASE 4 — STABILITY SCORECARD ===== */
function p4Btn(btn,val){
  var row=btn.closest('.score-row');
  row.querySelectorAll('.s-btn').forEach(function(b){b.classList.remove('sel-0','sel-1','sel-2');});
  btn.classList.add('sel-'+val);
  p4UpdateScore();
}

function p4UpdateScore(){
  var total=0,count=0;
  document.querySelectorAll('#p4Scorecard .score-row').forEach(function(row){
    var sel=row.querySelector('.sel-0,.sel-1,.sel-2');
    if(sel){count++;total+=sel.classList.contains('sel-2')?2:sel.classList.contains('sel-1')?1:0;}
  });
  var el=document.getElementById('p4Score');
  var interp=document.getElementById('p4Interp');
  if(!el) return;
  if(!count){el.textContent='—';if(interp) interp.classList.remove('visible');return;}
  el.textContent=total+'/'+(count*2);
  var pct=total/(count*2);
  var msg='';
  if(pct>=0.81) msg='<strong>Strong stability signal (13–16).</strong> You are building the type of reliability that can support better opportunities later.';
  else if(pct>=0.5) msg='<strong>Possible stability signal (8–12).</strong> You may be progressing, but tighten consistency, feedback response, or jobsite habits.';
  else msg='<strong>Caution zone (0–7).</strong> Do not rush to bigger income moves yet. Stabilize the basics first.';
  if(interp){interp.innerHTML=msg;interp.classList.add('visible');}
}

/* ===== PHASE 4 — STRATEGY BUILDER ===== */
var p4ImprovingChoice=null,p4StableChoice=null,p4GrowthChoice=null;

function selectP4(opt,group){
  var ids={improving:'p4Improving',stable:'p4Stable',growth:'p4Growth'};
  document.querySelectorAll('#'+ids[group]+' .position-opt').forEach(function(o){o.classList.remove('selected');});
  opt.classList.add('selected');
  var title=opt.querySelector('.position-opt-title').textContent;
  var lc=title.charAt(0).toLowerCase()+title.slice(1);
  if(group==='improving') p4ImprovingChoice=lc;
  else if(group==='stable') p4StableChoice=lc;
  else if(group==='growth') p4GrowthChoice=lc;
  renderP4Statement();
}

function renderP4Statement(){
  var el=document.getElementById('p4StatementText');
  if(!el) return;
  if(!p4ImprovingChoice||!p4StableChoice||!p4GrowthChoice){
    el.style.color='var(--gray-400)';el.style.fontStyle='italic';
    el.textContent='Select options above to generate your strategy statement.';
  } else {
    el.style.color='var(--black)';el.style.fontStyle='normal';
    el.textContent='My current stability focus is '+p4GrowthChoice+' because I am improving by '+p4ImprovingChoice+' and becoming more stable by '+p4StableChoice+'.';
  }
}

/* ===== PHASE 5 — INCOME EXPANSION SCORECARD ===== */
function p5Btn(btn,val){
  var row=btn.closest('.score-row');
  row.querySelectorAll('.s-btn').forEach(function(b){b.classList.remove('sel-0','sel-1','sel-2');});
  btn.classList.add('sel-'+val);
  p5UpdateScore();
}

function p5UpdateScore(){
  var total=0,count=0;
  document.querySelectorAll('#p5Scorecard .score-row').forEach(function(row){
    var sel=row.querySelector('.sel-0,.sel-1,.sel-2');
    if(sel){count++;total+=sel.classList.contains('sel-2')?2:sel.classList.contains('sel-1')?1:0;}
  });
  var el=document.getElementById('p5Score');
  var interp=document.getElementById('p5Interp');
  if(!el) return;
  if(!count){el.textContent='—';if(interp) interp.classList.remove('visible');return;}
  el.textContent=total+'/'+(count*2);
  var pct=total/(count*2);
  var msg='';
  if(pct>=0.81) msg='<strong>Strong expansion signal (13–16).</strong> You may be ready to plan a smarter income-growth move.';
  else if(pct>=0.5) msg='<strong>Possible expansion signal (8–12).</strong> You may be close, but you need more clarity around lane, skill, employer, or timing first.';
  else msg='<strong>Caution zone (0–7).</strong> Do not rush expansion. Strengthen stability, skill, and positioning before moving.';
  if(interp){interp.innerHTML=msg;interp.classList.add('visible');}
}

/* ===== PHASE 5 — STRATEGY BUILDER ===== */
var p5CeilingChoice=null,p5GrowthChoice=null,p5MoveChoice=null;

function selectP5(opt,group){
  var ids={ceiling:'p5Ceiling',growth:'p5Growth',move:'p5Move'};
  document.querySelectorAll('#'+ids[group]+' .position-opt').forEach(function(o){o.classList.remove('selected');});
  opt.classList.add('selected');
  var title=opt.querySelector('.position-opt-title').textContent;
  var lc=title.charAt(0).toLowerCase()+title.slice(1);
  if(group==='ceiling') p5CeilingChoice=lc;
  else if(group==='growth') p5GrowthChoice=lc;
  else if(group==='move') p5MoveChoice=lc;
  renderP5Statement();
}

function renderP5Statement(){
  var el=document.getElementById('p5StatementText');
  if(!el) return;
  if(!p5CeilingChoice||!p5GrowthChoice||!p5MoveChoice){
    el.style.color='var(--gray-400)';el.style.fontStyle='italic';
    el.textContent='Select options above to generate your strategy statement.';
  } else {
    el.style.color='var(--black)';el.style.fontStyle='normal';
    el.textContent='My next income expansion move should focus on '+p5MoveChoice+' because my current ceiling is being shaped by '+p5CeilingChoice+' and my strongest growth path likely comes from '+p5GrowthChoice+'.';
  }
}

/* ===== PHASE 6 — BUSINESS LAYER SCORECARD ===== */
function p6Btn(btn,val){
  var row=btn.closest('.score-row');
  row.querySelectorAll('.s-btn').forEach(function(b){b.classList.remove('sel-0','sel-1','sel-2');});
  btn.classList.add('sel-'+val);
  p6UpdateScore();
}

function p6UpdateScore(){
  var total=0,count=0;
  document.querySelectorAll('#p6Scorecard .score-row').forEach(function(row){
    var sel=row.querySelector('.sel-0,.sel-1,.sel-2');
    if(sel){count++;total+=sel.classList.contains('sel-2')?2:sel.classList.contains('sel-1')?1:0;}
  });
  var el=document.getElementById('p6Score');
  var interp=document.getElementById('p6Interp');
  if(!el) return;
  if(!count){el.textContent='—';if(interp) interp.classList.remove('visible');return;}
  el.textContent=total+'/'+(count*2);
  var pct=total/(count*2);
  var msg='';
  if(pct>=0.81) msg='<strong>Strong awareness signal (13–16).</strong> You may be ready to study the business layer more seriously while still respecting sequence.';
  else if(pct>=0.5) msg='<strong>Possible awareness signal (8–12).</strong> You understand the opportunity, but need more clarity on requirements, risk, or readiness.';
  else msg='<strong>Caution zone (0–7).</strong> Do not rush independent work or ownership thinking. Strengthen competence, stability, and requirement awareness first.';
  if(interp){interp.innerHTML=msg;interp.classList.add('visible');}
}

/* ===== PHASE 6 — STRATEGY BUILDER ===== */
var p6MeansChoice=null,p6ClosestChoice=null,p6NextMoveChoice=null;

function selectP6(opt,group){
  var ids={means:'p6Means',closest:'p6Closest',nextmove:'p6NextMove'};
  document.querySelectorAll('#'+ids[group]+' .position-opt').forEach(function(o){o.classList.remove('selected');});
  opt.classList.add('selected');
  var title=opt.querySelector('.position-opt-title').textContent;
  var lc=title.charAt(0).toLowerCase()+title.slice(1);
  if(group==='means') p6MeansChoice=lc;
  else if(group==='closest') p6ClosestChoice=lc;
  else if(group==='nextmove') p6NextMoveChoice=lc;
  renderP6Statement();
}

function renderP6Statement(){
  var el=document.getElementById('p6StatementText');
  if(!el) return;
  if(!p6MeansChoice||!p6ClosestChoice||!p6NextMoveChoice){
    el.style.color='var(--gray-400)';el.style.fontStyle='italic';
    el.textContent='Select options above to generate your strategy statement.';
  } else {
    el.style.color='var(--black)';el.style.fontStyle='normal';
    el.textContent='My current business-layer focus should be '+p6NextMoveChoice+' because right now the business layer means '+p6MeansChoice+', and I am closest to '+p6ClosestChoice+'.';
  }
}

/* ===== PHASE 7 — SCALE PATH SCORECARD ===== */
function p7Btn(btn,val){
  var row=btn.closest('.score-row');
  row.querySelectorAll('.s-btn').forEach(function(b){b.classList.remove('sel-0','sel-1','sel-2');});
  btn.classList.add('sel-'+val);
  p7UpdateScore();
}

function p7UpdateScore(){
  var total=0,count=0;
  document.querySelectorAll('#p7Scorecard .score-row').forEach(function(row){
    var sel=row.querySelector('.sel-0,.sel-1,.sel-2');
    if(sel){count++;total+=sel.classList.contains('sel-2')?2:sel.classList.contains('sel-1')?1:0;}
  });
  var el=document.getElementById('p7Score');
  var interp=document.getElementById('p7Interp');
  if(!el) return;
  if(!count){el.textContent='—';if(interp) interp.classList.remove('visible');return;}
  el.textContent=total+'/'+(count*2);
  var pct=total/(count*2);
  var msg='';
  if(pct>=0.81) msg='<strong>Strong scale awareness signal (13–16).</strong> You may be ready to think seriously about the next responsible leverage move.';
  else if(pct>=0.5) msg='<strong>Possible scale awareness signal (8–12).</strong> You understand the idea, but may need more clarity around stage, systems, specialization, or reputation.';
  else msg='<strong>Caution zone (0–7).</strong> Do not chase scale. Strengthen the earlier phases before trying to expand.';
  if(interp){interp.innerHTML=msg;interp.classList.add('visible');}
}

/* ===== PHASE 7 — STRATEGY BUILDER ===== */
var p7SourceChoice=null,p7FormChoice=null,p7MoveChoice=null;

function selectP7(opt,group){
  var ids={source:'p7Source',form:'p7Form',move:'p7Move'};
  document.querySelectorAll('#'+ids[group]+' .position-opt').forEach(function(o){o.classList.remove('selected');});
  opt.classList.add('selected');
  var title=opt.querySelector('.position-opt-title').textContent;
  var lc=title.charAt(0).toLowerCase()+title.slice(1);
  if(group==='source') p7SourceChoice=lc;
  else if(group==='form') p7FormChoice=lc;
  else if(group==='move') p7MoveChoice=lc;
  renderP7Statement();
}

function renderP7Statement(){
  var el=document.getElementById('p7StatementText');
  if(!el) return;
  if(!p7SourceChoice||!p7FormChoice||!p7MoveChoice){
    el.style.color='var(--gray-400)';el.style.fontStyle='italic';
    el.textContent='Select options above to generate your strategy statement.';
  } else {
    el.style.color='var(--black)';el.style.fontStyle='normal';
    el.textContent='My strongest long-term scale path likely comes from '+p7SourceChoice+', the form of scale most realistic for me right now is '+p7FormChoice+', and my next responsible compounding move should focus on '+p7MoveChoice+'.';
  }
}

/* ===== PHASE 7 — FINAL DECISION ===== */
function selectP7Decision(opt){
  document.querySelectorAll('#p7Decision .position-opt').forEach(function(o){o.classList.remove('selected');});
  opt.classList.add('selected');
}

/* ===== PHASE 8 — BUSINESS READINESS SCORECARD ===== */
function p8Btn(btn,val){
  var row=btn.closest('.score-row');
  row.querySelectorAll('.s-btn').forEach(function(b){b.classList.remove('sel-0','sel-1','sel-2');});
  btn.classList.add('sel-'+val);
  p8UpdateScore();
}

function p8UpdateScore(){
  var total=0,count=0;
  document.querySelectorAll('#p8Scorecard .score-row').forEach(function(row){
    var sel=row.querySelector('.sel-0,.sel-1,.sel-2');
    if(sel){count++;total+=sel.classList.contains('sel-2')?2:sel.classList.contains('sel-1')?1:0;}
  });
  var el=document.getElementById('p8Score');
  var interp=document.getElementById('p8Interp');
  if(!el) return;
  if(!count){el.textContent='—';if(interp) interp.classList.remove('visible');return;}
  el.textContent=total+'/'+(count*2);
  var pct=total/(count*2);
  var msg='';
  if(pct>=0.81) msg='<strong>Strong readiness signal (13–16).</strong> You may be ready to evaluate a small, verified, controlled test with full compliance awareness.';
  else if(pct>=0.5) msg='<strong>Possible readiness signal (8–12).</strong> You understand the opportunity but need more preparation around requirements, capital, income protection, or demand creation.';
  else msg='<strong>Caution zone (0–7).</strong> Do not take business action yet. Return to earlier phases and strengthen the foundation before increasing exposure.';
  if(interp){interp.innerHTML=msg;interp.classList.add('visible');}
}

/* ===== PHASE 8 — STRATEGY BUILDER ===== */
var p8RiskChoice=null,p8TestChoice=null,p8MoveChoice=null;

function selectP8(opt,group){
  var ids={risk:'p8Risk',test:'p8Test',move:'p8Move'};
  document.querySelectorAll('#'+ids[group]+' .position-opt').forEach(function(o){o.classList.remove('selected');});
  opt.classList.add('selected');
  var title=opt.querySelector('.position-opt-title').textContent;
  var lc=title.charAt(0).toLowerCase()+title.slice(1);
  if(group==='risk') p8RiskChoice=lc;
  else if(group==='test') p8TestChoice=lc;
  else if(group==='move') p8MoveChoice=lc;
  renderP8Statement();
}

function renderP8Statement(){
  var el=document.getElementById('p8StatementText');
  if(!el) return;
  if(!p8RiskChoice||!p8TestChoice||!p8MoveChoice){
    el.style.color='var(--gray-400)';el.style.fontStyle='italic';
    el.textContent='Select options above to generate your business-readiness statement.';
  } else {
    el.style.color='var(--black)';el.style.fontStyle='normal';
    el.textContent='My next business-readiness move should focus on '+p8MoveChoice+' because my biggest risk is '+p8RiskChoice+', and my first responsible business test should be '+p8TestChoice+'.';
  }
}

/* ===== PHASE 8 — FINAL DECISION ===== */
function selectP8Decision(opt){
  document.querySelectorAll('#p8Decision .position-opt').forEach(function(o){o.classList.remove('selected');});
  opt.classList.add('selected');
}


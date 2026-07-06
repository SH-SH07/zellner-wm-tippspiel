const state = INITIAL_STATE;

function pointsForParticipant(p){
  const f=state.finalTop4||["","","",""];
  const e=new Set(state.eliminated||[]);
  let current=0,max=0,outCount=0;
  p.tips.forEach((team,i)=>{
    const out=e.has(team);
    const exact=f[i]&&f[i]===team;
    const inTop=f.includes(team);
    if(out) outCount++;
    if(exact) current+=2;
    if(inTop) current+=1;
    if(exact){max+=2}else if(!f[i]&&!out){max+=2}
    if(inTop){max+=1}else if(!out&&f.some(x=>!x)){max+=1}
  });
  return{current,max,outCount}
}

function statusText(c){
  if(c.max===0)return"Keine Chance mehr";
  if(c.outCount>0)return`${c.outCount} Tipp(s) raus`;
  return"Alle Tipps im Rennen";
}

function competitionRanks(rows){
  let prevCurrent=null, prevMax=null, prevRank=0;
  return rows.map((row,index)=>{
    if(row.current===prevCurrent && row.max===prevMax){
      row.rank=prevRank;
    }else{
      row.rank=index+1;
      prevRank=row.rank;
      prevCurrent=row.current;
      prevMax=row.max;
    }
    return row;
  });
}

function render(){
  document.getElementById("participantCount").textContent=PARTICIPANTS.length;
  document.getElementById("eliminatedCount").textContent=(state.eliminated||[]).length;

  let ranking=PARTICIPANTS
    .map(p=>({...p,...pointsForParticipant(p)}))
    .sort((a,b)=>b.current-a.current||b.max-a.max||a.name.localeCompare(b.name));
  ranking=competitionRanks(ranking);

  const rb=document.querySelector("#rankingTable tbody");
  rb.innerHTML="";
  ranking.forEach(p=>{
    const tr=document.createElement("tr");
    if(p.rank===1)tr.className="rank-1";
    if(p.rank===2)tr.className="rank-2";
    if(p.rank===3)tr.className="rank-3";
    tr.innerHTML=`<td>${p.rank}</td><td>${p.name}</td><td>${p.current}</td><td>${p.max}</td><td><span class="badge ${p.outCount?"out":"ok"}">${statusText(p)}</span></td>`;
    rb.appendChild(tr);
  });

  const tb=document.querySelector("#tipsTable tbody");
  tb.innerHTML="";
  PARTICIPANTS.forEach(p=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td><strong>${p.name}</strong></td>${p.tips.map(t=>`<td>${t}${state.eliminated.includes(t)?" ❌":""}</td>`).join("")}`;
    tb.appendChild(tr);
  });
}
render();
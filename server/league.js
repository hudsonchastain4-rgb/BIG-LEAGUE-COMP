export const trackTargets={water:80,steps:8000};
export const trackedValue=(s,id,date,category)=>{const saved=s.progress?.[`${id}|${date}`]?.[category];return Number.isSafeInteger(saved)&&saved>=0?saved:(s.logs?.[`${id}|${date}`]?.[category]?trackTargets[category]:0);};
export const categories=[{id:'workout',name:'Workout',detail:'30 minutes of intentional exercise'},{id:'reading',name:'Reading',detail:'15 minutes of reading'},{id:'water',name:'Hydration',detail:'80 oz. of water'},{id:'nutrition',name:'Nutrition',detail:'Weekly personal nutrition goal'},{id:'steps',name:'Steps',detail:'8,000 steps'}];
export const addDays=(d,n)=>new Date(Date.parse(d+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
export const clock=(now=new Date())=>{const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x=>[x.type,x.value]));return {day:`${p.year}-${p.month}-${p.day}`,hour:+p.hour};};
export const weekOf=(start,date)=>Math.floor((Date.parse(date)-Date.parse(start))/604800000)+1;
export const monday=(s,w)=>addDays(s.start,(w-1)*7);
export const closed=(s,w,t)=>{const end=monday(s,w+1);return t.day>end||(t.day===end&&t.hour>=12);};
export const editable=(s,date,t)=>date>=s.start&&date< monday(s,s.weeks+1)&&date<=t.day&&(date===t.day||(date===addDays(t.day,-1)&&t.hour<12));
export function roundRobin(ids,round){let a=[...ids];if(a.length%2)a.push(null);if(a.length<2)return [];for(let i=0;i<(round-1)%(a.length-1);i++)a=[a[0],a.at(-1),...a.slice(1,-1)];return Array.from({length:a.length/2},(_,i)=>[a[i],a[a.length-1-i]].filter(Boolean));}
export function goalFor(s,id,w){for(let i=w;i>=1;i--){const g=s.goals[`${id}|${i}`];if(g)return g;}return '';}
export function compute(s,t=clock()){
 const practice=s.practiceWeeks||0, official=monday(s,practice+1), testing=practice>0&&t.day<official;const counted=w=>testing?w<=practice:w>practice;
 const players=s.players.filter(p=>!p.archived||Object.keys(s.logs).some(k=>k.startsWith(p.id+'|'))||Object.values(s.schedule).some(pairs=>pairs.some(pair=>pair.includes(p.id))));
 const byWeek={}, rows=players.map(p=>({...p,counts:Object.fromEntries(categories.map(c=>[c.id,0])),raw:0,bonus:0,total:0,wins:0,losses:0,ties:0,mvps:0,perfect:0,longest:0}));const byId=Object.fromEntries(rows.map(r=>[r.id,r]));
 const score=(id,w)=>byWeek[w]?.[id]?.raw||0;
 for(const [key,vals] of Object.entries(s.logs)){const [id,date]=key.split('|'),r=byId[id],w=weekOf(s.start,date);if(!r||w<1||w>s.weeks||date>t.day)continue;const b=(byWeek[w]??={})[id]??={raw:0,counts:Object.fromEntries(categories.map(c=>[c.id,0]))};let sum=0;for(const c of categories)if(vals[c.id]){if(counted(w))r.counts[c.id]++;b.counts[c.id]++;sum++;}if(counted(w)){r.raw+=sum;if(sum===categories.length)r.perfect++;}b.raw+=sum;}
 for(const r of rows){let run=0;for(let d=testing?s.start:official;d<=t.day&&d<monday(s,s.weeks+1);d=addDays(d,1)){if(categories.every(c=>s.logs[`${r.id}|${d}`]?.[c.id])){run++;r.longest=Math.max(run,r.longest);}else run=0;}}
 const rank=()=>[...rows].sort((a,b)=>(b.wins+b.ties/2)/(b.wins+b.losses+b.ties||1)-(a.wins+a.ties/2)/(a.wins+a.losses+a.ties||1)||b.rawRegular-a.rawRegular||a.name.localeCompare(b.name)||a.id.localeCompare(b.id));
 const weeks=[];let seeds=[],champion=null;const regular=s.weeks-2;
 for(let w=1;w<=s.weeks;w++){
  const eligible=players.filter(p=>p.joinWeek<=w&&(!p.exitWeek||p.exitWeek>w)).map(p=>p.id);const final=closed(s,w,t);let pairs,phase=w<=practice?'Preseason':'Regular season';
  if(w<=regular){pairs=s.schedule[w]||roundRobin(eligible,w<=practice?w:w-practice);}
  else if(w===regular+1){phase='Semifinals';if(closed(s,regular,t)){seeds=rank().filter(r=>eligible.includes(r.id)).slice(0,4).map(r=>r.id);pairs=seeds.length>=4?[[seeds[0],seeds[3]],[seeds[1],seeds[2]]]:[];}else pairs=[];}
  else{phase='Championship';if(closed(s,w-1,t)){if(seeds.length>=4){pairs=[weeks[w-2].matches.map(m=>m.winner).filter(Boolean)];}else if(seeds.length>=2)pairs=[seeds.slice(0,2)];else pairs=[];}else pairs=[];}
  if(w>regular&&s.schedule[w])pairs=s.schedule[w];
  const matches=pairs.map(pair=>{const [a,b]=pair,sa=score(a,w),sb=score(b,w);let winner=null;if(b&&final){if(sa!==sb)winner=sa>sb?a:b;else if(w>regular)winner=seeds.indexOf(a)<=seeds.indexOf(b)?a:b; if(w<=regular&&counted(w)&&byId[a]&&byId[b]){if(!winner){byId[a].ties++;byId[b].ties++;}else{byId[winner].wins++;byId[winner===a?b:a].losses++;}}}return {a,b:b||null,sa,sb,winner,tie:!!b&&final&&sa===sb};});
  let mvp=[];if(final&&eligible.length){const max=Math.max(...eligible.map(id=>score(id,w)));if(max>0)mvp=eligible.filter(id=>score(id,w)===max);if(counted(w))for(const id of mvp){byId[id].bonus+=5;byId[id].mvps++;}}
  weeks.push({w,start:monday(s,w),end:addDays(monday(s,w),6),phase,final,matches,mvp,eligible});
  if(w===regular)for(const r of rows)r.rawRegular=Array.from({length:regular-practice},(_,i)=>score(r.id,i+practice+1)).reduce((a,b)=>a+b,0);
  if(w===s.weeks&&final)champion=matches[0]?.winner||null;
 }
 for(const r of rows){r.total=r.raw+r.bonus;r.days=Math.max(0,Math.min(s.weeks*7,(Date.parse(t.day)-Date.parse(monday(s,Math.max(r.joinWeek,testing?1:practice+1))))/86400000+1,(r.exitWeek?r.exitWeek-Math.max(r.joinWeek,testing?1:practice+1):s.weeks-Math.max(r.joinWeek,testing?1:practice+1)+1)*7));}
 return {testing,officialStart:official,rows:rows.sort((a,b)=>b.total-a.total||b.raw-a.raw||a.name.localeCompare(b.name)),recordRank:rank().map(r=>r.id),weeks,byWeek,champion,seeds};
}
export function newSeason(start='2027-01-04',weeks=52){return {start,weeks,players:[],logs:{},progress:{},goals:{},schedule:{},settings:{},audit:[]};}

export function launchSeason(s){
 if(s.practiceWeeks!==undefined||s.start!=='2027-01-04')return false;
 // Existing future-week commitments and roster remain intact.
 s.start='2026-11-16';s.practiceWeeks=2;s.weeks=54;
 const oldGoals=s.goals;s.goals={};for(const [key,value] of Object.entries(oldGoals)){const [id,w]=key.split('|');s.goals[`${id}|${Number(w)+2}`]=value;}
 const oldSchedule=s.schedule;s.schedule={};for(const [w,pairs] of Object.entries(oldSchedule))s.schedule[Number(w)+2]=pairs;
 for(const p of s.players){if(p.joinWeek>1)p.joinWeek+=2;if(p.exitWeek)p.exitWeek+=2;}
 return true;
}

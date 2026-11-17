import {addDays,categories,trackedValue} from './league.js';
// Weekly recognition only: does not modify activity scores, matchups or MVP bonuses.
export const titles={workout:'Workout Warrior',reading:'Bookworm',water:'Hydration Hero',nutrition:'Nutrition Champion',steps:'Step King'};
export function weeklySuperlatives(s,computed,nowDay){
 return computed.weeks.map(week=>{
  const awards=categories.map(category=>{
   const entries=week.eligible.map(id=>{
    let completed=0,quantity=0;
    for(let i=0;i<7;i++){
     const day=addDays(week.start,i);
     if(day>nowDay)continue;
     if(s.logs[`${id}|${day}`]?.[category.id])completed++;
     if(category.id==='steps'||category.id==='water')quantity+=trackedValue(s,id,day,category.id);
    }
    return {id,completed,quantity};
   });
   const useQuantity=category.id==='steps'||category.id==='water';
   // Steps and water are ranked by cumulative logged quantity, with completed days as tie-break.
   entries.sort((a,b)=>(useQuantity?b.quantity-a.quantity:0)||b.completed-a.completed||a.id.localeCompare(b.id));
   const top=entries[0],metric=top?(useQuantity?top.quantity:top.completed):0;
   const leaders=metric>0?entries.filter(e=>(useQuantity?e.quantity===metric&&e.completed===top.completed:e.completed===metric)).map(e=>e.id):[];
   return {category:category.id,title:titles[category.id],leaders,metric,completed:top?.completed||0,unit:category.id==='steps'?'steps':category.id==='water'?'oz':'days',ranked:entries};
  });
  return {week:week.w,start:week.start,end:week.end,final:week.final,phase:week.phase,awards};
 });
}

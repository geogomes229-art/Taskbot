export default async function handler(req,res){
res.setHeader('Access-Control-Allow-Origin','*');
if(req.method==='OPTIONS')return res.status(200).end();
if(req.method!=='POST')return res.status(405).end();
const{x_auth_key,room_code,lesson_id,draft,lesson_info,time_spent,answer_id,target_score}=req.body;
if(!x_auth_key||!room_code||!lesson_id)return res.json({status:'error',message:'Parametros ausentes'});
try{
const answers=[];
(lesson_info?.apply?.questions||[]).forEach(q=>{
const correct=(q.choices||[]).filter(c=>c.is_correct);
const sel=correct.length?correct:[(q.choices||[])[0]].filter(Boolean);
if(q.question_type!=='essay')answers.push({question_id:q.id,choice_ids:sel.map(c=>c.id)});
});
const body=JSON.stringify({answers,time_spent,finished:true});
const headers={'Content-Type':'application/json','x-api-key':x_auth_key};
const base='https://edusp-api.ip.tv';
const url=draft||!answer_id
?`\({base}/tms/task/\){lesson_id}/answer/?room_code=${room_code}`
:`\({base}/tms/task/\){lesson_id}/answer/\({answer_id}/?room_code=\){room_code}`;
const r=await fetch(url,{method:draft||!answer_id?'POST':'PUT',headers,body});
const data=await r.json();
res.json({status:'success',data});
}catch(err){res.json({status:'error',message:err.message});}}

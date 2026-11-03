const $=id=>document.getElementById(id),KEY="creatorflow.projects.v1";let projects=read(),active=null,scenes=[{name:"Opening hook"},{name:"Main point"},{name:"Payoff and CTA"}];
const ideas={"AI & Technology":["5 AI tools that can save you an hour every day","What happens when AI agents work together?","3 beginner AI mistakes — and how to fix them","How large language models work, explained simply"],"Business & Money":["A one-page business plan for a first-time founder","Why small businesses need a cash-flow system","5 skills that create value before you spend money","How to validate a business idea before building"],"Motivation":["A 10-minute reset for days when you feel stuck","Stop waiting for motivation: build a tiny daily system","The compound effect of improving one percent","How to make progress when you have almost no time"],"Education & Facts":["The Feynman technique explained simply","3 everyday science facts that sound impossible","How memory works: learn more by testing yourself","A beginner's guide to critical thinking"],"History & Stories":["An invention that changed communication","A turning point that shaped the modern world","The rise and fall of a famous ancient city","How one idea changed an industry"],"Health & Fitness":["A beginner's guide to a walking habit","Why recovery matters as much as exercise","How to make a realistic weekly fitness plan","Common fitness myths worth checking"],"Animals & Nature":["How migratory birds navigate","Why octopuses are remarkable problem-solvers","The hidden teamwork inside an ecosystem","How animals adapt to extreme environments"]};
function read(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return []}}function notify(s){let t=$("toast");t.textContent=s;t.classList.add("show");clearTimeout(notify.timer);notify.timer=setTimeout(()=>t.classList.remove("show"),2200)}function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function go(v){document.querySelectorAll(".view").forEach(x=>x.classList.toggle("active",x.id===v));document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.view===v));$("crumb").textContent="Workspace / "+v[0].toUpperCase()+v.slice(1);document.querySelector(".sidebar").classList.remove("open");scrollTo(0,0)}
document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>go(b.dataset.view));document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));$("menu").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
function render(){ $("count").textContent=projects.length;let host=$("projects");host.innerHTML=projects.length?projects.map(p=>'<div class="project"><div><strong>'+esc(p.title||"Untitled project")+'</strong><small>'+esc(p.format)+' · '+new Date(p.updatedAt).toLocaleDateString()+'</small></div><button data-open="'+p.id+'">Open →</button></div>').join():'<p class="empty">No projects yet. Create your first project to get started.</p>';host.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>open(b.dataset.open))}
function fresh(){active={id:crypto.randomUUID(),title:"",format:"Shorts",script:"",scenes:scenes.map(s=>({...s})),voice:"",music:"",updatedAt:new Date().toISOString()};$("title").value="";$("script-text").value="";$("script-format").value="Shorts";$("voice").value="";$("music").value="";scenes=active.scenes.map(s=>({...s}));renderScenes();go("script");notify("New project ready")}
function open(id){let p=projects.find(x=>x.id===id);if(!p)return;active=JSON.parse(JSON.stringify(p));$("title").value=p.title;$("script-format").value=p.format;$("script-text").value=p.script;$("voice").value=p.voice||"";$("music").value=p.music||"";scenes=p.scenes||[];renderScenes();countWords();go("script")}
function save(){if(!active)fresh();active.title=$("title").value.trim()||"Untitled project";active.format=$("script-format").value;active.script=$("script-text").value;active.scenes=scenes.map(s=>({...s}));active.voice=$("voice").value;active.music=$("music").value;active.updatedAt=new Date().toISOString();let i=projects.findIndex(p=>p.id===active.id);if(i<0)projects.unshift(active);else projects[i]=active;localStorage.setItem(KEY,JSON.stringify(projects));render();if(cloudClient&&cloudUser){void saveCloudProject(active)}notify(cloudUser?"Saved on this device and syncing to cloud":"Saved on this device")}
$("new").onclick=fresh;$("suggest").onclick=()=>{let list=ideas[$("niche").value]||ideas["AI & Technology"],aud=$("audience").value.trim();$("ideas-list").innerHTML=list.map((s,i)=>'<article class="idea-card"><small>'+esc($("niche").value)+'</small><h3>'+esc(s)+'</h3><p>'+(aud?"Audience: "+esc(aud)+". ":"")+"Idea starter — check demand and verify facts before publishing."+'</p><button data-idea="'+i+'">Use this idea →</button></article>').join();$("ideas-list").querySelectorAll("[data-idea]").forEach(b=>b.onclick=()=>{fresh();$("title").value=list[Number(b.dataset.idea)];$("script-format").value=$("format").value})};
$("outline").onclick=()=>{let title=$("title").value||"Your video topic",short=$("script-format").value==="Shorts";$("script-text").value=short?"[HOOK — 0–3s]\n"+title+": here's what most people miss.\n\n[SETUP]\nExplain why this matters.\n\n[MAIN VALUE]\n1. Share the first key point.\n2. Give a concrete example.\n3. Offer one useful action.\n\n[PAYOFF]\nSummarise the lesson in one memorable line.\n\n[CALL TO ACTION]\nAsk one relevant question.\n\n[WRITER NOTE]\nVerify factual claims and add source links.":"[COLD OPEN]\nLead with a question, problem or surprising verified result about "+title+".\n\n[INTRODUCTION]\nExplain what viewers will learn and why it matters.\n\n[SECTION 1 — CONTEXT]\nGive background and a clear example.\n\n[SECTION 2 — CORE IDEAS]\nExplain 2–4 key points with evidence and examples.\n\n[SECTION 3 — PRACTICAL TAKEAWAY]\nShow how viewers can apply the information.\n\n[CONCLUSION]\nSummarise the lesson and add one call to action.\n\n[WRITER NOTE]\nTone: "+$("tone").value+". Verify claims and add source links.";countWords();notify("Script structure inserted — edit it freely")};
function countWords(){$("words").textContent=$("script-text").value.trim().split(/\s+/).filter(Boolean).length+" words"}$("script-text").oninput=countWords;$("save").onclick=save;
function renderScenes(){$("scenes").innerHTML=scenes.map((s,i)=>'<div class="scene"><b>'+String(i+1).padStart(2,"0")+'</b><input data-scene="'+i+'" value="'+esc(s.name)+'" aria-label="Scene name"><button data-del="'+i+'" aria-label="Remove scene">×</button></div>').join();$("scenes").querySelectorAll("[data-scene]").forEach(x=>x.oninput=()=>scenes[Number(x.dataset.scene)].name=x.value);$("scenes").querySelectorAll("[data-del]").forEach(x=>x.onclick=()=>{scenes.splice(Number(x.dataset.del),1);renderScenes()})}
$("add-scene").onclick=()=>{scenes.push({name:"New scene"});renderScenes()};$("save-plan").onclick=save;
function current(){if(!active&&$("title").value.trim())save();return active}function brief(){let p=current();if(!p)return "No project saved yet.";return "CREATORFLOW AI — PROJECT BRIEF\nTitle: "+p.title+"\nFormat: "+p.format+"\n\nSCRIPT\n"+p.script+"\n\nSCENES\n"+p.scenes.map((s,i)=>(i+1)+". "+s.name).join("\n")+"\n\nVOICEOVER\n"+p.voice+"\n\nAUDIO NOTES\n"+p.music+"\n\nStatus: planning brief only; no video has been rendered."}
$("json").onclick=()=>{let p=current();if(!p){notify("Create a project first");return}let u=URL.createObjectURL(new Blob([JSON.stringify(p,null,2)],{type:"application/json"})),a=document.createElement("a");a.href=u;a.download="creatorflow-project.json";a.click();URL.revokeObjectURL(u);notify("Project JSON downloaded")};
$("copy").onclick=async()=>{try{await navigator.clipboard.writeText(brief());notify("Project brief copied")}catch(e){notify("Clipboard unavailable — use JSON download")}};
$("export").addEventListener("click",()=>{let p=current();$("summary").textContent=p?"Title: "+p.title+"\nFormat: "+p.format+"\nScript words: "+p.script.trim().split(/\s+/).filter(Boolean).length+"\nPlanned scenes: "+p.scenes.length+"\nSaved locally: yes\nRendered video: no — rendering is planned.":"Create or save a project to prepare your package."});
render();renderScenes();countWords();if("serviceWorker"in navigator&&location.protocol.startsWith("http"))addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));

// Optional Supabase cloud account and private project sync.
const cloudConfig=window.CREATORFLOW_CONFIG||{};
let cloudClient=null,cloudUser=null;
const authDialog=$("auth-dialog"),authStatus=$("auth-status"),accountButton=$("account-btn");
function authMessage(message,isError=false){authStatus.textContent=message;authStatus.classList.toggle("error",isError)}
function updateAccountUI(){
  if(cloudUser){accountButton.textContent=cloudUser.email||"Cloud account";$("mode-label").textContent="● CLOUD SYNC";$("auth-signout").hidden=false;$("auth-sync-local").hidden=false;$("auth-signin").hidden=true;$("auth-signup").hidden=true;authMessage("Signed in as "+(cloudUser.email||"your account")+". Your cloud projects are private to your account.");}
  else{accountButton.textContent=cloudClient?"Sign in / Sync":"Local mode";$("mode-label").textContent="● "+(cloudClient?"LOCAL MODE":"LOCAL ONLY");$("auth-signout").hidden=true;$("auth-sync-local").hidden=true;$("auth-signin").hidden=false;$("auth-signup").hidden=false;}
}
async function saveCloudProject(project){
  if(!cloudClient||!cloudUser||!project)return;
  const row={id:project.id,owner_id:cloudUser.id,title:project.title||"Untitled project",format:project.format||"Shorts",project_data:project,updated_at:project.updatedAt||new Date().toISOString()};
  const {error}=await cloudClient.from("creator_projects").upsert(row,{onConflict:"id"});
  if(error){notify("Local save succeeded; cloud sync failed");console.error("CreatorFlow cloud save:",error.message);}
}
async function loadCloudProjects(){
  if(!cloudClient||!cloudUser)return;
  const {data,error}=await cloudClient.from("creator_projects").select("id,title,format,project_data,updated_at").order("updated_at",{ascending:false});
  if(error){authMessage("Cloud projects could not load: "+error.message,true);return;}
  const byId=new Map(projects.map(p=>[p.id,p]));
  for(const row of (data||[])){byId.set(row.id,{...(row.project_data||{}),id:row.id,title:row.title,format:row.format,updatedAt:row.updated_at});}
  projects=Array.from(byId.values()).sort((a,b)=>new Date(b.updatedAt||0)-new Date(a.updatedAt||0));
  localStorage.setItem(KEY,JSON.stringify(projects));render();
}
async function syncLocalProjects(){
  if(!cloudClient||!cloudUser)return;
  const local=projects.filter(p=>p&&p.id);
  if(!local.length){authMessage("There are no local projects to upload.");return;}
  if(!confirm("Upload "+local.length+" local project(s) to your private cloud workspace?"))return;
  $("auth-sync-local").disabled=true;
  let failures=0;
  for(const project of local){const {error}=await cloudClient.from("creator_projects").upsert({id:project.id,owner_id:cloudUser.id,title:project.title||"Untitled project",format:project.format||"Shorts",project_data:project,updated_at:project.updatedAt||new Date().toISOString()},{onConflict:"id"});if(error)failures++;}
  $("auth-sync-local").disabled=false;
  authMessage(failures?"Upload finished with "+failures+" error(s). Check your database schema and RLS.":"All "+local.length+" local project(s) uploaded to your private cloud workspace.",!!failures);
  if(!failures)notify("Local projects synced");
  await loadCloudProjects();
}
async function initCloud(){
  const url=String(cloudConfig.supabaseUrl||"").trim(),key=String(cloudConfig.supabaseAnonKey||"").trim();
  if(!url||!key||!window.supabase?.createClient){authMessage("Cloud sync is not configured yet. Local planning and exports are available without an account.");updateAccountUI();return;}
  try{cloudClient=window.supabase.createClient(url,key);const {data,error}=await cloudClient.auth.getSession();if(error)throw error;cloudUser=data.session?.user||null;updateAccountUI();if(cloudUser)await loadCloudProjects();
    cloudClient.auth.onAuthStateChange((_event,session)=>{cloudUser=session?.user||null;updateAccountUI();if(cloudUser)void loadCloudProjects();});
  }catch(error){cloudClient=null;authMessage("Cloud setup error: "+error.message,true);updateAccountUI();}
}
accountButton.onclick=()=>{if(authDialog?.showModal)authDialog.showModal();else notify("Please use a modern browser for account access")};
$("auth-close").onclick=()=>authDialog.close();
$("auth-form").onsubmit=async event=>{event.preventDefault();if(!cloudClient){authMessage("Cloud is not configured. Ask the site administrator to finish Supabase setup.",true);return;}
  const email=$("auth-email").value.trim(),password=$("auth-password").value;
  $("auth-signin").disabled=true;
  const {data,error}=await cloudClient.auth.signInWithPassword({email,password});
  $("auth-signin").disabled=false;
  if(error){authMessage(error.message,true);return;}
  cloudUser=data.user;updateAccountUI();await loadCloudProjects();authMessage("Signed in. Your private cloud projects are ready.");notify("Signed in successfully");
};
$("auth-signup").onclick=async()=>{if(!cloudClient){authMessage("Cloud is not configured yet. Local mode remains available.",true);return;}
  const email=$("auth-email").value.trim(),password=$("auth-password").value;
  if(!email||password.length<8){authMessage("Enter a valid email and a password of at least 8 characters.",true);return;}
  const {data,error}=await cloudClient.auth.signUp({email,password,options:{emailRedirectTo:location.href.split("#")[0]}});
  if(error){authMessage(error.message,true);return;}
  if(data.session){cloudUser=data.user;updateAccountUI();await loadCloudProjects();authMessage("Account created and signed in.");}
  else authMessage("Account created. Check your email for the verification link, then sign in.");
};
$("auth-reset").onclick=async()=>{if(!cloudClient){authMessage("Cloud is not configured yet.",true);return;}
  const email=$("auth-email").value.trim();if(!email){authMessage("Enter your email address first.",true);return;}
  const {error}=await cloudClient.auth.resetPasswordForEmail(email,{redirectTo:location.href.split("#")[0]});
  authMessage(error?error.message:"If this email has an account, a password reset link has been sent.",!!error);
};
$("auth-signout").onclick=async()=>{if(!cloudClient)return;const {error}=await cloudClient.auth.signOut();if(error){authMessage(error.message,true);return;}cloudUser=null;updateAccountUI();notify("Signed out");};
$("auth-sync-local").onclick=()=>void syncLocalProjects();
void initCloud();

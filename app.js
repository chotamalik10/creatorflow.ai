const $=id=>document.getElementById(id),KEY="creatorflow.projects.v1";let projects=read(),active=null,scenes=[{name:"Opening hook",visual:"",narration:"",duration:5},{name:"Main point",visual:"",narration:"",duration:8},{name:"Payoff and CTA",visual:"",narration:"",duration:5}];
function newId(){
  if(window.crypto?.randomUUID)return window.crypto.randomUUID();
  const bytes=new Uint8Array(16);
  if(window.crypto?.getRandomValues)window.crypto.getRandomValues(bytes);
  else for(let i=0;i<bytes.length;i++)bytes[i]=Math.floor(Math.random()*256);
  bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
  const h=Array.from(bytes,b=>b.toString(16).padStart(2,"0"));
  return h.slice(0,4).join("")+"-"+h.slice(4,6).join("")+"-"+h.slice(6,8).join("")+"-"+h.slice(8,10).join("")+"-"+h.slice(10).join("");
}
const ideas={"AI & Technology":["5 AI tools that can save you an hour every day","What happens when AI agents work together?","3 beginner AI mistakes — and how to fix them","How large language models work, explained simply"],"Business & Money":["A one-page business plan for a first-time founder","Why small businesses need a cash-flow system","5 skills that create value before you spend money","How to validate a business idea before building"],"Motivation":["A 10-minute reset for days when you feel stuck","Stop waiting for motivation: build a tiny daily system","The compound effect of improving one percent","How to make progress when you have almost no time"],"Education & Facts":["The Feynman technique explained simply","3 everyday science facts that sound impossible","How memory works: learn more by testing yourself","A beginner's guide to critical thinking"],"History & Stories":["An invention that changed communication","A turning point that shaped the modern world","The rise and fall of a famous ancient city","How one idea changed an industry"],"Health & Fitness":["A beginner's guide to a walking habit","Why recovery matters as much as exercise","How to make a realistic weekly fitness plan","Common fitness myths worth checking"],"Animals & Nature":["How migratory birds navigate","Why octopuses are remarkable problem-solvers","The hidden teamwork inside an ecosystem","How animals adapt to extreme environments"]};
function read(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return []}}function notify(s){let t=$("toast");t.textContent=s;t.classList.add("show");clearTimeout(notify.timer);notify.timer=setTimeout(()=>t.classList.remove("show"),2200)}function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function go(v){document.querySelectorAll(".view").forEach(x=>x.classList.toggle("active",x.id===v));document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.view===v));$("crumb").textContent="Workspace / "+v[0].toUpperCase()+v.slice(1);document.querySelector(".sidebar").classList.remove("open");if(v==="export")updateExportSummary();scrollTo(0,0)}
document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>go(b.dataset.view));document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));$("menu").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
function render(){ $("count").textContent=projects.length;let host=$("projects");host.innerHTML=projects.length?projects.map(p=>'<div class="project"><div><strong>'+esc(p.title||"Untitled project")+'</strong><small>'+esc(p.format)+' · '+new Date(p.updatedAt).toLocaleDateString()+'</small></div><button data-open="'+p.id+'">Open →</button></div>').join():'<p class="empty">No projects yet. Create your first project to get started.</p>';host.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>open(b.dataset.open))}
function fresh(){active={id:newId(),title:"",format:"Shorts",script:"",scenes:scenes.map(s=>({...s})),voice:"",music:"",voiceover:"",captions:"",updatedAt:new Date().toISOString()};$("title").value="";$("script-text").value="";$("script-format").value="Shorts";$("voice").value="";$("music").value="";$("voiceover-text").value="";$("captions-text").value="";scenes=active.scenes.map(s=>({...s}));renderScenes();go("script");notify("New project ready")}
function open(id){let p=projects.find(x=>x.id===id);if(!p)return;active=JSON.parse(JSON.stringify(p));$("title").value=p.title;$("script-format").value=p.format;$("script-text").value=p.script;$("voice").value=p.voice||"";$("music").value=p.music||"";$("voiceover-text").value=p.voiceover||p.script||"";$("captions-text").value=p.captions||"";scenes=p.scenes||[];renderScenes();countWords();go("script")}
function save(){if(!active)active={id:newId(),title:"",format:"Shorts",script:"",scenes:[],voice:"",music:"",voiceover:"",captions:"",updatedAt:new Date().toISOString()};active.title=$("title").value.trim()||"Untitled project";active.format=$("script-format").value;active.script=$("script-text").value;active.scenes=scenes.map(s=>({...s}));active.voice=$("voice").value;active.music=$("music").value;active.voiceover=$("voiceover-text").value;active.captions=$("captions-text").value;active.updatedAt=new Date().toISOString();let i=projects.findIndex(p=>p.id===active.id);if(i<0)projects.unshift(active);else projects[i]=active;localStorage.setItem(KEY,JSON.stringify(projects.filter(p=>!cloudProjectIds.has(p.id))));render();if(cloudClient&&cloudUser){void saveCloudProject(active)}notify(cloudUser?"Saved and syncing to cloud":"Saved on this device")}
$("new").onclick=fresh;$("suggest").onclick=()=>{let list=ideas[$("niche").value]||ideas["AI & Technology"],aud=$("audience").value.trim();$("ideas-list").innerHTML=list.map((s,i)=>'<article class="idea-card"><small>'+esc($("niche").value)+'</small><h3>'+esc(s)+'</h3><p>'+(aud?"Audience: "+esc(aud)+". ":"")+"Idea starter — check demand and verify facts before publishing."+'</p><button data-idea="'+i+'">Use this idea →</button></article>').join();$("ideas-list").querySelectorAll("[data-idea]").forEach(b=>b.onclick=()=>{fresh();$("title").value=list[Number(b.dataset.idea)];$("script-format").value=$("format").value})};
$("outline").onclick=()=>{let title=$("title").value||"Your video topic",short=$("script-format").value==="Shorts";$("script-text").value=short?"[HOOK — 0–3s]\n"+title+": here's what most people miss.\n\n[SETUP]\nExplain why this matters.\n\n[MAIN VALUE]\n1. Share the first key point.\n2. Give a concrete example.\n3. Offer one useful action.\n\n[PAYOFF]\nSummarise the lesson in one memorable line.\n\n[CALL TO ACTION]\nAsk one relevant question.\n\n[WRITER NOTE]\nVerify factual claims and add source links.":"[COLD OPEN]\nLead with a question, problem or surprising verified result about "+title+".\n\n[INTRODUCTION]\nExplain what viewers will learn and why it matters.\n\n[SECTION 1 — CONTEXT]\nGive background and a clear example.\n\n[SECTION 2 — CORE IDEAS]\nExplain 2–4 key points with evidence and examples.\n\n[SECTION 3 — PRACTICAL TAKEAWAY]\nShow how viewers can apply the information.\n\n[CONCLUSION]\nSummarise the lesson and add one call to action.\n\n[WRITER NOTE]\nTone: "+$("tone").value+". Verify claims and add source links.";countWords();notify("Script structure inserted — edit it freely")};
function countWords(){$("words").textContent=$("script-text").value.trim().split(/\s+/).filter(Boolean).length+" words"}$("script-text").oninput=countWords;$("save").onclick=save;
function renderScenes(){
  $("scenes").innerHTML=scenes.map((s,i)=>'<article class="scene-card"><div class="scene-head"><b>SCENE '+String(i+1).padStart(2,"0")+'</b><button data-del="'+i+'" aria-label="Remove scene">Remove ×</button></div><label>Scene title</label><input data-scene-name="'+i+'" value="'+esc(s.name||"")+'" placeholder="e.g. Opening hook"><label>What viewers see</label><textarea data-scene-visual="'+i+'" rows="2" placeholder="Describe the shot, footage or image needed">'+esc(s.visual||"")+'</textarea><label>Spoken narration</label><textarea data-scene-narration="'+i+'" rows="2" placeholder="Narration for this scene">'+esc(s.narration||"")+'</textarea><label>Duration (seconds)</label><input data-scene-duration="'+i+'" type="number" min="1" max="60" value="'+Number(s.duration||5)+'"></article>').join("");
  $("scenes").querySelectorAll("[data-scene-name]").forEach(x=>x.oninput=()=>scenes[Number(x.dataset.sceneName)].name=x.value);
  $("scenes").querySelectorAll("[data-scene-visual]").forEach(x=>x.oninput=()=>scenes[Number(x.dataset.sceneVisual)].visual=x.value);
  $("scenes").querySelectorAll("[data-scene-narration]").forEach(x=>x.oninput=()=>scenes[Number(x.dataset.sceneNarration)].narration=x.value);
  $("scenes").querySelectorAll("[data-scene-duration]").forEach(x=>x.oninput=()=>scenes[Number(x.dataset.sceneDuration)].duration=Math.max(1,Math.min(60,Number(x.value)||5)));
  $("scenes").querySelectorAll("[data-del]").forEach(x=>x.onclick=()=>{scenes.splice(Number(x.dataset.del),1);renderScenes()});
}
$("add-scene").onclick=()=>{scenes.push({name:"New scene",visual:"",narration:"",duration:5});renderScenes()};$("save-plan").onclick=save;
function current(){if(!active&&($("title").value.trim()||$("script-text").value.trim()))save();else if(active)save();return active}function brief(){let p=current();if(!p)return "No project saved yet.";return "CREATORFLOW AI — PROJECT BRIEF\nTitle: "+p.title+"\nFormat: "+p.format+"\n\nSCRIPT\n"+p.script+"\n\nSCENES\n"+p.scenes.map((s,i)=>(i+1)+". "+s.name).join("\n")+"\n\nVOICEOVER\n"+p.voice+"\n\nAUDIO NOTES\n"+p.music+"\n\nStatus: planning brief only; no video has been rendered."}
function updateExportSummary(){const p=current();if(!p){$("summary").textContent="Create or save a project first. Your production package will appear here.";return}const words=value=>String(value||"").trim().split(/\s+/).filter(Boolean).length;$("summary").textContent=["PROJECT PACKAGE READY","Title: "+p.title,"Format: "+p.format,"Script: "+words(p.script)+" words","Scenes: "+p.scenes.length,"Voiceover: "+words(p.voiceover)+" words","Captions: "+String(p.captions||"").split(/\n+/).filter(Boolean).length,"Shot list: "+p.scenes.length+" scene(s)","Saved: yes","Rendered video: no — export files below; local FFmpeg rendering is separate."].join("\n")}
$("json").onclick=()=>{let p=current();if(!p){notify("Create a project first");return}let u=URL.createObjectURL(new Blob([JSON.stringify(p,null,2)],{type:"application/json"})),a=document.createElement("a");a.href=u;a.download="creatorflow-project.json";a.click();URL.revokeObjectURL(u);notify("Project JSON downloaded")};
$("copy").onclick=async()=>{try{await navigator.clipboard.writeText(brief());notify("Project brief copied")}catch(e){notify("Clipboard unavailable — use JSON download")}};

render();renderScenes();countWords();if("serviceWorker"in navigator&&location.protocol.startsWith("http"))addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));

// Optional Supabase cloud account and private project sync.
const cloudConfig=window.CREATORFLOW_CONFIG||{};
let cloudClient=null,cloudUser=null;
const cloudProjectIds=new Set();
let cloudOwnerId=null;
const authDialog=$("auth-dialog"),authStatus=$("auth-status"),accountButton=$("account-btn");
function authMessage(message,isError=false){authStatus.textContent=message;authStatus.classList.toggle("error",isError)}
function clearCloudProjects(){
  const activeWasCloud=active&&cloudProjectIds.has(active.id);
  projects=projects.filter(p=>!cloudProjectIds.has(p.id));
  cloudProjectIds.clear();
  cloudOwnerId=null;
  if(activeWasCloud){
    active=null;
    $("title").value="";
    $("script-text").value="";
    $("voice").value="";
    $("music").value="";
    $("voiceover-text").value="";
    $("captions-text").value="";
    scenes=[{name:"Opening hook",visual:"",narration:"",duration:5},{name:"Main point",visual:"",narration:"",duration:8},{name:"Payoff and CTA",visual:"",narration:"",duration:5}];
    renderScenes();
    countWords();
  }
  render();
}
function updateAccountUI(){
  if(cloudUser){
    accountButton.textContent=cloudUser.email||"Cloud account";
    $("mode-label").textContent="● CLOUD SYNC";
    document.querySelector(".side-note strong").textContent="Cloud workspace";
    document.querySelector(".side-note small").textContent="Private projects sync to your account.";
    document.querySelector(".stats article:nth-child(3) strong").textContent="Cloud sync";
    $("auth-signout").hidden=false;
    $("auth-sync-local").hidden=false;
    $("auth-signin").hidden=true;
    $("auth-signup").hidden=true;
    $("auth-social").hidden=true;
    $("auth-email-section").hidden=true;
    authMessage("Signed in as "+(cloudUser.email||"your account")+". Cloud projects are private to your account.");
  }else{
    accountButton.textContent=cloudClient?"Sign in / Sync":"Local mode";
    $("mode-label").textContent="● "+(cloudClient?"LOCAL MODE":"LOCAL ONLY");
    document.querySelector(".side-note strong").textContent="Local workspace";
    document.querySelector(".side-note small").textContent="Projects stay on this device.";
    document.querySelector(".stats article:nth-child(3) strong").textContent="On-device";
    $("auth-signout").hidden=true;
    $("auth-sync-local").hidden=true;
    $("auth-signin").hidden=false;
    $("auth-signup").hidden=false;
    $("auth-social").hidden=false;
    $("auth-email-section").hidden=false;
  }
}
async function saveCloudProject(project){
  if(!cloudClient||!cloudUser||!project)return;
  const row={id:project.id,owner_id:cloudUser.id,title:project.title||"Untitled project",format:project.format||"Shorts",project_data:project,updated_at:project.updatedAt||new Date().toISOString()};
  const {error}=await cloudClient.from("creator_projects").upsert(row,{onConflict:"id"});
  if(error){
    notify("Local save succeeded; cloud sync failed");
    console.error("CreatorFlow cloud save:",error.message);
  }else{
    cloudProjectIds.add(project.id);
    localStorage.setItem(KEY,JSON.stringify(projects.filter(p=>!cloudProjectIds.has(p.id))));
  }
}
async function loadCloudProjects(){
  if(!cloudClient||!cloudUser)return;
  const requestedOwnerId=cloudUser.id;
  if(cloudOwnerId&&cloudOwnerId!==requestedOwnerId)clearCloudProjects();
  cloudOwnerId=requestedOwnerId;
  const {data,error}=await cloudClient.from("creator_projects").select("id,title,format,project_data,updated_at").order("updated_at",{ascending:false});
  // Ignore a response that finishes after the account has changed or signed out.
  if(cloudUser?.id!==requestedOwnerId||cloudOwnerId!==requestedOwnerId)return;
  if(error){authMessage("Cloud projects could not load: "+error.message,true);return;}
  const byId=new Map(projects.map(p=>[p.id,p]));
  for(const row of (data||[])){
    cloudProjectIds.add(row.id);
    byId.set(row.id,{...(row.project_data||{}),id:row.id,title:row.title,format:row.format,updatedAt:row.updated_at});
  }
  projects=Array.from(byId.values()).sort((a,b)=>new Date(b.updatedAt||0)-new Date(a.updatedAt||0));
  localStorage.setItem(KEY,JSON.stringify(projects.filter(p=>!cloudProjectIds.has(p.id))));
  render();
}
async function syncLocalProjects(){
  if(!cloudClient||!cloudUser)return;
  const local=projects.filter(p=>p&&p.id&&!cloudProjectIds.has(p.id));
  if(!local.length){authMessage("There are no local projects to upload.");return;}
  if(!confirm("Upload "+local.length+" local project(s) to your private cloud workspace?"))return;
  $("auth-sync-local").disabled=true;
  let failures=0;
  for(const project of local){
    const {error}=await cloudClient.from("creator_projects").upsert({id:project.id,owner_id:cloudUser.id,title:project.title||"Untitled project",format:project.format||"Shorts",project_data:project,updated_at:project.updatedAt||new Date().toISOString()},{onConflict:"id"});
    if(error)failures++;else cloudProjectIds.add(project.id);
  }
  localStorage.setItem(KEY,JSON.stringify(projects.filter(p=>!cloudProjectIds.has(p.id))));
  $("auth-sync-local").disabled=false;
  authMessage(failures?"Upload finished with "+failures+" error(s). Check your database schema and RLS.":"All "+local.length+" local project(s) uploaded to your private cloud workspace.",!!failures);
  if(!failures)notify("Local projects synced");
  await loadCloudProjects();
}
async function initCloud(){
  const url=String(cloudConfig.supabaseUrl||"").trim(),key=String(cloudConfig.supabaseAnonKey||"").trim();
  if(!url||!key||!window.supabase?.createClient){
    authMessage("Cloud sync is not configured yet. Local planning and exports work without an account.");
    updateAccountUI();
    return;
  }
  try{
    cloudClient=window.supabase.createClient(url,key);
    const {data,error}=await cloudClient.auth.getSession();
    if(error)throw error;
    cloudUser=data.session?.user||null;
    cloudOwnerId=cloudUser?.id||null;
    updateAccountUI();
    if(cloudUser)await loadCloudProjects();
    cloudClient.auth.onAuthStateChange((_event,session)=>{
      const nextUser=session?.user||null;
      if(cloudUser?.id!==nextUser?.id)clearCloudProjects();
      cloudUser=nextUser;
      cloudOwnerId=nextUser?.id||null;
      if(cloudUser){updateAccountUI();void loadCloudProjects();}
      else{updateAccountUI();}
    });
  }catch(error){
    cloudClient=null;
    authMessage("Cloud setup error: "+error.message,true);
    updateAccountUI();
  }
}
accountButton.onclick=()=>{if(authDialog?.showModal)authDialog.showModal();else notify("Please use a modern browser for account access")};
$("auth-close").onclick=()=>authDialog.close();
async function signInWithProvider(provider){
  if(!cloudClient){authMessage("Cloud sign-in is not configured. Please try again later.",true);return;}
  const button=$(provider==="google"?"auth-google":"auth-github");
  const label=button.querySelector("span").textContent;
  document.querySelectorAll(".social-button").forEach(b=>b.disabled=true);
  button.querySelector("span").textContent="Connecting…";
  authMessage("Connecting securely to "+(provider==="google"?"Google":"GitHub")+"…");
  try{
    const {error}=await cloudClient.auth.signInWithOAuth({
      provider,
      options:{redirectTo:location.href.split("#")[0],queryParams:provider==="google"?{access_type:"offline",prompt:"select_account"}:undefined}
    });
    if(error)throw error;
  }catch(error){
    const message=String(error?.message||"");
    const providerName=provider==="google"?"Google":"GitHub";
    const guidance=/unsupported provider/i.test(message)
      ? providerName+" sign-in is not enabled in the Supabase project configured for this app. Enable "+providerName+" under Authentication → Sign In / Providers in Supabase, then retry. See docs/CLOUD_SETUP.md."
      : (message||"Social sign-in could not start. Check the provider credentials and redirect URLs in Supabase.");
    authMessage(guidance,true);
    document.querySelectorAll(".social-button").forEach(b=>b.disabled=false);
    button.querySelector("span").textContent=label;
  }
}
$("auth-google").onclick=()=>void signInWithProvider("google");
$("auth-github").onclick=()=>void signInWithProvider("github");
$("auth-form").onsubmit=async event=>{
  event.preventDefault();
  if(!cloudClient){authMessage("Cloud is not configured. Ask the site administrator to finish Supabase setup.",true);return;}
  const email=$("auth-email").value.trim(),password=$("auth-password").value;
  $("auth-signin").disabled=true;
  const {data,error}=await cloudClient.auth.signInWithPassword({email,password});
  $("auth-signin").disabled=false;
  if(error){authMessage(error.message,true);return;}
  cloudUser=data.user;
  updateAccountUI();
  await loadCloudProjects();
  authMessage("Signed in. Your private cloud projects are ready.");
  notify("Signed in successfully");
};
$("auth-signup").onclick=async()=>{
  if(!cloudClient){authMessage("Cloud is not configured yet. Local mode remains available.",true);return;}
  const email=$("auth-email").value.trim(),password=$("auth-password").value;
  if(!email||password.length<8){authMessage("Enter a valid email and a password of at least 8 characters.",true);return;}
  const {data,error}=await cloudClient.auth.signUp({email,password,options:{emailRedirectTo:location.href.split("#")[0]}});
  if(error){authMessage(error.message,true);return;}
  if(data.session){
    cloudUser=data.user;updateAccountUI();await loadCloudProjects();
    authMessage("Account created and signed in.");
  }else authMessage("Account created. Check your email for the verification link, then sign in.");
};
$("auth-reset").onclick=async()=>{
  if(!cloudClient){authMessage("Cloud is not configured yet.",true);return;}
  const email=$("auth-email").value.trim();
  if(!email){authMessage("Enter your email address first.",true);return;}
  const {error}=await cloudClient.auth.resetPasswordForEmail(email,{redirectTo:location.href.split("#")[0]});
  authMessage(error?error.message:"If this email has an account, a password reset link has been sent.",!!error);
};
$("auth-signout").onclick=async()=>{
  if(!cloudClient)return;
  const {error}=await cloudClient.auth.signOut();
  if(error){authMessage(error.message,true);return;}
  cloudUser=null;clearCloudProjects();updateAccountUI();notify("Signed out");
};
$("auth-sync-local").onclick=()=>void syncLocalProjects();
void initCloud();

 
// Local Ollama script generation is available only through the CreatorFlow Python server.
const aiDraftButton=$("ai-draft"),aiStatus=$("ai-status");
async function checkLocalAI(){
  try{
    const response=await fetch("/api/health",{cache:"no-store"});
    if(!response.ok)throw new Error("Local AI server is unavailable.");
    const info=await response.json();
    if(info.ollama){
      aiStatus.textContent=info.models.length?"Ollama ready · "+info.models.length+" model(s)":"Ollama is running · no model downloaded";
      aiDraftButton.disabled=info.models.length===0;
    }else{
      aiStatus.textContent="Ollama is not running";
      aiDraftButton.disabled=true;
    }
  }catch(error){
    aiStatus.textContent="Available in local server mode only";
    aiDraftButton.disabled=true;
  }
}
aiDraftButton.onclick=async()=>{
  const title=$("title").value.trim();
  if(!title){notify("Enter a video title first");$("title").focus();return;}
  aiDraftButton.disabled=true;aiDraftButton.textContent="Generating…";
  try{
    const response=await fetch("/api/ai/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,format:$("script-format").value,tone:$("tone").value,model:$("ai-model").value.trim()||"qwen2.5:1.5b"})});
    const result=await response.json();
    if(!response.ok)throw new Error(result.error||"Local AI generation failed.");
    $("script-text").value=result.response;countWords();
    notify("Draft generated with "+result.model+" — review before publishing");
  }catch(error){notify(error.message||"Local AI is unavailable");}
  finally{aiDraftButton.textContent="✦ Draft script with local AI";await checkLocalAI();}
};
void checkLocalAI();


// Production workflow utilities: browser-native voice preview and downloadable production files.
function downloadText(filename,content,type="text/plain;charset=utf-8"){
  const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function safeFilename(value){return (value||"creatorflow-project").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"creatorflow-project"}
function buildSrt(){
  const lines=$("captions-text").value.split(/\n+/).map(x=>x.trim()).filter(Boolean);
  const stamp=seconds=>{const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60;return [h,m,s].map(n=>String(n).padStart(2,"0")).join(":")+",000"};
  return lines.map((line,i)=>(i+1)+"\n"+stamp(i*3)+" --> "+stamp((i+1)*3)+"\n"+line).join("\n\n")+"\n";
}
function makeCaptions(){
  const source=$("voiceover-text").value.trim()||$("script-text").value.trim();
  if(!source){notify("Write a script first");return}
  $("captions-text").value=source.split(/(?<=[.!?])\s+|\n+/).map(s=>s.trim()).filter(Boolean).join("\n");
  notify("Captions prepared — review each line and timing");
}
$("go-voice").onclick=()=>{if(!$("voiceover-text").value.trim())$("voiceover-text").value=$("script-text").value;go("voice");};
$("go-export").onclick=()=>{save();go("export");};
$("save-voice").onclick=()=>{if(!$("voiceover-text").value.trim()&&!$("captions-text").value.trim()){notify("Add narration or captions first");return}save();};
$("captions-generate").onclick=makeCaptions;
$("captions-download").onclick=()=>{if(!$("captions-text").value.trim())makeCaptions();if($("captions-text").value.trim())downloadText(safeFilename($("title").value)+".srt",buildSrt(),"text/srt;charset=utf-8")};
$("export-srt").onclick=()=>{if(!$("captions-text").value.trim())makeCaptions();if($("captions-text").value.trim())downloadText(safeFilename($("title").value)+".srt",buildSrt(),"text/srt;charset=utf-8")};
$("voice-download").onclick=()=>{const text=$("voiceover-text").value.trim();if(!text){notify("Add voiceover text first");return}downloadText(safeFilename($("title").value)+"-voiceover.txt",text)};
$("script-download").onclick=()=>{const text=$("script-text").value.trim();if(!text){notify("Write a script first");return}downloadText(safeFilename($("title").value)+"-script.txt",text)};
$("shotlist-download").onclick=()=>{if(!scenes.length){notify("Add at least one scene first");return}const quote=v=>'"'+String(v??"").replace(/"/g,'""')+'"';const rows=[["Scene","Duration (seconds)","Visual direction","Narration"],...scenes.map((s,i)=>[s.name||"Scene "+(i+1),s.duration||5,s.visual||"",s.narration||""])];downloadText(safeFilename($("title").value)+"-shot-list.csv",rows.map(r=>r.map(quote).join(",")).join("\n"),"text/csv;charset=utf-8")};
$("auto-shotlist").onclick=()=>{
  const topic=$("title").value.trim()||"your video topic";
  if(!scenes.length)scenes=[{name:"Opening hook",duration:5},{name:"Main point",duration:8},{name:"Payoff and CTA",duration:5}];
  scenes=scenes.map((s,i)=>({...s,visual:s.visual||(["Fast close-up with bold opening text about "+topic,"Show a clear example or supporting visual for "+topic,"End on a clean summary frame and call to action"][Math.min(i,2)]),narration:s.narration||(["Open with the main promise and make the viewer curious.","Explain the key point with one simple example.","Summarise the takeaway and invite the viewer to act."][Math.min(i,2)])}));
  renderScenes();notify("Starter shot list added — customise every scene");
};
function loadSpeechVoices(){
  if(!("speechSynthesis" in window))return;
  const select=$("speech-voice"),voices=speechSynthesis.getVoices();
  const selected=select.value;
  select.innerHTML='<option value="">Default device voice</option>'+voices.map((v,i)=>'<option value="'+i+'">'+esc(v.name+" ("+v.lang+")")+'</option>').join("");
  if(selected)select.value=selected;
}
if("speechSynthesis" in window){
  loadSpeechVoices();speechSynthesis.onvoiceschanged=loadSpeechVoices;
  $("voice-preview").onclick=()=>{
    const text=$("voiceover-text").value.trim();
    if(!text){notify("Add narration text first");return}
    speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);
    utterance.rate=Number($("speech-rate").value)||1;
    const voices=speechSynthesis.getVoices(),choice=$("speech-voice").value;
    if(choice!==""&&voices[Number(choice)])utterance.voice=voices[Number(choice)];
    utterance.onerror=()=>notify("This device could not play the selected voice");
    speechSynthesis.speak(utterance);
  };
  $("voice-stop").onclick=()=>speechSynthesis.cancel();
}else{
  $("voice-preview").disabled=true;$("voice-stop").disabled=true;
  $("voice-preview").title="Speech preview is not supported by this browser";
}


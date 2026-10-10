import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {loadBlenderModel} from '../../src/blender-model';
import {environment} from '../../src/environment';
import {cameras, type View} from '../../src/camera';
import {exportImage,download} from '../../src/export';
import {SOURCES} from '../../src/config';
import {directions,dictionary,type Word} from './directions';
import './style.css';
import './picker.css';
const $=<E extends HTMLElement=HTMLElement>(s:string)=>document.querySelector<E>(s)!;
const params=new URLSearchParams(location.search);
let lang=['zh-CN','zh-TW','en'].includes(params.get('lang')||'')?params.get('lang')!:'zh-CN';
const tr=(key:Word)=>dictionary[key][lang==='en'?2:lang==='zh-TW'?1:0];
const requestedVariant=Number(params.get('v'));
let variant=Number.isInteger(requestedVariant)&&requestedVariant>=1&&requestedVariant<=directions.length?requestedVariant-1:0;
const picker=$('.proto-picker'),highlight=$('.proto-picker-highlight'),items=[...document.querySelectorAll<HTMLButtonElement>('.proto-picker-item')];
syncPicker();document.documentElement.lang=lang;document.title=tr('pageTitle');$('#loader').setAttribute('aria-label',tr('loading'));$('#load-value').textContent=tr('loading');
let mode:'observe'|'study'='observe',detail:'full'|'bracket'|'inner'|'finial'='full';
let selectedFloor=-1,roofs=true,walls=true,clay=false,separation=0,orbit=false,saving=false,view:View='hero';
let quality:'high'|'low'='high';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const host=$('#viewer'),design=$('#design');
const clayMaterial=new T.MeshStandardMaterial({color:0xd5ccbc,roughness:.93});
let renderer:T.WebGLRenderer;
function failed(message:string){let loader=document.querySelector<HTMLElement>('#loader');if(!loader){loader=document.createElement('section');loader.id='loader';document.body.append(loader);}loader.setAttribute('role','alert');picker.hidden=true;loader.innerHTML=`<p>${message}</p><button id="retry">${tr('retry')}</button>`;$('#retry').onclick=()=>location.reload();}
try{renderer=new T.WebGLRenderer({antialias:true,reversedDepthBuffer:true,powerPreference:'high-performance'});}catch{failed(tr('unavailable'));throw new Error('WebGL unavailable');}
renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.localClippingEnabled=true;
function displayPixelRatio(){return quality==='low'?1:Math.min(innerWidth<760?1.5:2,Math.max(1.5,devicePixelRatio));}
renderer.setPixelRatio(displayPixelRatio());host.append(renderer.domElement);renderer.domElement.dataset.depthMode=renderer.capabilities.reversedDepthBuffer?'reversed':'standard';
const scene=new T.Scene(),camera=new T.PerspectiveCamera(31,1,.1,1000),controls=new OrbitControls(camera,renderer.domElement);
controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.14;controls.rotateSpeed=.45;controls.zoomSpeed=.7;controls.minPolarAngle=.04;controls.maxPolarAngle=Math.PI*.52;controls.autoRotateSpeed=.22;
const env=environment(scene,renderer);env.key.shadow.mapSize.set(2048,2048);env.key.shadow.radius=4;
const oldGround=env.ground.material;const shadowGround=new T.ShadowMaterial({color:0x25271f,opacity:.16});(env.ground as T.Mesh).material=shadowGround;oldGround.dispose();
renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label',tr('canvasHelp'));
let pagoda:Awaited<ReturnType<typeof loadBlenderModel>>;
try{pagoda=await loadBlenderModel((n,total)=>{$('#load-value').textContent=Math.floor(n/total*100)+'%';($<HTMLProgressElement>('#load-progress')).value=n/total*100;});}catch(e){failed(tr('failure'));throw e;}
scene.add(pagoda.root);const cam=cameras(camera,controls,pagoda);
const meshes:T.Mesh[]=[];const originals=new Map<T.Mesh,T.Material|T.Material[]>();pagoda.root.traverse(o=>{if(o instanceof T.Mesh){meshes.push(o);originals.set(o,o.material);}});
let frame=0,remaining=0,contextLost=false;
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;setOrbit(false);cancelAnimationFrame(frame);frame=0;failed(tr('contextLost'));});
function setOrbit(on:boolean){orbit=on&&!reduced.matches;design.querySelector('[data-action=orbit]')?.setAttribute('aria-pressed',String(orbit));invalidate();}
function invalidate(){if(contextLost||document.hidden)return;remaining=24;if(!frame)frame=requestAnimationFrame(tick);}
function updateDepthRange(){
 // Millimetre-scale tile laps need more depth precision than a 15 cm / 1500 m frustum.
 const distance=camera.position.distanceTo(controls.target);const near=Math.max(.1,Math.min(5,distance*.025));const far=Math.max(180,distance+170);
 if(Math.abs(camera.near-near)>1e-5||Math.abs(camera.far-far)>1e-3){camera.near=near;camera.far=far;camera.updateProjectionMatrix();}
}
function tick(){frame=0;controls.autoRotate=orbit&&!reduced.matches&&!document.hidden;controls.update();updateDepthRange();renderer.render(scene,camera);if((remaining-->0||controls.autoRotate)&&!document.hidden&&!frame)frame=requestAnimationFrame(tick);}
function resize(){env.ground.visible=mode!=='study';const rect=host.getBoundingClientRect();if(rect.width<=0||rect.height<=0)return;renderer.domElement.style.clipPath=mode==='study'?`inset(${rect.top}px ${innerWidth-rect.right}px ${innerHeight-rect.bottom}px ${rect.left}px)`:'';renderer.setSize(innerWidth,innerHeight);camera.setViewOffset(rect.width,rect.height,-rect.left,-rect.top,innerWidth,innerHeight);camera.updateProjectionMatrix();invalidate();}
function resetState(){selectedFloor=-1;roofs=walls=true;clay=variant===2;separation=0;setOrbit(false);detail='full';view='hero';apply();}
function apply(){pagoda.floorGroups.forEach((g,i)=>{g.visible=selectedFloor<0||i===selectedFloor;g.position.y=i*7*separation;});meshes.forEach(m=>{m.visible=(roofs||m.userData.category!=='roof')&&(walls||m.userData.category!=='enclosure');m.material=clay?clayMaterial:originals.get(m)!;});invalidate();}
function frameBox(box:T.Box3,dir=new T.Vector3(.64,.13,1)){controls.enableDamping=false;controls.update();const target=box.getCenter(new T.Vector3()); // centre comes from actual geometry
 const size=box.getSize(new T.Vector3()),distance=Math.max(size.y,size.x/camera.aspect,size.z)*.5/Math.tan(T.MathUtils.degToRad(camera.fov/2))/.84;
 controls.target.copy(target);camera.position.copy(target).addScaledVector(dir.normalize(),Math.max(distance,5));controls.minDistance=2;controls.maxDistance=500;camera.far=1500;camera.updateProjectionMatrix();controls.update();controls.enableDamping=true;invalidate();}
function fitCurrent(){resize();if(detail==='full'&&selectedFloor===-1){cam.preset(view);if(view!=='top'&&view!=='detail')camera.position.sub(controls.target).multiplyScalar(.88).add(controls.target);controls.update();invalidate();return;}pagoda.root.updateMatrixWorld(true);let box=new T.Box3();
 if(detail==='bracket'&&selectedFloor===1){box.setFromCenterAndSize(pagoda.detailTarget.clone().add(new T.Vector3(0,7*separation,0)),new T.Vector3(8,6,6));frameBox(box,new T.Vector3(.3,-.14,1));return;}
 if(detail==='finial'){for(const m of meshes)if(m.userData.category==='finial')box.union(new T.Box3().setFromObject(m));}
 if(box.isEmpty())pagoda.floorGroups.forEach(g=>{if(g.visible)box.union(new T.Box3().setFromObject(g));});frameBox(box);}
function focusAction(action:string){[...design.querySelectorAll<HTMLButtonElement>(`[data-action="${action}"]`)].find(b=>b.getClientRects().length)?.focus({preventScroll:true});}
function focus(next:typeof detail){detail=next;view=next==='bracket'?'detail':'hero';setOrbit(false);separation=0;selectedFloor=next==='full'?-1:next==='finial'?4:1;roofs=next==='full'||next==='finial';walls=next==='full'||next==='finial';apply();render();focusAction('chapter-'+next);requestAnimationFrame(fitCurrent);}
function skin(){const dark=variant===2;scene.background=new T.Color(dark?'#22231f':variant===1?'#eeece5':'#e7e3da');shadowGround.opacity=dark?.24:.16;env.key.intensity=dark?4.1:3.1;env.key.position.set(-30,120,65);env.key.color.set(dark?'#ffe5c4':'#fff4dc');scene.children.forEach(o=>{if(o instanceof T.HemisphereLight)o.intensity=dark?1.65:2.4;});renderer.toneMappingExposure=dark?1.1:1.08;invalidate();}
let toastTimer:number|undefined;
function notify(text:string){clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').classList.add('visible');toastTimer=window.setTimeout(()=>$('#toast').classList.remove('visible'),3500);}
const button=(action:string,label:string,active=false,extra='')=>`<button data-action="${action}" ${['observe','study','clay','explode','roof','wall','orbit'].includes(action)||action.startsWith('chapter-')?`aria-pressed="${active}"`:''} ${extra}>${label}</button>`;
const tabs=()=>`<nav class="mode-tabs" aria-label="${tr('view')}">${button('observe',tr('observe'),mode==='observe')}${button('study',tr('study'),mode==='study')}${button('archive',tr('sources'))}</nav>`;
function render(){syncPicker();document.documentElement.lang=lang;document.title=tr('pageTitle');renderer.domElement.setAttribute('aria-label',tr('canvasHelp'));document.body.dataset.direction=directions[variant].id;document.body.dataset.mode=mode;document.body.dataset.detail=detail;
 const dsc=tr(detail==='full'?'wholeDescription':detail==='bracket'?'bracketDescription':detail==='inner'?'innerDescription':'finialDescription');
 design.innerHTML=`<header class="masthead"><a class="brand" href="/design-review.html?v=${variant+1}&lang=${lang}" aria-label="${tr('brand')}"><img src="/brand/mugou-wordmark.svg" alt="${tr('brand')}"><span>A MILLENNIUM IN TIMBER</span></a>${tabs()}<button class="menu-trigger" data-action="settings">${tr('settings')}</button></header>
 <aside class="identity"><p class="overline">${tr('chapter')}</p><div class="title-composition"><h1>${tr('title')}</h1><p class="subtitle">${tr('subtitle')}</p></div><p class="location">${tr('place')}<span>${tr('era')}</span></p><p class="identity-verse">${tr('verse')}</p><dl class="facts"><div><dt>${tr('built')}</dt><dd>1056</dd></div><div><dt>${tr('form')}</dt><dd>${tr('research')}</dd></div></dl></aside>
 <aside class="chapter-note"><span class="note-index">${detail==='full'?'01':detail==='bracket'?'02':detail==='inner'?'03':'04'} <i></i> 04</span><h2>${tr(detail==='full'?'shape':detail)}</h2><p>${dsc}</p>${button(mode==='observe'?'study':'full',tr(mode==='observe'?'begin':'back'))}</aside>
 <nav class="catalogue" aria-label="${tr('sequence')}"><p>${tr('sequence')}</p>${(['full','bracket','inner','finial'] as const).map((k,i)=>`<button data-action="chapter-${k}" aria-pressed="${detail===k}"><small>0${i+1}</small><span>${tr(k)}</span></button>`).join('')}</nav>
 <div class="viewer-foot"><span>${tr('hint')}</span><span class="current-view">${detail==='inner'||detail==='finial'?tr(detail):String((['hero','front','side','top','low','detail'] as View[]).indexOf(view)+1).padStart(2,'0')+' / 06'}</span></div>
 <section class="view-dock" aria-label="${tr('view')}"><label><span>${tr('view')}</span><select id="view-select" aria-label="${tr('view')}">${detail==='inner'||detail==='finial'?`<option value="component" selected disabled>${tr(detail)}</option>`:''}${(['hero','front','side','top','low','detail'] as View[]).map((k,i)=>`<option value="${k}" ${view===k&&detail!=='inner'&&detail!=='finial'?'selected':''}>${tr((['full','front','side','top','low','bracket'] as Word[])[i])}</option>`).join('')}</select></label><span class="dock-divider"></span>${button('clay',tr('clay'),clay)}${button('explode',tr('separate'),separation>0)}${button('reset',tr('restore'))}${button('capture',tr('capture'),false,saving?'disabled':'')}</section>
 <section class="study-panel" ${mode==='study'?'':'hidden'} aria-label="${tr('study')}"><div class="panel-heading"><span>${tr('study')}</span>${button('observe',tr('close'))}</div><div class="detail-links">${(['bracket','inner','finial'] as const).map(k=>button('chapter-'+k,tr(k),detail===k)).join('')}</div><label class="floor-row">${tr('floor')}<select id="floor-select"><option value="-1">${tr('all')}</option>${[0,1,2,3,4].map(n=>`<option value="${n}" ${selectedFloor===n?'selected':''}>${n+1}</option>`).join('')}</select></label><div class="switches">${button('roof',tr('roofs'),roofs)}${button('wall',tr('walls'),walls)}</div><label class="range-row">${tr('separate')}<input type="range" id="gap" min="0" max="100" value="${separation*100}" aria-label="${tr('separate')}"></label><p class="study-note">${tr('separationNote')}</p></section>
 <footer class="colophon"><span>${tr('research')}</span><span>YINGXIAN / SHANXI</span></footer>
 <dialog id="options" aria-label="${tr('settings')}"><div class="dialog-heading"><span>${tr('settings')}</span>${button('close-dialog',tr('close'))}</div><label>${tr('language')}<select id="locale"><option value="zh-CN" ${lang==='zh-CN'?'selected':''}>简体中文</option><option value="zh-TW" ${lang==='zh-TW'?'selected':''}>繁體中文</option><option value="en" ${lang==='en'?'selected':''}>English</option></select></label><label>${tr('quality')}<select id="quality"><option value="high" ${quality==='high'?'selected':''}>${tr('high')}</option><option value="low" ${quality==='low'?'selected':''}>${tr('lowQuality')}</option></select></label>${button('orbit',tr('orbit'),orbit,reduced.matches?`disabled title="${tr('motionDisabled')}"`:'')}${button('archive',tr('sources'))}${button('capture',tr('capture')+' · PNG',false,saving?'disabled':'')}</dialog>
 <dialog id="archive" aria-label="${tr('sources')}"><div class="dialog-heading"><span>ARCHIVE / 01</span>${button('close-dialog',tr('close'))}</div><h2>${tr('notes')}</h2><p>${tr('scope')}</p><p>${tr('modelNote')}</p><h3>${tr('references')}</h3>${SOURCES.map((s,i)=>`<article><span>0${i+1}</span><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title}</a><p>${s.author}</p></article>`).join('')}</dialog>`;
 $<HTMLSelectElement>('#floor-select').value=String(selectedFloor);
}
async function capture(){if(saving)return;saving=true;setOrbit(false);notify(tr('saving'));design.querySelectorAll<HTMLButtonElement>('[data-action="capture"]').forEach(b=>b.disabled=true);await new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r())));try{updateDepthRange();const c=camera.clone();c.clearViewOffset();c.aspect=16/9;c.position.sub(controls.target).multiplyScalar(Math.max(1,camera.aspect/c.aspect)).add(controls.target);c.updateProjectionMatrix();const blob=await exportImage(renderer,scene,c,1920,1080);download(blob,'yingxian-design-study.png');notify(tr('saved'));}catch{notify(tr('exportFailure'));}finally{saving=false;design.querySelectorAll<HTMLButtonElement>('[data-action="capture"]').forEach(b=>b.disabled=false);invalidate();}}
function openDialog(id:'archive'|'options'){design.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(d=>d.close());const dialog=$<HTMLDialogElement>('#'+id);dialog.addEventListener('close',()=>{if(document.querySelector('dialog[open]'))return;const action=id==='archive'?'archive':'settings';const trigger=[...design.querySelectorAll<HTMLButtonElement>(`[data-action="${action}"]`)].find(b=>b.getClientRects().length&&!b.closest('dialog'));(trigger||design.querySelector<HTMLButtonElement>('[data-action=settings]'))?.focus();},{once:true});dialog.showModal();}
design.addEventListener('click',e=>{const b=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-action]');if(!b)return;const action=b.dataset.action!;
 if(action==='archive'||action==='settings'){openDialog(action==='archive'?'archive':'options');return;}
 if(action==='close-dialog'){b.closest('dialog')?.close();return;}
 if(action==='capture'){void capture();return;}
 if(action==='orbit'){setOrbit(!orbit);return;}
 if(action==='observe'){mode='observe';resetState();}else if(action==='study'){mode='study';}
 else if(action.startsWith('chapter-')){mode=action==='chapter-full'?'observe':'study';focus(action.slice(8) as typeof detail);return;}
 else if(action==='full'||action==='reset'){mode='observe';resetState();}
 else if(action==='clay')clay=!clay;else if(action==='explode'){separation=separation?0:1;orbit=false;}else if(action==='roof')roofs=!roofs;else if(action==='wall')walls=!walls;
 apply();render();design.querySelector<HTMLButtonElement>(`[data-action="${action}"]`)?.focus({preventScroll:true});if(!['clay','roof','wall'].includes(action))requestAnimationFrame(fitCurrent);
});
design.addEventListener('change',e=>{const el=e.target as HTMLSelectElement;
 if(el.id==='view-select'){view=el.value as View;setOrbit(false);if(view==='detail'){mode='study';focus('bracket');}else{selectedFloor=-1;detail='full';roofs=walls=true;apply();render();fitCurrent();}$('#view-select').focus();}
 if(el.id==='floor-select'){selectedFloor=Number(el.value);detail='full';view='hero';setOrbit(false);apply();render();fitCurrent();$('#floor-select').focus();}
 if(el.id==='locale'){lang=el.value;const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);render();openDialog('options');$('#locale').focus();}
 if(el.id==='quality'){quality=el.value as typeof quality;renderer.setPixelRatio(displayPixelRatio());resize();}
});
design.addEventListener('input',e=>{const el=e.target as HTMLInputElement;if(el.id==='gap'){setOrbit(false);separation=Number(el.value)/100;design.querySelector('[data-action=explode]')?.setAttribute('aria-pressed',String(separation>0));apply();fitCurrent();}});
controls.addEventListener('change',invalidate);controls.addEventListener('start',()=>setOrbit(false));
renderer.domElement.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(e.key))return;e.preventDefault();e.stopPropagation();setOrbit(false);const s=new T.Spherical().setFromVector3(camera.position.clone().sub(controls.target));if(e.key==='ArrowLeft')s.theta-=.08;if(e.key==='ArrowRight')s.theta+=.08;if(e.key==='ArrowUp')s.phi-=.06;if(e.key==='ArrowDown')s.phi+=.06;if(['+','-','='].includes(e.key))s.radius*=e.key==='-'?1.08:.92;s.phi=T.MathUtils.clamp(s.phi,controls.minPolarAngle,controls.maxPolarAngle);s.radius=T.MathUtils.clamp(s.radius,controls.minDistance,controls.maxDistance);camera.position.copy(controls.target).add(new T.Vector3().setFromSpherical(s));controls.update();invalidate();});
function syncPicker(){picker.setAttribute('aria-label',tr('designDirections'));items.forEach((b,i)=>{b.textContent=tr(directions[i].id);});moveHighlight();}
function moveHighlight(){const b=items[variant];highlight.style.width=b.offsetWidth+'px';highlight.style.transform=`translateX(${b.offsetLeft}px)`;}
function choose(n:number){variant=Math.max(0,Math.min(2,n));items.forEach((b,i)=>{b.toggleAttribute('data-active',i===variant);if(i===variant)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});moveHighlight();const url=new URL(location.href);url.searchParams.set('v',String(variant+1));history.replaceState(null,'',url);mode='observe';resetState();if(variant===2){clay=true;apply();}render();skin();requestAnimationFrame(fitCurrent);}
items.forEach((b,i)=>b.onclick=()=>choose(i));window.addEventListener('resize',moveHighlight);
document.addEventListener('keydown',e=>{const el=e.target as HTMLElement;if(el.matches('input,textarea,select,canvas')||el.isContentEditable||e.metaKey||e.ctrlKey||e.altKey||document.querySelector('dialog[open]'))return;const n=Number(e.key);if(n>=1&&n<=3)choose(n-1);else if(e.key==='ArrowRight')choose((variant+1)%3);else if(e.key==='ArrowLeft')choose((variant+2)%3);else if(e.key.toLowerCase()==='r')choose(variant);else if(e.key==='Escape'&&mode==='study'){mode='observe';resetState();render();requestAnimationFrame(fitCurrent);}});
const observer=new ResizeObserver(()=>{resize();fitCurrent();});observer.observe(host);
choose(variant);$('#load-value').textContent=tr('preparing');try{await renderer.compileAsync(scene,camera);renderer.render(scene,camera);}catch(error){failed(tr('renderFailure'));throw error;}$('#loader').remove();document.body.dataset.ready='true';requestAnimationFrame(()=>picker.setAttribute('data-ready',''));
document.addEventListener('visibilitychange',()=>{if(document.hidden){setOrbit(false);cancelAnimationFrame(frame);frame=0;}else invalidate();});reduced.addEventListener('change',()=>{if(reduced.matches)setOrbit(false);const b=design.querySelector<HTMLButtonElement>('[data-action=orbit]');if(b){b.disabled=reduced.matches;b.title=reduced.matches?tr('motionDisabled'):'';}});
window.addEventListener('pagehide',event=>{if(event.persisted)return;clearTimeout(toastTimer);cancelAnimationFrame(frame);observer.disconnect();controls.dispose();const gs=new Set<T.BufferGeometry>(),ms=new Set<T.Material>(),ts=new Set<T.Texture>();scene.traverse(o=>{if(o instanceof T.Mesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m);}});for(const m of originals.values())(Array.isArray(m)?m:[m]).forEach(x=>ms.add(x));ms.add(clayMaterial);for(const m of ms){Object.values(m).forEach(v=>{if(v instanceof T.Texture)ts.add(v);});m.dispose();}ts.forEach(t=>t.dispose());gs.forEach(g=>g.dispose());renderer.dispose();});

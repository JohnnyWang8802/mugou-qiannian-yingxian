import './entrance.css';
const copy={
 archive:['木构遗产 / 01','木構遺產 / 01','TIMBER HERITAGE / 01'],title:['木构千年','木構千年','A Millennium in Timber'],subject:['应县木塔 · 数字展陈','應縣木塔 · 數位展陳','YINGXIAN WOODEN PAGODA'],
 loading:['载入模型','載入模型','Loading model'],preparing:['准备展陈','準備展陳','Preparing exhibition'],ready:['展陈已就绪','展陳已就緒','Ready to explore'],start:['开始','開始','Enter'],retry:['重新加载','重新載入','Try again'],
 error:['加载未完成，请重试。','載入未完成，請重試。','Unable to load. Please try again.'],webgl:['浏览器无法启用 WebGL 2。','瀏覽器無法啟用 WebGL 2。','WebGL 2 is unavailable in this browser.'],legacy:['打开原版展陈 ↗','開啟原版展陳 ↗','Open original exhibition ↗'],verse:['一榫一卯，撑起千年。','一榫一卯，撐起千年。','Joined in timber. Standing through centuries.'],place:['山西 · 应县','山西 · 應縣','YINGXIAN · SHANXI']
} as const;
export function installEntrance(){
 const app=document.querySelector<HTMLElement>('#app')!;app.inert=true;document.body.classList.add('at-entrance');
 const el=document.createElement('section');el.id='entrance';el.setAttribute('aria-labelledby','entry-title');
 const review=new URLSearchParams(location.search).has('entry-review');
 el.dataset.layout='center';el.innerHTML=`<div class="entry-content"><div class="entry-title-block"><h1 id="entry-title"><span class="entry-sr" data-entry="title"></span><img src="/brand/mugou-wordmark.svg" alt="" width="444" height="104"></h1></div><div class="entry-action"><div class="entry-progress-caption"><span id="entry-status" role="status" aria-live="polite"></span><span id="entry-percent" aria-hidden="true">—</span></div><div id="entry-progress" role="progressbar" aria-label="模型加载 / Model loading" aria-valuemin="0" aria-valuemax="100"><span></span></div><button id="entry-start" hidden aria-describedby="entry-status"><span data-entry="retry"></span><svg width="24" height="16" viewBox="0 0 24 16" aria-hidden="true"><path d="M1 8h21m-6-6 6 6-6 6"/></svg></button><a id="entry-fallback" data-entry="legacy" hidden></a></div></div>${review?'<nav class="entry-review" aria-label="入场页版式比较"><button data-layout="center" aria-pressed="true">A · 居中题签</button><button data-layout="editorial" aria-pressed="false">B · 左对齐书页</button></nav>':''}`;
 document.body.append(el);
 const button=el.querySelector<HTMLButtonElement>('#entry-start')!,status=el.querySelector<HTMLElement>('#entry-status')!,percent=el.querySelector<HTMLElement>('#entry-percent')!,progress=el.querySelector<HTMLElement>('#entry-progress')!,fill=progress.firstElementChild as HTMLElement;
 let phase:keyof typeof copy='loading',ready=false,entered=false,known=false,value=0,onEnter=()=>{};
 function render(){const lang=document.documentElement.lang;const index=lang==='en'?2:lang==='zh-TW'?1:0;el.querySelectorAll<HTMLElement>('[data-entry]').forEach(n=>{n.textContent=copy[n.dataset.entry as keyof typeof copy][index]});status.textContent=copy[phase][index];status.classList.toggle('entry-sr',phase==='loading'||phase==='ready');el.querySelector<HTMLAnchorElement>('#entry-fallback')!.href='/legacy.html?lang='+lang;button.querySelector('span')!.textContent=copy[phase==='error'||phase==='webgl'?'retry':'start'][index];progress.setAttribute('aria-label',copy.loading[index]);}
 const observer=new MutationObserver(render);observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});render();
 el.querySelectorAll<HTMLButtonElement>('[data-layout]').forEach(b=>b.onclick=()=>{el.dataset.layout=b.dataset.layout;el.querySelectorAll('[data-layout]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
 button.onclick=()=>location.reload();
 function enter(){if(!ready||entered)return;entered=true;app.inert=false;document.body.classList.remove('at-entrance');onEnter();document.querySelector<HTMLCanvasElement>('#stage canvas')?.focus({preventScroll:true});el.inert=true;observer.disconnect();if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.remove();return}el.classList.add('entry-leaving');window.setTimeout(()=>el.remove(),280);}
 return {
  progress(loaded:number,total:number){if(entered)return;known=total>0;if(!known)return;value=Math.min(100,Math.floor(loaded/total*100));percent.textContent=String(value).padStart(2,'0')+'%';progress.setAttribute('aria-valuenow',String(value));fill.style.transform=`scaleX(${value/100})`;if(value===100&&phase==='loading'){phase='preparing';render()}},
  async ready(callback:()=>void){if(phase==='error'||phase==='webgl')return;onEnter=callback;ready=true;phase='ready';value=100;known=true;percent.textContent='100%';progress.setAttribute('aria-valuenow','100');fill.style.transform='scaleX(1)';el.dataset.ready='true';render();await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));enter()},
  fail(reason:'error'|'webgl'='error'){phase=reason;ready=false;button.hidden=false;el.dataset.failed='true';el.querySelector<HTMLElement>('#entry-fallback')!.hidden=false;progress.hidden=true;percent.textContent='—';render()},
  isOpen:()=>!entered,
  dispose(){observer.disconnect();el.remove();app.inert=false;document.body.classList.remove('at-entrance')}
 };
}

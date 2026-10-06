import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.TEST_URL||'http://127.0.0.1:5173';
const b=await chromium.launch({headless:false,channel:'chrome'});
const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];
p.on('pageerror',e=>errors.push(e.message));
const settle=()=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
const shot=async name=>{await settle();await p.screenshot({path:`artifacts/blender-integration/${name}.png`})};
await p.goto(base);await p.waitForFunction(()=>window.__ready,null,{timeout:120000});
await p.locator('#entrance').waitFor({state:'detached',timeout:120000});const metrics=await p.evaluate(()=>window.__pagoda.metrics());const frameTimes=await p.evaluate(async()=>{const d=window.__pagoda;d.orbit(true);const samples=[];let last=performance.now();for(let i=0;i<100;i++)await new Promise(resolve=>requestAnimationFrame(t=>{if(i>9)samples.push(t-last);last=t;resolve()}));d.orbit(false);samples.sort((a,b)=>a-b);return {medianMs:samples[Math.floor(samples.length/2)],p95Ms:samples[Math.floor(samples.length*.95)],sampleFrames:samples.length,userAgent:navigator.userAgent};});console.log(metrics);
await shot('desktop');
for(const lang of ['en','zh-TW','zh-CN']){await p.selectOption('#language',lang);await p.locator('#sources').click();assert((await p.locator('#source-dialog').innerText()).includes(lang==='en'?'Current Blender':lang==='zh-TW'?'目前 Blender':'当前 Blender'));await p.locator('#close-sources').click();}
await p.locator('#explore-toggle').click();await settle();
await p.selectOption('#study-floor','2');assert.deepEqual(await p.evaluate(()=>window.__pagoda.pagoda.floorGroups.map(g=>g.visible)),[false,false,true,false,false]);
await p.locator('#study-roof').click();assert(await p.evaluate(()=>{let ok=true;window.__pagoda.pagoda.root.traverse(n=>{if(n.userData.category==='roof'&&n.visible)ok=false});return ok}));
await p.locator('#study-cut').click();assert(await p.evaluate(()=>{const d=window.__pagoda;return d.renderer.localClippingEnabled&&d.pagoda.floorGroups[2].children[0].children[0].material.clippingPlanes.length===1}));
await shot('cutaway');
await p.locator('#clay').click();assert(await p.evaluate(()=>window.__pagoda.pagoda.floorGroups[2].children[0].children[0].material.clippingPlanes.length===1));
await p.locator('#clay').click();
for(const key of ['bracket','inner','finial']){await p.locator(`[data-focus=${key}]`).click();await shot(key)}
await p.selectOption('#study-floor','-1');await p.locator('#study-gap').fill('0.75');await p.locator('#study-gap').dispatchEvent('input');assert.equal(await p.evaluate(()=>window.__pagoda.pagoda.floorGroups[4].position.y),21);await shot('separated');
await p.locator('#reset').click();await settle();assert(await p.evaluate(()=>window.__pagoda.pagoda.floorGroups.every(g=>g.visible&&g.position.y===0)));
// Render a real 4K PNG through the application's exporter; save bytes without a download dialog.
const image=await p.evaluate(async()=>{const blob=await window.__pagoda.exportBlob();return await new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.readAsDataURL(blob)})});
const bytes=Buffer.from(image.split(',')[1],'base64');assert.equal(bytes.readUInt32BE(16),3840);assert.equal(bytes.readUInt32BE(20),2160);await writeFile('artifacts/blender-integration/hero-4k.png',bytes);
await p.locator('#settings').click();const dl=p.waitForEvent('download');await p.locator('#exporthd').click();await (await dl).saveAs('artifacts/blender-integration/export-ui-hd.png');await p.locator('#reset').click();
for(const width of [320,390,760]){await p.setViewportSize({width,height:844});await p.selectOption('#language','en');await p.evaluate(()=>window.__pagoda.setView('hero'));await shot(`mobile-${width}-en`);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.locator('#explore-toggle').click();await settle();await shot(`study-${width}-en`);await p.locator('[data-focus=inner]').click();await shot(`inner-${width}-en`);await p.locator('#reset').click();}
await p.goto(base+'/legacy.html?lang=en');await p.waitForFunction(()=>window.__ready,null,{timeout:120000});assert.equal(await p.locator('#explore-toggle').count(),0);await shot('legacy');
await p.route('**/models/manifest.json',r=>r.fulfill({status:503,body:'Unavailable'}));await p.goto(base);await p.locator('#entry-fallback').waitFor();assert.equal(await p.locator('#entry-start:enabled').count(),1);assert((await p.locator('#entry-fallback').getAttribute('href')).includes('legacy.html'));await p.unroute('**/models/manifest.json');assert.equal(errors.filter(e=>!e.includes('Model manifest unavailable')).length,0);await writeFile('artifacts/blender-integration/validation.json',JSON.stringify({date:new Date().toISOString(),base,browser:await b.version(),metrics,frameTimes,export:{width:3840,height:2160,bytes:bytes.length},checks:['three languages','storey isolation','roof visibility','cutaway','clay with clipping','detail views','separation and reset','4K PNG','download action','320/390/760 CSS-pixel layouts','legacy','asset failure fallback'],expectedFailureTest:{response:503,retryAndLegacyVisible:true},errors:errors.filter(e=>!e.includes('Model manifest unavailable'))},null,2));
await b.close();console.log('PASS');

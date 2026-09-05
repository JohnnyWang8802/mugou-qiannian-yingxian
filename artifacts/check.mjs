import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||chromium.executablePath(),args:['--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await page.goto('http://127.0.0.1:5173/?clay');await page.waitForFunction(()=>window.__ready===true);await page.waitForTimeout(1200);
for(const view of ['hero','front','side','top']){await page.getByRole('button',{name:({'hero':'01三分之四','front':'02正面','side':'03侧面','top':'04俯视'})[view],exact:true}).click();await page.waitForTimeout(350);await page.screenshot({path:`artifacts/white-${view}.png`});}
await page.evaluate(()=>{window.__pagoda.setClay(false);window.__pagoda.setView('hero')});await page.waitForTimeout(500);await page.screenshot({path:'artifacts/material-first.png'});
console.log(JSON.stringify({errors,metrics:await page.evaluate(()=>window.__pagoda.metrics())},null,2));await fs.writeFile('artifacts/white-check.json',JSON.stringify({errors,metrics:await page.evaluate(()=>window.__pagoda.metrics())},null,2));await browser.close();

import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:chromium.executablePath()});
const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const width of [320,390,430]){
 await page.setViewportSize({width,height:width===320?568:844});
 for(const lang of ['zh-CN','zh-TW','en']){
  await page.goto(`http://localhost:5173/?lang=${lang}`);await page.waitForFunction(()=>window.__ready);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert(await page.locator('.view-nav button').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44)));
  await page.click('#settings');assert(await page.locator('#export4k').isVisible());
  await page.keyboard.press('Escape');assert(await page.locator('#settings-panel').isHidden());
  await page.click('#sources');await page.keyboard.press('Escape');
  await page.screenshot({path:`artifacts/mobile-${width}-${lang}.png`});
 }
}
assert.equal(errors.length,0);await browser.close();console.log('Nine mobile viewport/language combinations passed.');

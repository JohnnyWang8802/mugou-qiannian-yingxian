import {chromium} from '@playwright/test';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import assert from 'node:assert/strict';
await mkdir('artifacts/staircase',{recursive:true});
const data=gunzipSync(await readFile('public/models/floor-1.glb.gz'));const gltf=await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');gltf.scene.updateMatrixWorld(true);const base=[];gltf.scene.traverse(o=>{if(o.isMesh&&o.userData.category==='base')base.push(o)});
const hits=[];const front=18.5*Math.cos(Math.PI/8)+23*.28;
for(let i=0;i<23;i++){const ray=new T.Raycaster(new T.Vector3(0,6,front-(i+.5)*.28),new T.Vector3(0,-1,0));const hit=ray.intersectObjects(base,false)[0];assert(hit,`Missing visible tread ${i+1}`);const expected=(i+1)*3.8/23;assert(Math.abs(hit.point.y-expected)<.003,`Wrong tread ${i+1}: ${hit.point.y}`);hits.push({tread:i+1,height:hit.point.y,expected});}
const b=await chromium.launch({channel:'chrome',headless:false});const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.TEST_URL||'http://127.0.0.1:5173/');await p.waitForFunction(()=>window.__ready,null,{timeout:120000});await p.locator('#entrance').waitFor({state:'detached',timeout:120000});
for(const [name,position] of [['oblique',[10,9,36]],['front',[0,9,38]]]){await p.evaluate(pos=>{const d=window.__pagoda;d.hide(true);d.controls.minDistance=1;d.controls.target.set(0,1.9,20.3);d.camera.position.set(...pos);d.controls.update();d.render()},position);await p.screenshot({path:`artifacts/staircase/${name}.png`});}
assert.deepEqual(errors,[]);await writeFile('artifacts/staircase/checks.json',JSON.stringify({date:new Date().toISOString(),visibleTreads:hits,errors},null,2));await b.close();console.log('PASS: all 23 treads visible from above; close views captured');

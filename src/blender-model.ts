import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import type {Pagoda} from './geometry';
export type ModelManifest={source_sha256:string;scope:string;files:{url:string;floor:number;bytes:number;decodedBytes:number;triangles:number;drawCalls:number}[]};
export async function loadBlenderModel(progress:(loaded:number,total:number)=>void):Promise<Pagoda & {manifest:ModelManifest}>{
 const response=await fetch('/models/manifest.json');if(!response.ok)throw new Error('Model manifest unavailable');const manifest:ModelManifest=await response.json();
 const total=manifest.files.reduce((n,f)=>n+f.bytes,0);let loaded=0;const root=new T.Group();root.name='Yingxian Blender research model';const floorGroups:T.Group[]=[];const loader=new GLTFLoader();
 try{for(const file of manifest.files){
  const result=await fetch('/models/'+file.url);if(!result.ok||!result.body)throw new Error(`Model asset failed: ${file.url}`);
  const reader=result.body.getReader();let received=0;const previous=loaded;const transferLength=result.headers.get('Content-Encoding')==='gzip'?file.decodedBytes:file.bytes;const chunks:Uint8Array<ArrayBuffer>[]=[];
  for(;;){const {done,value}=await reader.read();if(done)break;chunks.push(value as Uint8Array<ArrayBuffer>);received+=value.length;progress(previous+Math.min(1,received/transferLength)*file.bytes,total);}
  loaded+=file.bytes;const blob=new Blob(chunks);const raw=await blob.arrayBuffer();const magic=new Uint8Array(raw,0,2);let buffer:ArrayBuffer;try{buffer=magic[0]===0x1f&&magic[1]===0x8b?await new Response(blob.stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer():raw;}catch(e){throw new Error('Decompression '+file.url+': '+String(e));}
  const gltf=await loader.parseAsync(buffer,'').catch(e=>{throw new Error('GLTF '+file.url+': '+String(e));});const group=new T.Group();group.name=`Storey ${file.floor+1}`;group.userData.floor=file.floor;group.add(gltf.scene);floorGroups[file.floor]=group;root.add(group);
  group.traverse(o=>{if(o instanceof T.Mesh){if((Array.isArray(o.material)?o.material:[o.material]).some(m=>m.name.includes('ceramic')))o.userData.category='roof';o.castShadow=o.receiveShadow=true;o.geometry.computeBoundingBox();if(o.userData.category==='roof')o.receiveShadow=false;}});
 }
 root.updateMatrixWorld(true);return {root,floorGroups,bounds:new T.Box3().setFromObject(root),detailTarget:new T.Vector3(0,23.5,12),manifest};
 }catch(error){root.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});throw error;}
}

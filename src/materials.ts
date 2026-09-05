import * as T from 'three';
import { ARCH } from './config';
export function materials(){
 let seed=ARCH.seed as number;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
 const texture=(kind:'wood'|'stone'|'tile')=>{
 const c=document.createElement('canvas');c.width=256;c.height=512;const ctx=c.getContext('2d')!;const im=ctx.createImageData(c.width,c.height);
 const phase=Array.from({length:256},()=>random());
 for(let y=0;y<512;y++)for(let x=0;x<256;x++){const i=(y*256+x)*4;
 const grain=kind==='wood'?Math.sin(x*.66+Math.sin(y*.014+x*.02)*1.1)*10+phase[x]*18:random()*20;
 const v=222+grain+(random()-.5)*10;im.data[i]=v;im.data[i+1]=v;im.data[i+2]=v;im.data[i+3]=255;}
 ctx.putImageData(im,0,0);const map=new T.CanvasTexture(c);map.wrapS=map.wrapT=T.RepeatWrapping;map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;return map;};
 const woodMap=texture('wood'),stoneMap=texture('stone'),tileMap=texture('tile');const woodBump=woodMap.clone(),stoneBump=stoneMap.clone();woodBump.colorSpace=stoneBump.colorSpace=T.NoColorSpace;
 const wood=new T.MeshStandardMaterial({color:0xa58d74,map:woodMap,roughness:.91,bumpMap:woodBump,bumpScale:.025});
 const red=new T.MeshStandardMaterial({color:0x9b715b,map:woodMap,roughness:.93,bumpMap:woodBump,bumpScale:.018});
 const dark=new T.MeshStandardMaterial({color:0x796752,map:woodMap,roughness:.98});
 const tile=new T.MeshStandardMaterial({color:0x858981,map:tileMap,roughness:.87});
 tile.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>\n float seam = smoothstep(0.035,0.07,abs(fract(vMapUv.y)-0.5)); diffuseColor.rgb *= 0.82 + 0.18*seam;`);};
 const stone=new T.MeshStandardMaterial({color:0xb1a897,map:stoneMap,roughness:.98,bumpMap:stoneBump,bumpScale:.045});
 const plaster=new T.MeshStandardMaterial({color:0x8a6254,roughness:1});
 const metal=new T.MeshStandardMaterial({color:0x625f4e,metalness:.58,roughness:.63});
 const clay=new T.MeshStandardMaterial({color:0xd6d0c4,roughness:.9});
 return {wood,red,dark,tile,stone,plaster,metal,clay};
}
export type Palette=ReturnType<typeof materials>;

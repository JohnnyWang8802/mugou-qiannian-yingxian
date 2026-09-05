import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {ARCH} from './config';
import type {Palette} from './materials';
const UP=new T.Vector3(0,1,0), TAU=Math.PI*2, START=Math.PI/8;
const pt=(r:number,a:number,y:number)=>new T.Vector3(Math.sin(a)*r,y,Math.cos(a)*r);
const facePoint=(r:number,side:number,u:number,y:number)=>pt(r,START+side*TAU/8,y).lerp(pt(r,START+(side+1)*TAU/8,y),u);
class Batch {
 list=new Map<string,{geo:T.BufferGeometry,mat:T.Material,transforms:T.Matrix4[],colors:T.Color[]}>();
 dummy=new T.Object3D();seq=0;
 add(key:string,geo:T.BufferGeometry,mat:T.Material,p:T.Vector3,scale:T.Vector3,q=new T.Quaternion(),variance=.04){
 const batchKey=key+'|'+geo.uuid+'|'+mat.uuid;if(!this.list.has(batchKey))this.list.set(batchKey,{geo,mat,transforms:[],colors:[]});const b=this.list.get(batchKey)!;
 this.dummy.position.copy(p);this.dummy.scale.copy(scale);this.dummy.quaternion.copy(q);this.dummy.updateMatrix();b.transforms.push(this.dummy.matrix.clone());const n=Math.sin(++this.seq*78.233+ARCH.seed)*43758.5453;const v=1-variance+(n-Math.floor(n))*variance*2;b.colors.push(new T.Color(v,v*.994,v*.987));}
 finish(parent:T.Group){for(const [name,b]of this.list){const m=new T.InstancedMesh(b.geo,b.mat,b.transforms.length);m.name=name.split('|')[0];b.transforms.forEach((v,i)=>{m.setMatrixAt(i,v);m.setColorAt(i,b.colors[i])});m.castShadow=true;m.receiveShadow=true;m.computeBoundingSphere();parent.add(m);}}
}
export function buildPagoda(m:Palette){
 const root=new T.Group();root.name='应县木塔 · 外观视觉复刻';
 const box=new RoundedBoxGeometry(1,1,1,1,.07);const cylinder=new T.CylinderGeometry(.5,.53,1,12);const cube=new T.BoxGeometry(1,1,1);
 const gongShape=new T.Shape();gongShape.moveTo(-.5,.25);gongShape.lineTo(.5,.25);gongShape.lineTo(.5,.04);gongShape.lineTo(.36,0);gongShape.quadraticCurveTo(.28,-.22,.12,-.25);gongShape.lineTo(-.12,-.25);gongShape.quadraticCurveTo(-.28,-.22,-.36,0);gongShape.lineTo(-.5,.04);gongShape.closePath();
 const gongGeo=new T.ExtrudeGeometry(gongShape,{depth:1,bevelEnabled:false,curveSegments:3});gongGeo.translate(0,0,-.5);const guv=gongGeo.getAttribute("uv");for(let v=0;v<guv.count;v++){const x=guv.getX(v);guv.setX(v,guv.getY(v));guv.setY(v,x);}
 const floorGroups:T.Group[]=[];
 function builder(group:T.Group){const b=new Batch();
 const beam=(a:T.Vector3,z:T.Vector3,w:number,d:number,mat=m.wood,key='梁枋')=>{const delta=z.clone().sub(a);b.add(key,w<.3?cube:box,mat,a.clone().add(z).multiplyScalar(.5),new T.Vector3(w,delta.length(),d),new T.Quaternion().setFromUnitVectors(UP,delta.normalize()));};
 const post=(p:T.Vector3,h:number,d=.62,mat=m.red)=>b.add('柱',cylinder,mat,p.clone().add(new T.Vector3(0,h/2,0)),new T.Vector3(d,h,d));
 const block=(p:T.Vector3,s:T.Vector3,mat=m.wood,key='枓',q=new T.Quaternion())=>b.add(key,s.y<.3?cube:box,mat,p,s,q);
 const ring=(r:number,y:number,w:number,d:number,mat=m.wood,key='交圈梁')=>{for(let side=0;side<8;side++)beam(facePoint(r,side,0,y),facePoint(r,side,1,y),w,d,mat,key)};
 // A repeatable bracket grammar: seated dou, transverse gong, outward arms, then an upper bearing beam.
 const bracket=(p:T.Vector3,angle:number,levels:number,reach=1)=>{
 const out=new T.Vector3(Math.sin(angle),0,Math.cos(angle)).multiplyScalar(reach),tan=new T.Vector3(Math.cos(angle),0,-Math.sin(angle));
 block(p,new T.Vector3(.58,.3,.58));
 for(let j=0;j<levels;j++){const c=p.clone().addScaledVector(out,.23+j*.31);c.y+=.24+j*.29;const span=.8+j*.4;
 b.add('斗拱横栱',gongGeo,m.wood,c,new T.Vector3(span,.62,.3),new T.Quaternion().setFromAxisAngle(UP,angle));
 beam(c.clone().addScaledVector(out,-.47),c.clone().addScaledVector(out,.47),.22,.24,m.wood,'斗拱华栱');
 for(const sign of [-1,1]){const z=c.clone().addScaledVector(tan,sign*span*.41);z.y+=.18;block(z,new T.Vector3(.27,.2,.3));}
 }
 const a=p.clone().addScaledVector(out,-.25);a.y+=.72;const z=p.clone().addScaledVector(out,1.9);z.y+=1.12;beam(a,z,.21,.24,m.dark,'出挑昂');
 };
 return {b,beam,post,block,ring,bracket,finish:()=>b.finish(group)};}
 const base=new T.Group();base.name='台基与台阶';root.add(base);const bb=builder(base);
 for(const [r,h,y]of [[18.5,.45,.225],[18.1,2.8,1.85],[18.45,.55,3.525]]){const mesh=new T.Mesh(y<1?new T.BoxGeometry(37.6,h,37.6):new T.CylinderGeometry(r,r,h,8,1,false,START),m.stone);mesh.position.y=y;mesh.receiveShadow=true;mesh.castShadow=true;base.add(mesh);}
 for(let side=0;side<8;side++)for(let row=0;row<5;row++)for(let col=0;col<12;col++){
 const a=facePoint(18.115,side,(col+(row%2)*.5)/12,.55+row*.55);const z=facePoint(18.115,side,Math.min(1,(col+1+(row%2)*.5)/12),.55+row*.55);bb.beam(a,z,.022,.025,m.dark,'石缝');}
 for(const sign of [-1,1])for(let step=0;step<13;step++){const h=(step+1)*ARCH.baseHeight/13;bb.block(new T.Vector3(0,h/2,sign*(22.2-step*.43)),new T.Vector3(5.1,h,.48),m.stone,'台阶');}
 bb.finish();
 ARCH.floors.forEach((f,i)=>{
 const g=new T.Group();g.name=f.name;g.userData.originalY=0;g.userData.floor=i;root.add(g);floorGroups.push(g);const b=builder(g);
 const deck=new T.Mesh(new T.CylinderGeometry(f.radius+.3,f.radius+.3,.36,8,1,false,START),i?m.wood:m.stone);deck.position.y=f.base-.18;deck.castShadow=deck.receiveShadow=true;g.add(deck);
 b.ring(f.radius,f.base+.25,.42,.55);if(i){b.ring(f.radius-.65,f.base-.85,.32,.38);for(let side=0;side<8;side++)for(let j=0;j<3;j++)b.post(facePoint(f.radius-.7,side,j/3,f.base-1.45),1.35,.37,m.wood);}b.ring(f.radius,f.postTop-.25,.48,.58,m.red,'额枋');b.ring(f.radius,f.postTop+.25,.3,.45);
 for(let side=0;side<8;side++){
 const angle=START+(side+.5)*TAU/8;const q=new T.Quaternion().setFromAxisAngle(UP,angle);
 // Deep core, separated from the open outer colonnade. Ground floor retains its enclosed walls.
 const width=2*f.core*Math.sin(Math.PI/8);
 if(i===0){const center=facePoint(f.core,side,.5,(f.base+f.postTop)/2);if(side===3||side===7){for(const u of [.18,.82])b.block(facePoint(f.core,side,u,8.9),new T.Vector3(width*.32,10.2,.48),m.plaster,'首层墙体',q);b.block(facePoint(f.core,side,.5,13.35),new T.Vector3(width,2.2,.5),m.plaster,'首层墙体',q);}else b.block(center,new T.Vector3(width,f.postTop-f.base,.55),m.plaster,'首层墙体',q);}
 else {b.block(facePoint(f.core,side,.5,f.base+2.2),new T.Vector3(width,4.4,.22),m.dark,'内槽阴面',q);
 for(let bay=0;bay<3;bay++){const u=(bay+.5)/3;b.block(facePoint(f.core+.08,side,u,f.base+2.25),new T.Vector3(width*.27,3.55,.14),m.red,'门窗框',q);
 for(let slat=0;slat<7;slat++)b.post(facePoint(f.core+.18,side,(bay+(slat+.5)/7)/3,f.base+.8),2.9,.075,m.wood);}}
 for(let j=0;j<3;j++){
 const p=facePoint(f.radius,side,j/3,f.base);b.post(p,f.postTop-f.base,i?ARCH.columnDiameter:.74);
 b.block(p.clone().add(new T.Vector3(0,.12,0)),new T.Vector3(.82,.24,.82),m.stone,'柱础');
 b.bracket(facePoint(f.radius,side,j/3,f.postTop+.42),j===0?START+side*TAU/8:angle,f.brackets);
 }
 for(let j=0;j<3;j++)b.bracket(facePoint(f.radius,side,(j+.5)/3,f.postTop+.42),angle,Math.max(3,f.brackets-1));
 if(f.rail){const rr=f.radius+.12;for(const y of [.25,.78,1.3])b.beam(facePoint(rr,side,0,f.base+y),facePoint(rr,side,1,f.base+y),.13,.14,m.red,'勾栏横杆');
 for(let j=0;j<=18;j++){const p=facePoint(rr,side,j/18,f.base+.16);b.post(p,1.23,j%6===0?.2:.095,m.wood);}
 for(let j=0;j<9;j++){b.beam(facePoint(rr,side,j/9,f.base+.3),facePoint(rr,side,(j+1)/9,f.base+.77),.07,.08,m.wood,'勾栏斜材');}
 // Closely spaced seat brackets sit below each gallery and visually carry it.
 for(let j=0;j<12;j++)b.bracket(facePoint(f.radius-1.3,side,(j+.5)/12,f.base-1.45),angle,2,.7);
 }
 // Visible radial ceiling ties connecting corridor and core.
 for(let j=0;j<4;j++)b.beam(facePoint(f.core,side,j/3,f.postTop-.15),facePoint(f.radius+.65,side,j/3,f.postTop-.15),.26,.32);
 }
 if(i===0){const r=ARCH.baseSpan/2;b.ring(r,8.08,.42,.54,m.red);for(let side=0;side<8;side++)for(let j=0;j<3;j++){const p=facePoint(r,side,j/3,ARCH.baseHeight);b.post(p,4.25,.64);b.bracket(facePoint(r,side,j/3,8.18),START+(side+(j? .5:0))*TAU/8,3);}}
 b.finish();
 if([0,2,4].includes(i)){
 const text=i===0?'城金鎮永':i===2?'塔迦釋':'工神極峻';const y=i===0?7.5:f.postTop-.6;const radius=i===0?15.135:f.radius;
 const p=facePoint(radius,7,.5,y);p.z+=.36;
 const board=new T.Mesh(new T.BoxGeometry(i===0?4.4:4.0,1.25,.18),m.dark);board.position.copy(p);g.add(board);
 const c=document.createElement('canvas');c.width=768;c.height=256;const ctx=c.getContext('2d')!;ctx.fillStyle='#b9a78b';ctx.fillRect(0,0,768,256);ctx.strokeStyle='#70604c';ctx.lineWidth=12;ctx.strokeRect(12,12,744,232);ctx.fillStyle='#3d3429';ctx.font='148px "Songti SC", SimSun, serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,384,134,680);
 const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;const label=new T.Mesh(new T.PlaneGeometry(i===0?4.24:3.84,1.13),new T.MeshStandardMaterial({map:tex,roughness:.95}));label.position.copy(p);label.position.z+=.101;label.name='匾额题名示意（非原书法复刻）';g.add(label);
 }
 });
 for(const roof of ARCH.roofs){const g=new T.Group();g.name=roof.name;floorGroups[roof.floor].add(g);
 const b=builder(g);const positions:number[]=[],uvs:number[]=[],indices:number[]=[];
 const U=Math.max(ARCH.detail.roofUSegments,Math.ceil(2*roof.outer*Math.sin(Math.PI/8)/ARCH.detail.tilePitch)*6),V=ARCH.detail.roofVSegments;
 const surface=(side:number,u:number,t:number,thickness=0)=>{const r=T.MathUtils.lerp(roof.inner,roof.outer,t);const p=facePoint(r,side,u,0);const corner=Math.pow(Math.abs(u*2-1),10);const flute=(.5+.5*Math.cos(u*Math.round(2*roof.outer*Math.sin(Math.PI/8)/ARCH.detail.tilePitch)*TAU))*.055*t;
 p.y=roof.eave+(roof.top-roof.eave)*Math.pow(1-t,roof.curve)+roof.lift*corner*Math.pow(t,5)+flute-thickness;return p;};
 for(let side=0;side<8;side++){
 const start=positions.length/3;
 for(let v=0;v<=V;v++)for(let u=0;u<=U;u++){const p=surface(side,u/U,v/V);positions.push(p.x,p.y,p.z);uvs.push(u/U,v/V*(roof.outer-roof.inner)/.35);}
 for(let v=0;v<V;v++)for(let u=0;u<U;u++){const a=start+v*(U+1)+u;indices.push(a,a+U+1,a+1,a+1,a+U+1,a+U+2);}
 // Eave thickness and fascia follow the same lifted profile; no open or floating roof edge.
 for(let j=0;j<64;j++){const a=surface(side,j/64,1,.16),z=surface(side,(j+1)/64,1,.16);b.beam(a,z,.16,.2,m.dark,'檐口连檐');}
 // Exposed rafters reach inward beneath the roof, sharing two instanced batches per roof.
 for(let j=0;j<40;j++){const u=(j+.5)/40;b.beam(surface(side,u,.55,.29),surface(side,u,1,.29),.13,.15,m.wood,'檐下椽子');}
 for(let j=0;j<28;j++)b.beam(surface(side,0,j/28).add(new T.Vector3(0,.15,0)),surface(side,0,(j+1)/28).add(new T.Vector3(0,.15,0)),.25,.28,m.tile,'垂脊');
 }
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geo.setIndex(indices);geo.computeVertexNormals();
 const mesh=new T.Mesh(geo,m.tile);mesh.name='曲面瓦顶';mesh.castShadow=mesh.receiveShadow=true;g.add(mesh);
 const underside=geo.clone();const pos=underside.getAttribute('position');for(let v=0;v<pos.count;v++)pos.setY(v,pos.getY(v)-ARCH.detail.roofThickness);const idx=underside.index!;for(let j=0;j<idx.count;j+=3){const n=idx.getX(j+1);idx.setX(j+1,idx.getX(j+2));idx.setX(j+2,n);}underside.computeVertexNormals();const lining=new T.Mesh(underside,m.dark);lining.name='屋面木基层';lining.castShadow=lining.receiveShadow=true;g.add(lining);b.finish();
 }
 const finial=new T.Group();finial.name='铁塔刹';floorGroups[4].add(finial);const fb=builder(finial);
 const spire=new T.Mesh(new T.CylinderGeometry(.09,.32,6.51,12),m.metal);spire.position.y=64.055;finial.add(spire);
 const pedestal=new T.Mesh(new T.CylinderGeometry(.65,1.3,.9,8),m.metal);pedestal.position.y=61.0;finial.add(pedestal);
 for(let k=0;k<7;k++){const ring=new T.Mesh(new T.TorusGeometry(.75-k*.068,.075,6,32),m.metal);ring.rotation.x=Math.PI/2;ring.position.y=61.55+k*.45;finial.add(ring);}
 for(const [y,r] of [[64.95,.34],[65.75,.22],[66.45,.15]]){const ball=new T.Mesh(new T.SphereGeometry(r,12,8),m.metal);ball.position.y=y;finial.add(ball);}
 for(let side=0;side<4;side++){const a=pt(.4,side*TAU/4,64.2),z=pt(4.6,side*TAU/4,58.55);fb.beam(a,z,.035,.035,m.metal,'塔刹拉索');}fb.finish();
 root.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(root);
 return {root,floorGroups,bounds,detailTarget:facePoint(11.6,7,.5,25.9)};
}
export type Pagoda=ReturnType<typeof buildPagoda>;

import * as T from 'three';
/** +Z = south. Dimensions/elevations are visual estimates, NOT measured plaque dimensions.
 * Text is semantic reading order; horizontal plaques are laid out right-to-left without mirroring glyphs.
 * Evidence and unresolved attribution/date conflicts: docs/PLAQUES.md. */
export const PLAQUES = [
 {text:'萬古觀瞻',floor:0,face:'south',width:4.4,height:1.35,y:7.3,r:14.34,top:8.08,bg:'#66868d'},
 {text:'天柱地軸',floor:0,face:'south',width:4.5,height:1.45,y:14.0,r:11.63,top:14.65,bg:'#c0b798'},
 {text:'正直',floor:1,face:'south',width:3.6,height:1.0,y:19.9,r:11.12,top:20.35,bg:'#a79c79'},
 {text:'天宮高聳',floor:1,face:'south',width:4.6,height:1.45,y:24.0,r:10.97,top:25.0,bg:'#b9b399'},
 {text:'釋迦塔',floor:2,face:'south',width:1.65,height:3.15,y:32.65,r:10.46,top:34.65,bg:'#c3bda4',vertical:true},
 {text:'天下奇觀',floor:3,face:'south',width:4.2,height:1.6,y:42.85,r:9.95,top:43.9,bg:'#c0b79e'},
 {text:'峻極神工',floor:4,face:'south',width:4.3,height:1.45,y:52.0,r:9.49,top:52.95,bg:'#b8ac90'},
 {text:'永鎮金城',floor:0,face:'north',width:4.4,height:1.25,y:7.4,r:14.34,top:8.08,bg:'#b9ac90'},
] as const;
export function addPlaques(floors:T.Group[],wood:T.Material){
 for(const p of PLAQUES){
 const group=new T.Group();group.name=`匾额 · ${p.text} · ${p.face}`;group.userData.plaque={...p,accuracy:'visual approximation; system calligraphy font'};
 group.position.set(0,p.y,p.face==='south'?p.r:-p.r);group.rotation.y=p.face==='south'?0:Math.PI;floors[p.floor].add(group);
 const board=new T.Mesh(new T.BoxGeometry(p.width,p.height,.16),wood);board.castShadow=true;group.add(board);
 const vertical='vertical' in p;const c=document.createElement('canvas');c.width=vertical?512:1536;c.height=vertical?1024:512;
 const ctx=c.getContext('2d')!;ctx.fillStyle=p.bg;ctx.fillRect(0,0,c.width,c.height);
 ctx.strokeStyle='#6c6551';ctx.lineWidth=12;ctx.strokeRect(12,12,c.width-24,c.height-24);
 ctx.fillStyle='#30352f';ctx.textAlign='center';ctx.textBaseline='middle';
 const letters=[...p.text];if(!vertical)letters.reverse();
 ctx.font=`600 ${vertical?260:335}px "Kaiti SC", STKaiti, KaiTi, "Songti SC", serif`;
 letters.forEach((ch,i)=>ctx.fillText(ch,vertical?256:130+(i+.5)*(c.width-260)/letters.length,vertical?100+(i+.5)*(c.height-200)/letters.length:270,vertical?340:(c.width-260)/letters.length*.94));
 const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;
 const ink=new T.Mesh(new T.PlaneGeometry(p.width-.08,p.height-.08),new T.MeshStandardMaterial({map:tex,roughness:.96}));ink.position.z=.085;group.add(ink);
 // Short timber hangers connect each board to its storey's beam/platform; no cross-storey attachments.
 const hanger=Math.max(.08,p.top-(p.y+p.height/2));for(const side of [-1,1]){const mesh=new T.Mesh(new T.BoxGeometry(.09,hanger+.12,.12),wood);mesh.position.set(side*p.width*.34,p.height/2+hanger/2,-.05);group.add(mesh);}
 if(vertical){const head=new T.Mesh(new T.BoxGeometry(p.width+.44,.25,.22),wood);head.position.y=p.height/2+.03;group.add(head);}
 }
}

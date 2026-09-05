import * as T from 'three';
export function environment(scene:T.Scene,renderer:T.WebGLRenderer){
 scene.background=new T.Color('#e7e3da');
 const hemi=new T.HemisphereLight(0xfff5e4,0x918e86,2.1);scene.add(hemi);
 const key=new T.DirectionalLight(0xfff4dc,3.3);key.position.set(-45,85,55);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-57,right:57,top:65,bottom:-65,near:1,far:210});key.shadow.bias=-.00015;key.shadow.normalBias=.06;key.shadow.radius=3;key.target.position.y=30;scene.add(key,key.target);
 const fill=new T.DirectionalLight(0xdce6f1,1.05);fill.position.set(40,40,-35);scene.add(fill);
 const ground=new T.Mesh(new T.PlaneGeometry(3000,3000),new T.MeshStandardMaterial({color:0xe0dbd1,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.025;ground.receiveShadow=true;scene.add(ground);
 const set=(evening:boolean)=>{scene.background=new T.Color(evening?'#c9c1b3':'#e7e3da');hemi.intensity=evening?1.65:2.1;key.color.set(evening?0xffcc91:0xfff4dc);key.intensity=evening?2.6:3.3;key.position.set(evening?-65:-45,evening?36:85,55);fill.intensity=evening?.8:1.05;renderer.toneMappingExposure=evening?1.08:1.08;};
 return {set,key,ground};
}

import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import type {Pagoda} from './geometry';
export const VIEWS=[['hero','三分之四'],['front','正面'],['side','侧面'],['top','俯视'],['low','低机位'],['detail','斗拱近景']] as const;
export type View=typeof VIEWS[number][0];
export function cameras(camera:T.PerspectiveCamera,controls:OrbitControls,pagoda:Pagoda){
 let current:View='hero';
 function bounds(){pagoda.root.updateMatrixWorld(true);return new T.Box3().setFromObject(pagoda.root);}
 function fit(cam:T.PerspectiveCamera,box:T.Box3,direction:T.Vector3,fill=.82){
 const center=box.getCenter(new T.Vector3());const q=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().lookAt(direction,new T.Vector3(),new T.Vector3(0,1,0)));const inverse=q.clone().invert();let d=0;const tan=Math.tan(T.MathUtils.degToRad(cam.fov/2));
 for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const p=new T.Vector3(x,y,z).sub(center).applyQuaternion(inverse);d=Math.max(d,p.z+Math.max(Math.abs(p.y)/(tan*fill),Math.abs(p.x)/(tan*cam.aspect*fill)));}
 cam.position.copy(center).addScaledVector(direction.normalize(),d);cam.lookAt(center);cam.near=.15;cam.far=Math.max(700,d*5);cam.updateProjectionMatrix();return center;
 }
 function preset(view:View,cam=camera){if(cam===camera){const damping=controls.enableDamping;controls.enableDamping=false;controls.update();controls.enableDamping=damping;}current=view;let box=bounds(),dir=new T.Vector3(.72,.10,1);
 if(view==='front')dir.set(0,.02,1);if(view==='side')dir.set(1,.02,0);if(view==='top')dir.set(.001,1,.001);if(view==='low')dir.set(.45,-.065,1);
 if(view==='detail'){const p=pagoda.detailTarget.clone();p.y+=pagoda.floorGroups[1].position.y;box=new T.Box3().setFromCenterAndSize(p,new T.Vector3(8,6,5));dir.set(.28,-.16,1);}
 const target=fit(cam,box,dir,view==='top'?.9:.93);if(cam===camera){controls.target.copy(target);controls.minDistance=view==='detail'?5:42;controls.maxDistance=Math.max(240,box.getSize(new T.Vector3()).y*5);controls.update();}return target;
 }
 const exportCamera=(aspect:number)=>{const c=camera.clone();c.clearViewOffset();c.aspect=aspect;const box=current==='detail'?new T.Box3().setFromCenterAndSize(controls.target,new T.Vector3(8,6,5)):bounds();fit(c,box,camera.position.clone().sub(controls.target),.84);return c;};
 return {preset,exportCamera,bounds,get current(){return current}};
}

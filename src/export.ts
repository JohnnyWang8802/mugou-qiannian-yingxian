import * as T from 'three';
/** A detached export canvas keeps Three's normal screen-output tone mapping and sRGB pipeline.
 * It also keeps the interactive renderer, viewport, camera, and drawing buffer untouched. */
export async function exportImage(renderer:T.WebGLRenderer,scene:T.Scene,camera:T.PerspectiveCamera,width=3840,height=2160){
 const gl=renderer.getContext();const viewport=gl.getParameter(gl.MAX_VIEWPORT_DIMS) as Int32Array;
 const limit=Math.min(renderer.capabilities.maxTextureSize,gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),viewport[0],viewport[1]);
 if(Math.max(width,height)>limit)throw new Error('设备无法导出 4K，请选择 1920 × 1080。');
 const output=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});
 try{output.setPixelRatio(1);output.setSize(width,height,false);output.outputColorSpace=renderer.outputColorSpace;output.toneMapping=renderer.toneMapping;output.toneMappingExposure=renderer.toneMappingExposure;output.shadowMap.enabled=renderer.shadowMap.enabled;output.shadowMap.type=renderer.shadowMap.type;
 const outputGL=output.getContext();output.render(scene,camera);
 if(outputGL.isContextLost()||outputGL.getError()===outputGL.OUT_OF_MEMORY)throw new Error('显存不足，请尝试 1920 × 1080。');
 return await new Promise<Blob>((resolve,reject)=>output.domElement.toBlob(b=>b?resolve(b):reject(new Error('PNG 编码失败')),'image/png'));
 }finally{output.dispose();output.forceContextLoss();output.domElement.width=output.domElement.height=1;}
}
export function download(blob:Blob,name:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}

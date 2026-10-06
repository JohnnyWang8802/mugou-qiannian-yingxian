"""Read-only Blender-to-web GLB batches; no blend file is saved."""
import bpy,json,math,re,struct,gzip,hashlib,time
import numpy as np
from pathlib import Path
import argparse,sys
parser=argparse.ArgumentParser();parser.add_argument('--source',required=True);parser.add_argument('--parameters',required=True);parser.add_argument('--output',required=True)
args=parser.parse_args(sys.argv[sys.argv.index('--')+1:]);SOURCE=Path(args.source);OUT=Path(args.output);OUT.mkdir(exist_ok=True,parents=True)
bpy.ops.wm.open_mainfile(filepath=str(SOURCE));s=bpy.context.scene

# Repair the existing candidate in memory only. The source .blend remains unchanged.
import bmesh
stair=bpy.data.objects.get('South staircase / dimensions estimated')
assert stair is not None, 'Expected entrance staircase missing'
bm=bmesh.new();bm.from_mesh(stair.data)
assert all(e.is_manifold for e in bm.edges), 'Staircase must remain a closed solid'
before=bm.calc_volume(signed=True)
bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.normal_update()
after=bm.calc_volume(signed=True)
assert after>0 and abs(abs(before)-after)<1e-5, 'Normal repair must preserve stair volume'
assert sum(f.normal.z>.9 for f in bm.faces)==23, 'All 23 treads must face upward'
bm.to_mesh(stair.data);bm.free();stair.data.update()
print('STAIR_REPAIR',json.dumps({'signedVolumeBefore':before,'signedVolumeAfter':after,'upwardTreads':23}),flush=True)

# Fine edge bevels dominate repeated timbers. Keep the underlying researched profile.
for o in bpy.data.objects:
 for m in o.modifiers:
  if m.type=='BEVEL':m.show_viewport=False;m.show_render=False
 if o.type=='MESH' and len(o.data.polygons)>12000:
  m=o.modifiers.new('Web-only density reduction','DECIMATE');m.ratio=.20 if 'tile' in o.name.lower() else .35
bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get();groups={};cache={};materials=[];matids={};P=json.loads(Path(args.parameters).read_text());thresholds=[f['base'] for f in P['floors'][1:]]
def category(name,z):
 n=name.lower()
 if z>54.4 and any(x in n for x in ['finial','iron','bowl','lotus','drum','crown jewel','circular','crescent','vessel','chain']):return 'finial'
 if any(x in n for x in ['plaque','letter','glyph']):return 'plaques'
 if n.endswith('eave'):return 'roof'
 if any(x in n for x in ['tile','roof','ridge','sheathing','eave disc','eave and hip profiles']):return 'roof'
 if any(x in n for x in ['wall','window','door','lattice','infill','plaster']):return 'enclosure'
 if any(x in n for x in ['railing','balustrade']):return 'railing'
 if z<3.8:return 'base'
 return 'timber'
def material(mat):
 name=mat.name if mat else 'Timber'
 if name in matids:return matids[name]
 color=list(mat.diffuse_color) if mat else [.12,.08,.045,1]
 if mat and 'Finish /' not in name and mat.use_nodes:
  p=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
  if p:color=list(p.inputs['Base Color'].default_value)
 metal=.65 if 'iron' in name.lower() else 0
 index=len(materials);materials.append({'name':name,'pbrMetallicRoughness':{'baseColorFactor':color,'metallicFactor':metal,'roughnessFactor':.82 if not metal else .7},'doubleSided':False});matids[name]=index;return index
C=np.array([[1,0,0],[0,0,1],[0,-1,0]],dtype=np.float32)
tile_normal_audit=[]
def shading_stats(me):
 polygon_normals=np.empty(len(me.polygons)*3,np.float32);me.polygons.foreach_get('normal',polygon_normals);polygon_normals=polygon_normals.reshape(-1,3)
 corners=np.empty(len(me.corner_normals)*3,np.float32);me.corner_normals.foreach_get('vector',corners);corners=corners.reshape(-1,3)
 owners=np.repeat(np.arange(len(me.polygons)),[len(p.loop_indices) for p in me.polygons]);up=polygon_normals[owners,2]>.4
 dots=np.einsum('ij,ij->i',polygon_normals[owners],corners)[up]
 return {'upwardCorners':int(up.sum()),'reversedCorners':int((dots<0).sum()),'over60Degrees':int((dots<.5).sum()),'minimumDot':float(dots.min()) if len(dots) else None}
count=0
for inst in dg.object_instances:
 o=inst.object
 if o.type!='MESH' or o.hide_render or (inst.parent and inst.parent.hide_render) or max(o.dimensions)>200:continue
 if any(k in o.name.lower() for k in ['locator','support context','temporary']):continue
 key=o.original.as_pointer()
 if key not in cache:
  me=o.to_mesh()
  if 'tile shells' in o.name.lower():
   before_shading=shading_stats(me)
   # Decimation invalidates the old sharp-edge map on these thin ceramic shells.
   # Rebuild it on the evaluated topology: curved surfaces stay smooth, rims split.
   for polygon in me.polygons:polygon.use_smooth=True
   me.set_sharp_from_angle(angle=math.radians(40));me.update()
   after_shading=shading_stats(me)
   assert after_shading['reversedCorners']==0, f'Reversed tile shading remains: {o.name}'
   tile_normal_audit.append({'object':o.name,'before':before_shading,'after':after_shading})
  me.calc_loop_triangles();nv=len(me.vertices);nt=len(me.loop_triangles)
  if not nt:o.to_mesh_clear();continue
  pos=np.empty(nv*3,np.float32);me.vertices.foreach_get('co',pos);pos=pos.reshape(-1,3)
  tri=np.empty(nt*3,np.int32);me.loop_triangles.foreach_get('vertices',tri);tri=tri.reshape(-1,3)
  loops=np.empty(nt*3,np.int32);me.loop_triangles.foreach_get('loops',loops)
  normals=np.empty(len(me.corner_normals)*3,np.float32);me.corner_normals.foreach_get('vector',normals);normals=normals.reshape(-1,3)[loops]
  mi=np.empty(nt,np.int32);me.loop_triangles.foreach_get('material_index',mi)
  packed=np.concatenate((pos[tri.reshape(-1)],normals),axis=1);packed=np.round(packed,6);unique,index=np.unique(packed,axis=0,return_inverse=True);index=index.reshape(-1,3).astype(np.uint32)
  cache[key]=(unique[:,:3],unique[:,3:],index,mi,[material(m) for m in me.materials]);o.to_mesh_clear()
 pos,norm,tri,mi,mids=cache[key];M=np.array(inst.matrix_world,dtype=np.float32);world=pos@M[:3,:3].T+M[:3,3];z=float((world[:,2].min()+world[:,2].max())/2);floor=sum(z>=h for h in thresholds)
 name=inst.parent.name if inst.parent else o.name
 match=re.match(r'L([1-5])\b',name)
 if match:floor=int(match[1])-1
 cat=category(o.name,z);normal=norm@np.linalg.inv(M[:3,:3]);normal/=np.maximum(np.linalg.norm(normal,axis=1)[:,None],1e-8);world=world@C.T;normal=normal@C.T
 for matindex in np.unique(mi):
  materialid=mids[int(matindex)] if len(mids)>int(matindex) else material(None)
  if 'locator' in materials[materialid]['name'].lower():continue
  g=groups.setdefault((floor,cat,materialid),[[],[],[],0]);idx=tri[mi==matindex];used,remap=np.unique(idx,return_inverse=True);g[0].append(world[used]);g[1].append(normal[used]);g[2].append(remap.astype(np.uint32).reshape(-1,3)+g[3]);g[3]+=len(used)
 count+=1
 if count%2000==0:print('WEB_OBJECTS',count,flush=True)
manifest={'source_sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'units':'metres','coordinates':'Y up; Blender south becomes +Z','scope':'Current research candidate; estimated and unfinished historic details retained. Web-only bevel removal and dense-mesh simplification; procedural Blender shaders approximated by PBR materials.','files':[],'instances':count,'geometryRepairs':['Tile shells: rebuild smooth normals and 40-degree hard edges after density reduction.','Entrance staircase: outward face winding restored; 23 upward-facing treads; vertex positions unchanged.']}
for floor in range(5):
 doc={'asset':{'version':'2.0','generator':'Yingxian reproducible web exporter'},'extensionsUsed':['KHR_mesh_quantization'],'extensionsRequired':['KHR_mesh_quantization'],'scene':0,'scenes':[{'nodes':[]}],'nodes':[],'meshes':[],'materials':materials,'buffers':[{'byteLength':0}],'bufferViews':[],'accessors':[]};binary=bytearray();total=0
 def accessor(a,kind,component,target):
  nonlocal_dummy=None
  while len(binary)%4:binary.append(0)
  start=len(binary);storage=a
  if kind=='VEC3':storage=np.pad(a,((0,0),(0,1)))
  binary.extend(storage.tobytes());v=len(doc['bufferViews']);view={'buffer':0,'byteOffset':start,'byteLength':storage.nbytes,'target':target}
  if kind=='VEC3':view['byteStride']=storage.dtype.itemsize*4
  doc['bufferViews'].append(view);ac={'bufferView':v,'componentType':component,'count':len(a),'type':kind}
  if kind=='VEC3':ac.update(min=a.min(axis=0).tolist(),max=a.max(axis=0).tolist())

  if component==5120:ac['normalized']=True
  doc['accessors'].append(ac);return len(doc['accessors'])-1
 for (f,cat,mat),g in groups.items():
  if f!=floor:continue
  p=np.concatenate(g[0]).astype('<f4');n=np.concatenate(g[1]).astype('<f4');ix=np.concatenate(g[2]).reshape(-1).astype('<u4');total+=len(ix)//3
  origin=p.min(axis=0);step=float((p.max(axis=0)-origin).max()/65535);qp=np.round((p-origin)/step).astype('<u2');qn=np.round(np.clip(n,-1,1)*127).astype('i1')
  pa=accessor(qp,'VEC3',5123,34962);na=accessor(qn,'VEC3',5120,34962);ia=accessor(ix,'SCALAR',5125,34963)
  idx=len(doc['meshes']);doc['meshes'].append({'name':f'L{floor+1} / {cat} / {materials[mat]["name"]}','primitives':[{'attributes':{'POSITION':pa,'NORMAL':na},'indices':ia,'material':mat}]});doc['nodes'].append({'mesh':idx,'translation':origin.tolist(),'scale':[step]*3,'name':f'{cat}-{idx}','extras':{'category':cat,'floor':floor}});doc['scenes'][0]['nodes'].append(idx)
 doc['buffers'][0]['byteLength']=len(binary);j=json.dumps(doc,separators=(',',':')).encode();j+=b' '*((-len(j))%4);binary.extend(b'\0'*((-len(binary))%4));glb=struct.pack('<III',0x46546c67,2,12+8+len(j)+8+len(binary))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(binary),0x004e4942)+binary
 filename=f'floor-{floor+1}.glb.gz';compressed=gzip.compress(glb,compresslevel=6,mtime=0);(OUT/filename).write_bytes(compressed);manifest['files'].append({'url':filename,'floor':floor,'bytes':len(compressed),'decodedBytes':len(glb),'triangles':total,'drawCalls':len(doc['meshes'])});print('WEB_FLOOR',floor,total,len(compressed),flush=True)
assert len(tile_normal_audit)==18, f'Expected 18 ceramic shell groups, got {len(tile_normal_audit)}'
(OUT/'tile-normal-audit.json').write_text(json.dumps({'groups':tile_normal_audit,'sourceUnchanged':True},indent=2))
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2));print('WEB_EXPORT_DONE',flush=True)

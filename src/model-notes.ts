import {t as translate} from './i18n';
/** Notes for the Blender edition only; the preserved legacy page retains its original record. */
export function installModelNotes(){
 const rows=[
  ['当前 Blender 研究模型','目前 Blender 研究模型','Current Blender research model'],
  ['本版载入当前精细建模候选稿，提供楼层筛选、屋面与围护隐藏、内槽剖看和构件近景。模型尚有待考证与未完成细部，不代表测绘复原已经完成。','本版載入目前精細建模候選稿，提供樓層篩選、屋面與圍護隱藏、內槽剖看和構件近景。模型仍有待考證與未完成細部，不代表測繪復原已經完成。','This edition loads the current detailed Blender candidate, with storey selection, roof and enclosure visibility, cutaway inspection and close views. Some details remain estimated or unfinished; this is not a completed survey reconstruction.'],
  ['尺度与近似范围','尺度與近似範圍','Scale and approximations'],
  ['当前模型包围盒高度约 65.92 米，含台基与塔刹，是模型几何尺寸，并非新增测量结果。文献中的 67.31 米与 65.838 米具有不同测量背景，不能直接互换。','目前模型包圍盒高度約 65.92 公尺，含臺基與塔剎，是模型幾何尺寸，並非新增測量結果。文獻中的 67.31 公尺與 65.838 公尺具有不同測量背景，不能直接互換。','The current model is approximately 65.92 m tall including its base and finial. This is a geometric model dimension, not a new measurement. Published heights of 67.31 m and 65.838 m have different measurement contexts and are not interchangeable.'],
  ['五层六檐的形制与内槽构件在当前候选稿中表达；部分斗拱、连接、屋面与装饰仍为近似。剖切面不封口，楼层展开仅作展示，不表示施工或拆卸顺序。','五層六簷的形制與內槽構件在目前候選稿中表達；部分斗栱、連接、屋面與裝飾仍為近似。剖切面不封口，樓層展開僅作展示，不表示施工或拆卸順序。','The candidate expresses five storeys, six eaves and inner framing. Some brackets, joints, roofs and ornament remain approximate. Clipping surfaces are open; separation illustrates the model and is not a construction or dismantling sequence.'],
  ['网页资产与原稿','網頁資產與原稿','Web assets and original model'],
  ['网页模型从 Blender 候选稿导出，移除微小倒角并简化高密度网格，以 PBR 色彩近似原程序化材质。原始 Blender 文件未修改。展陈背景不复原真实寺院环境。','網頁模型從 Blender 候選稿匯出，移除微小倒角並簡化高密度網格，以 PBR 色彩近似原程序化材質。原始 Blender 檔案未修改。展陳背景不復原真實寺院環境。','Web geometry is exported from the Blender candidate with small bevels removed and dense meshes simplified. PBR colours approximate the procedural Blender materials. The original Blender file is unchanged. The display environment does not reconstruct the temple grounds.'],
  ['打开原版展陈 ↗','開啟原版展陳 ↗','Open the original exhibition ↗']
 ];
 const dialog=document.querySelector('#source-dialog')!;
 // Replace edition-specific prose, keeping the established reference index.
 const articles=[...dialog.querySelectorAll('article')].map(n=>n.outerHTML).join('');

 function render(){const lang=document.documentElement.lang;const i=lang==='en'?2:lang==='zh-TW'?1:0;const t=(n:number)=>rows[n][i];dialog.innerHTML=`${`<div class="dialog-head"><span>${i===2?'RESEARCH ARCHIVE / 02':i===1?'研究檔案 / 02':'研究档案 / 02'}</span><button id="close-sources">${i===2?'Close ×':i===1?'關閉 ×':'关闭 ×'}</button></div>`}<h2>${t(0)}</h2><p>${t(1)}</p><h3>${t(2)}</h3><p>${t(3)}</p><p>${t(4)}</p>${articles}<h3>${t(5)}</h3><p>${t(6)}</p><a href="/legacy.html?lang=${lang}">${t(7)}</a>`;const walker=document.createTreeWalker(dialog,NodeFilter.SHOW_TEXT);while(walker.nextNode())walker.currentNode.textContent=translate(walker.currentNode.textContent||'');dialog.querySelector<HTMLButtonElement>('#close-sources')!.onclick=()=> (dialog as HTMLDialogElement).close();}
 render();new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
}

export type Language = 'zh-CN' | 'zh-TW' | 'en';
const rows: [string,string,string][] = [
["应县木塔匾额位置记录", "應縣木塔匾額位置記錄", "Plaque locations at Yingxian Wooden Pagoda"],["张松，《辽沈晚报》，中新网转载，2013-02-20", "張松，《遼瀋晚報》，中新網轉載，2013-02-20", "Zhang Song, Liaoshen Evening News; China News repost, 2013-02-20"],["南面主要匾额的明层位置；永镇金城位于北面首层副阶。纪年有冲突，本版不据此标注题写年份。", "南面主要匾額的明層位置；永鎮金城位於北面首層副階。紀年有衝突，本版不據此標註題寫年份。", "Locates principal southern plaques and Yong Zhen Jin Cheng on the north ground-storey outer colonnade. Conflicting dates are not presented as established inscription dates."],["只引用匾额位置事实，不分发照片。", "只引用匾額位置事實，不分發照片。", "Plaque-location facts cited only; photographs are not redistributed."],
['木构千年','木構千年','A Millennium in Timber'],['木构千年首页','木構千年首頁','A Millennium in Timber — home'],
['应县木塔','應縣木塔','Yingxian Wooden Pagoda'],['资料与说明','資料與說明','Sources & notes'],
['山西 · 应县 \u00a0 / \u00a0 辽代木构','山西 · 應縣 \u00a0 / \u00a0 遼代木構','YINGXIAN, SHANXI / LIAO DYNASTY'],
['一榫一卯，','一榫一卯，','Joined in timber.'],['撑起千年。','撐起千年。','Standing through centuries.'],
['肇建','肇建','Built'],['年','年','CE'],['形制','形制','Form'],['五层六檐 · 八角','五層六簷 · 八角','Five storeys · Six eaves · Octagonal'],
['基于公开资料的外观视觉复刻','基於公開資料的外觀視覺復刻','Exterior study from public sources'],['数字展陈环境 · 非测绘模型','數位展陳環境 · 非測繪模型','Digital setting · Not a survey model'],
['佛宫寺释迦塔','佛宮寺釋迦塔','Sakyamuni Pagoda, Fogong Temple'],['01 / 木构遗产','01 / 木構遺產','01 / TIMBER HERITAGE'],['观 察','觀 察','VIEWS'],
['三分之四','四分之三','Three-quarter'],['正面','正面','Front'],['侧面','側面','Side'],['俯视','俯視','Top'],['低机位','低機位','Low angle'],['斗拱近景','斗栱近景','Brackets'],
['实时三维','即時三維','Live 3D'],['/ \u00a0 拖动旋转 · 滚动缩放','/ \u00a0 拖曳旋轉 · 滾動縮放','/ Drag to orbit · Scroll to zoom'],
['白模','白模','Clay'],['傍晚','傍晚','Dusk'],['楼层展开','樓層展開','Explode'],['更多','更多','More'],['复位 ↺','重設 ↺','Reset ↺'],
['自动环绕','自動環繞','Auto orbit'],['关闭','關閉','Off'],['开启','開啟','On'],['隐藏界面','隱藏介面','Hide interface'],['显示界面','顯示介面','Show interface'],
['画面质量','畫面品質','Quality'],['精细','精細','Detailed'],['流畅','流暢','Smooth'],['保存当前视角 · 不含界面','儲存目前視角 · 不含介面','Save this view · Without interface'],
['导出 4K PNG','匯出 4K PNG','Export 4K PNG'],['导出 1920 × 1080','匯出 1920 × 1080','Export 1920 × 1080'],
['展示性分层 · 不代表真实拆卸顺序','展示性分層 · 不代表真實拆卸順序','Exploded display · Not a dismantling sequence'],
['正在生成木构与屋面几何…','正在產生木構與屋面幾何…','Generating timber structure and roofs…'],
['研究档案 / 01','研究檔案 / 01','RESEARCH ARCHIVE / 01'],['关闭 ×','關閉 ×','Close ×'],['有所依据，','有所依據，','Grounded in evidence.'],['也有所保留。','也有所保留。','Open about its limits.'],
['这一版呈现应县木塔的建筑外观。轮廓以八角平面、五层六檐、首层重檐及上层柱廊为依据，细部经过适合实时观看的简化。','這一版呈現應縣木塔的建築外觀。輪廓以八角平面、五層六簷、首層重簷及上層柱廊為依據，細部經過適合即時觀看的簡化。','This edition studies the pagoda’s exterior: its octagonal plan, five storeys and six eaves, double-eaved ground floor, and upper colonnades. Details are simplified for real-time viewing.'],
['尺度与近似范围','尺度與近似範圍','Dimensions and approximations'],
['总高采用官方申报资料的','總高採用官方申報資料的','The overall height follows the official submission: '],['67.31 米','67.31 公尺','67.31 m'],
['，从展示地面至塔刹顶，包含台基。研究院另记录 2011 年从正南地面测得','，從展示地面至塔剎頂，包含臺基。研究院另記錄 2011 年從正南地面測得',' from the display ground to the finial, including the base. A separate 2011 measurement by the research institute, from the southern ground level, records '],
['65.838 米','65.838 公尺','65.838 m'],['；两者不能作为同一测量基准直接互换。底层含副阶面阔','；兩者不能作為同一測量基準直接互換。底層含副階面闊','; the two figures cannot be treated as interchangeable survey datums. The ground-floor span, including the peripheral corridor, is '],
['30.27 米','30.27 公尺','30.27 m'],['，资料未在该段明示对边或对角，本模型暂按对角跨度处理。','，資料未在該段明示對邊或對角，本模型暫按對角跨度處理。','. The cited passage does not specify a face-to-face or vertex-to-vertex span; this model provisionally uses the latter.'],
['逐层标高、收分、出檐、曲率、台基、柱径与斗拱细部均为参数化视觉近似，未经完整测绘图核定。没有复原全部暗层内构、榫卯、佛像、原匾书法、彩画图样和现状倾斜。为保持无缝展陈地面，本版省略突出于八角台基之外的方形下台基层。八块主要匾额按南北朝向与明层布置，释迦塔采用竖匾。匾额尺寸与色彩为视觉近似，系统楷体字面不等于原匾书法。展开仅为展示性分层。','逐層標高、收分、出簷、曲率、臺基、柱徑與斗栱細部均為參數化視覺近似，未經完整測繪圖核定。沒有復原全部暗層內構、榫卯、佛像、原匾書法、彩畫圖樣和現狀傾斜。為保持無縫展陳地面，本版省略突出於八角臺基之外的方形下臺基層。八塊主要匾額按南北朝向與明層布置，釋迦塔採用豎匾。匾額尺寸與色彩為視覺近似，系統楷體字面不等於原匾書法。展開僅為展示性分層。','Storey elevations, taper, eave projection, curvature, base, column diameters and bracket details are adjustable visual approximations, not verified against a complete survey. Hidden-storey interiors, joinery, statues, original calligraphy, painted decoration and existing deformation are not fully reproduced. For a seamless exhibition floor, this edition omits the square lower plinth projecting beyond the octagonal base. Eight principal plaques follow the south/north elevations and visible storeys, including the vertical Shijia Ta plaque. Dimensions and colours are visual approximations; system calligraphic fonts do not reproduce the original brushwork. The exploded view is for display only.'],
['参考索引','參考索引','Reference index'],['数字展陈与资源','數位展陳與資源','Display setting and assets'],
['暖灰背景、地面及日光/傍晚照明为展陈设计，不复原寺院周边。所有三维几何与纹理在本地程序生成，固定种子；没有用整幅建筑照片替代模型。字体调用设备自带宋体与无衬线字体，不分发商业字体。','暖灰背景、地面及日光／傍晚照明為展陳設計，不復原寺院周邊。所有三維幾何與紋理在本機以固定種子產生；沒有用整幅建築照片替代模型。字型使用裝置自帶宋體與無襯線字型，不散布商業字型。','The warm-grey backdrop, ground and daylight/dusk lighting form a designed exhibition setting, not a reconstruction of the temple surroundings. Geometry and textures are generated locally with a fixed seed; building photographs do not substitute for the model. Fonts come from the device’s installed serif and sans-serif families; commercial font files are not distributed.'],
['木构千年 · 第一版 / 外观视觉复刻','木構千年 · 第一版 / 外觀視覺復刻','A Millennium in Timber · Edition 1 / Exterior visual study'],['不用于测绘、文物修复或结构工程判断。','不用於測繪、文物修復或結構工程判斷。','Not for surveying, heritage restoration or structural engineering decisions.'],
['应县木塔三维展陈。拖动旋转，滚轮或双指缩放。','應縣木塔三維展陳。拖曳旋轉，滾輪或雙指縮放。','Interactive Yingxian pagoda. Drag to orbit; scroll or pinch to zoom.'],
['交互式木塔。方向键转动，加减号缩放。','互動式木塔。方向鍵轉動，加減號縮放。','Interactive pagoda. Use arrow keys to orbit and plus/minus to zoom.'],
['预设视角','預設視角','Preset views'],['复位相机与所有展陈设置','重設相機與所有展陳設定','Reset camera and all display settings'],['展陈设置','展陳設定','Display settings'],['关闭资料与说明','關閉資料與說明','Close sources and notes'],
['当前浏览器无法启用 WebGL 2。请使用支持硬件加速的现代浏览器重新打开。','目前瀏覽器無法啟用 WebGL 2。請使用支援硬體加速的現代瀏覽器重新開啟。','WebGL 2 is unavailable. Please open this exhibition in a modern browser with hardware acceleration.'],
['图形上下文已丢失，请刷新页面恢复展陈。','圖形環境已中斷，請重新整理頁面以恢復展陳。','The graphics context was lost. Reload the page to restore the exhibition.'],
['图片已导出，已恢复交互画面。','圖片已匯出，已恢復互動畫面。','Image exported. Interactive view restored.'],['可在更多中选择较低分辨率。','可在「更多」中選擇較低解析度。','Choose a lower resolution under More.'],
['设备无法导出 4K，请选择 1920 × 1080。','裝置無法匯出 4K，請選擇 1920 × 1080。','This device cannot export 4K. Choose 1920 × 1080.'],['显存不足，请尝试 1920 × 1080。','顯示記憶體不足，請嘗試 1920 × 1080。','Insufficient graphics memory. Try 1920 × 1080.'],['PNG 编码失败','PNG 編碼失敗','PNG encoding failed'],
['写不尽的应县木塔！','寫不盡的應縣木塔！','The many stories of Yingxian Wooden Pagoda'],['山西省文化和旅游厅政务账号，2020-12-28','山西省文化和旅遊廳政務帳號，2020-12-28','Shanxi Department of Culture and Tourism, 28 December 2020'],
['方形下台基与八角上台基；平缓檐角；第三层释迦塔、第五层峻极神工题名与位置。','方形下臺基與八角上臺基；平緩簷角；第三層「釋迦塔」、第五層「峻極神工」題名與位置。','Square lower base and octagonal upper base; restrained eave lift; titles and locations of the third- and fifth-storey plaques.'],['只引用事实，不复制原书法或照片。','只引用事實，不複製原書法或照片。','Facts cited only; original calligraphy and photographs are not reproduced.'],
['辽代木构建筑 · 世界遗产预备名录 5803','遼代木構建築 · 世界遺產預備名錄 5803','Liao Dynasty wooden structures · UNESCO Tentative List 5803'],['中国联合国教科文组织全国委员会 / UNESCO，2013','中國聯合國教科文組織全國委員會 / UNESCO，2013','Chinese National Commission for UNESCO / UNESCO, 2013'],
['1056 年；地面至塔尖 67.31 米；八角、五层六檐、五明四暗；双圈柱。预备名录不等于已列入世界遗产。','1056 年；地面至塔尖 67.31 公尺；八角、五層六簷、五明四暗；雙圈柱。預備名錄不等於已列入世界遺產。','1056; 67.31 m from ground to finial; octagonal plan; five visible storeys, four hidden storeys and six eaves; two column rings. Tentative listing is not World Heritage inscription.'],['只引用事实并链接；不再分发网页照片。','只引用事實並連結；不再散布網頁照片。','Facts and links only; website photographs are not redistributed.'],
['应县木塔变形的过去、现在与将来','應縣木塔變形的過去、現在與將來','Deformation of Yingxian Wooden Pagoda: past, present and future'],['吴育华、永昕群，中国文化遗产研究院；论文集，2020 年文件','吳育華、永昕群，中國文化遺產研究院；論文集，2020 年文件','Wu Yuhua and Yong Xinqun, Chinese Academy of Cultural Heritage; proceedings, file dated 2020'],
['第 409 页：2011 年正南面地面至顶 65.838 米；含副阶面阔 30.27 米；2011 年正南照片。第 411 页历史摄影。第 412 页：二层外槽 24 柱。','第 409 頁：2011 年正南面地面至頂 65.838 公尺；含副階面闊 30.27 公尺；2011 年正南照片。第 411 頁歷史攝影。第 412 頁：二層外槽 24 柱。','Page 409: 2011 southern ground-to-top measurement of 65.838 m, span of 30.27 m including the corridor, and a dated southern photograph. Page 411: historical photographs. Page 412: 24 outer columns on the second storey.'],['版权未明确开放；仅研究观察，照片不包含在发布项目中。','版權未明確開放；僅研究觀察，照片不包含在發布專案中。','No explicit open reuse licence; used for research observation only. Photographs are not included in this project.'],
['应县木塔现状结构残损分析及修缮探讨','應縣木塔現狀結構殘損分析及修繕探討','Structural damage and repair of Yingxian Wooden Pagoda'],['《工程力学》22 卷增刊，2005，中国力学学会论文平台','《工程力學》22 卷增刊，2005，中國力學學會論文平台','Engineering Mechanics, volume 22 supplement, 2005; Chinese Society of Theoretical and Applied Mechanics'],
['明暗层剖面与八角柱网参考；不据此宣称精密结构复原。','明暗層剖面與八角柱網參考；不據此宣稱精密結構復原。','Reference for visible/hidden-storey sections and octagonal column layout, not evidence of a precise structural reconstruction.'],['仅引用与链接；不分发原图。','僅引用與連結；不散布原圖。','Citations and links only; original diagrams are not distributed.'],
['山西古建筑 · 应县木塔实景摄影','山西古建築 · 應縣木塔實景攝影','Shanxi architecture · Photographs of Yingxian Wooden Pagoda'],['当代中国，2023 年页面；照片拍摄日期未标注','當代中國，2023 年頁面；照片拍攝日期未標註','Our China Story, page dated 2023; photograph capture date unspecified'],
['屋面灰瓦、灰褐木构、残留朱色、檐下阴影与总体收分的辅助目视参考。','屋面灰瓦、灰褐木構、殘留朱色、簷下陰影與總體收分的輔助目視參考。','Supplementary visual reference for grey tiles, weathered timber, surviving red colour, shadows below eaves and overall taper.'],['仅目视参考，未取得再分发授权，不用作贴图。','僅目視參考，未取得再散布授權，不用作貼圖。','Visual reference only; no redistribution permission obtained and no photograph used as a texture.'],
];
const lookup=new Map<string,[string,string,string]>();for(const row of rows)for(const value of row)lookup.set(value.trim(),row);
let language:Language='zh-CN';
try{
 const query=new URLSearchParams(location.search).get('lang');
 const saved=query==='en'||query==='zh-TW'||query==='zh-CN'?query:localStorage.getItem('pagoda-language');
 if(saved==='en'||saved==='zh-TW'||saved==='zh-CN')language=saved;
}catch{/* Storage may be disabled. */}
export function t(text:string):string {const key=text.trim();const arrow=key.endsWith(' ↗');const row=lookup.get(arrow?key.slice(0,-2):key);if(arrow&&row)return text.replace(key,row[language==='en'?2:language==='zh-TW'?1:0]+' ↗');return row?text.replace(key,row[language==='en'?2:language==='zh-TW'?1:0]):text;}
export function rendering(width:number,height:number){return language==='en'?`Rendering ${width} × ${height} image…`:language==='zh-TW'?`正在算繪 ${width} × ${height} 圖片…`:`正在渲染 ${width} × ${height} 图片…`;}
export function localize(){
 document.documentElement.lang=language;document.body.dataset.language=language;
 document.title=language==='en'?'A Millennium in Timber · Yingxian Wooden Pagoda':language==='zh-TW'?'木構千年 · 應縣木塔 | Yingxian Wooden Pagoda':'木构千年 · 应县木塔 | Yingxian Wooden Pagoda';
 document.querySelector('meta[name="description"]')?.setAttribute('content',language==='en'?'Explore a real-time exterior study of Yingxian Wooden Pagoda, based on public references.':language==='zh-TW'?'木構千年：基於公開資料的應縣木塔三維外觀視覺復刻與互動展陳。':'木构千年：基于公开资料的应县木塔三维外观视觉复刻与交互展陈。');
 const root=document.querySelector('#app')!;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const node=walker.currentNode;if(node.parentElement?.closest('#language,#notice'))continue;node.textContent=t(node.textContent||'');}
 root.querySelectorAll<HTMLElement>('[aria-label]').forEach(e=>{if(e.id!=='language')e.setAttribute('aria-label',t(e.getAttribute('aria-label')!));});
 const select=document.querySelector<HTMLSelectElement>('#language');if(select)select.value=language;
}
export function bindLanguage(){localize();document.querySelector<HTMLSelectElement>('#language')!.onchange=e=>{language=(e.target as HTMLSelectElement).value as Language;try{localStorage.setItem('pagoda-language',language);const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);}catch{/* Keep the in-memory selection usable. */}document.querySelector('#notice')?.classList.remove('visible');localize();};}

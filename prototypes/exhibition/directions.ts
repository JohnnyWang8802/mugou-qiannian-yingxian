export const directions = [
 {id:'quiet',name:'静观',axis:'建筑摄影与克制铭牌',number:'01'},
 {id:'atlas',name:'图录',axis:'以构造目录组织探索',number:'02'},
 {id:'nocturne',name:'夜展',axis:'沉浸观看与渐进显露操作',number:'03'},
] as const;
export const dictionary = {
 pageTitle:['木构千年 · 交互设计研究','木構千年 · 互動設計研究','A Millennium in Timber · Design study'],
 canvasHelp:['三维木塔：拖动旋转，双指或滚轮缩放；方向键旋转，加减键缩放。','三維木塔：拖曳旋轉，雙指或滾輪縮放；方向鍵旋轉，加減鍵縮放。','3D pagoda: drag to orbit, pinch or scroll to zoom; arrow keys rotate, + / − zoom.'],
 renderFailure:['画面未能初始化，请重新载入。','畫面未能初始化，請重新載入。','The scene could not initialize. Please reload.'],
 contextLost:['图形连接已中断，请重新载入。','圖形連線已中斷，請重新載入。','The graphics connection was lost. Please reload.'],
 exportFailure:['图片未能生成，请降低画面质量后重试。','圖片未能產生，請降低畫面品質後重試。','The image could not be generated. Lower the quality and try again.'],
 motionDisabled:['系统已启用减少动态效果','系統已啟用減少動態效果','Reduced motion is enabled in your system'],

 quiet:['静观','靜觀','Quiet'],atlas:['图录','圖錄','Atlas'],nocturne:['夜展','夜展','Nocturne'],designDirections:['设计方案','設計方案','Design directions'],
 brand:['木构千年','木構千年','A Millennium in Timber'], title:['应县木塔','應縣木塔','Yingxian'],subtitle:['Yingxian Wooden Pagoda','Yingxian Wooden Pagoda','Wooden Pagoda'],place:['山西 · 应县','山西 · 應縣','YINGXIAN · SHANXI'],era:['辽代木构','遼代木構','LIAO DYNASTY'],
 observe:['观塔','觀塔','Observe'],study:['解构','解構','Explore'],sources:['档案','檔案','Archive'],settings:['设置','設定','Settings'],close:['关闭','關閉','Close'],back:['返回全貌','返回全貌','Whole pagoda'],full:['全貌','全貌','Whole'],front:['正面','正面','Front'],side:['侧面','側面','Side'],top:['俯视','俯視','Above'],low:['仰观','仰觀','Below'],bracket:['斗栱','斗栱','Brackets'],inner:['梁架','梁架','Frame'],finial:['塔刹','塔剎','Finial'],
 chapter:['木构遗产 · 第一辑','木構遺產 · 第一輯','TIMBER HERITAGE / 01'],form:['五层六檐 · 八角','五層六簷 · 八角','FIVE STOREYS · SIX EAVES'],shape:['五层六檐','五層六簷','Five storeys. Six eaves.'],verse:['一榫一卯，撑起千年。','一榫一卯，撐起千年。','Joined in timber. Standing through centuries.'],hint:['拖动观塔 · 双指或滚轮缩放','拖曳觀塔 · 雙指或滾輪縮放','Drag to orbit · Pinch or scroll to zoom'],view:['视角','視角','View'],built:['肇建','肇建','BUILT'],research:['外观研究模型','外觀研究模型','EXTERIOR STUDY'],scope:['基于公开资料的视觉复刻，非测绘模型。','基於公開資料的視覺復刻，非測繪模型。','A visual reconstruction from public sources; not a measured survey.'],
 begin:['走近木构','走近木構','Look closer'],sequence:['观看目录','觀看目錄','FIELD INDEX'],wholeDescription:['从八角轮廓，到檐下层叠的木构。','從八角輪廓，到簷下層疊的木構。','From the octagonal silhouette to the layered timber beneath the eaves.'],bracketDescription:['靠近二层檐下，观察构件的出挑与叠置。','靠近二層簷下，觀察構件的出挑與疊置。','Look beneath the second-storey eaves, where timber members project and interlock.'],innerDescription:['移开屋面与围护，观察二层梁架。','移開屋面與圍護，觀察二層梁架。','Remove roofs and enclosure to reveal the second-storey frame.'],finialDescription:['仰望塔顶，观察塔刹的轮廓与连接。','仰望塔頂，觀察塔剎的輪廓與連接。','Move to the crown to examine the finial and its connections.'],
 display:['显示','顯示','Display'],roofs:['屋面','屋面','Roofs'],walls:['围护','圍護','Enclosure'],clay:['白模','白模','Clay'],separate:['楼层展开','樓層展開','Separate storeys'],separationNote:['展示性分层，不代表真实拆卸顺序。','展示性分層，不代表真實拆卸順序。','Illustrative separation, not a dismantling sequence.'],floor:['楼层','樓層','Storey'],all:['全部','全部','All'],restore:['复位','重設','Reset'],capture:['保存视角','儲存視角','Save view'],saved:['图片已保存','圖片已儲存','Image saved'],saving:['正在生成图片…','正在生成圖片…','Preparing image…'],retry:['重新载入','重新載入','Retry'],failure:['模型未能载入，请重试。','模型未能載入，請重試。','The model could not load. Please retry.'],unavailable:['当前浏览器无法启用 WebGL 2。','目前瀏覽器無法啟用 WebGL 2。','WebGL 2 is unavailable in this browser.'],loading:['载入模型','載入模型','Loading model'],preparing:['准备展陈','準備展陳','Preparing exhibition'],language:['语言','語言','Language'],orbit:['缓慢环绕','緩慢環繞','Slow orbit'],quality:['画面质量','畫面品質','Quality'],high:['精细','精細','Detailed'],lowQuality:['流畅','流暢','Smooth'],notes:['有所依据，也有所保留。','有所依據，也有所保留。','Evidence, with room for uncertainty.'],references:['参考资料','參考資料','References'],modelNote:['当前展陈使用既有模型；构件、连接及屋面曲线仍包含近似。展陈环境不复原寺院周边。','目前展陳使用既有模型；構件、連接及屋面曲線仍包含近似。展陳環境不復原寺院周邊。','This exhibition uses the existing model. Members, joints and roof profiles include estimates. The display environment does not recreate the temple grounds.'],
} as const;
export type Word=keyof typeof dictionary;

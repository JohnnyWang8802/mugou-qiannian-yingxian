/** Metres. Only overall height and base span are source backed; all component dimensions are visual estimates. */
export const ARCH = {
  height: 67.31, baseSpan: 30.27, baseHeight: 3.8, seed: 1056,
  provenance: {height:'UNESCO tentative list 5803: ground to finial, 67.31 m',baseSpan:'Wu & Yong, p.409: 30.27 m including peripheral corridor; orientation of span not specified. Here treated as opposite vertices.',estimated:'All elevations, radii, roof curvature and member dimensions below are adjustable visual estimates, not survey data.'},
  baseRadius:18.5, columnDiameter:.62, bracketStep:.28, railHeight:1.25,
  roofs: [
    {name:'首层副阶檐',floor:0,eave:9.55,top:13.4,outer:17.5,inner:11.85,lift:.48,curve:1.65},
    {name:'一层主檐',floor:0,eave:16.65,top:18.8,outer:15.35,inner:11.6,lift:.58,curve:1.7},
    {name:'二层檐',floor:1,eave:27.0,top:28.4,outer:15.05,inner:11.05,lift:.62,curve:1.65},
    {name:'三层檐',floor:2,eave:36.65,top:37.65,outer:14.5,inner:10.5,lift:.6,curve:1.7},
    {name:'四层檐',floor:3,eave:45.9,top:46.9,outer:13.85,inner:10.0,lift:.6,curve:1.7},
    {name:'五层攒尖顶',floor:4,eave:54.95,top:60.8,outer:13.25,inner:.85,lift:.5,curve:1.35},
  ],
  floors:[
    {name:'第一明层 · 重檐',base:3.8,postTop:14.65,radius:12.2,core:9.65,rail:false,brackets:4},
    {name:'第二明层',base:20.1,postTop:25.0,radius:11.6,core:8.2,rail:true,brackets:5},
    {name:'第三明层',base:29.8,postTop:34.65,radius:11.05,core:7.9,rail:true,brackets:5},
    {name:'第四明层',base:39.05,postTop:43.9,radius:10.5,core:7.6,rail:true,brackets:4},
    {name:'第五明层',base:48.3,postTop:52.95,radius:10,core:7.25,rail:true,brackets:4},
  ],
  detail:{roofUSegments:144,roofVSegments:28,tilePitch:.27,roofThickness:.19},
  explodeGap:8,
} as const;
export const SOURCES=[
 {title:'写不尽的应县木塔！',author:'山西省文化和旅游厅政务账号，2020-12-28',url:'https://m.thepaper.cn/baijiahao_10573858',supports:'方形下台基与八角上台基；平缓檐角；第三层释迦塔、第五层峻极神工题名与位置。',rights:'只引用事实，不复制原书法或照片。'},
 {title:'辽代木构建筑 · 世界遗产预备名录 5803',author:'中国联合国教科文组织全国委员会 / UNESCO，2013',url:'https://whc.unesco.org/en/tentativelists/5803/',supports:'1056 年；地面至塔尖 67.31 米；八角、五层六檐、五明四暗；双圈柱。预备名录不等于已列入世界遗产。',rights:'只引用事实并链接；不再分发网页照片。'},
 {title:'应县木塔变形的过去、现在与将来',author:'吴育华、永昕群，中国文化遗产研究院；论文集，2020 年文件',url:'https://www.cactch.org.cn/webfile/upload/2020/12-21/16-01-480186-1686115651.pdf',supports:'第 409 页：2011 年正南面地面至顶 65.838 米；含副阶面阔 30.27 米；2011 年正南照片。第 411 页历史摄影。第 412 页：二层外槽 24 柱。',rights:'版权未明确开放；仅研究观察，照片不包含在发布项目中。'},
 {title:'应县木塔现状结构残损分析及修缮探讨',author:'《工程力学》22 卷增刊，2005，中国力学学会论文平台',url:'https://pubs.cstam.org.cn/data/article/em/preview/pdf/2005S130.pdf',supports:'明暗层剖面与八角柱网参考；不据此宣称精密结构复原。',rights:'仅引用与链接；不分发原图。'},
 {title:'山西古建筑 · 应县木塔实景摄影',author:'当代中国，2023 年页面；照片拍摄日期未标注',url:'https://www.ourchinastory.com/en/12321/Shanxi%3A-Museum-of-ancient-Chinese-architecture',supports:'屋面灰瓦、灰褐木构、残留朱色、檐下阴影与总体收分的辅助目视参考。',rights:'仅目视参考，未取得再分发授权，不用作贴图。'},
];

import {defineConfig} from 'vite';
export default defineConfig({build:{target:'es2022',rollupOptions:{input:{main:'index.html',legacy:'legacy.html',review:'design-review.html'},output:{manualChunks:{three:['three','three/addons/controls/OrbitControls.js','three/addons/geometries/RoundedBoxGeometry.js']}}}},server:{host:'127.0.0.1',port:5173,strictPort:true}});

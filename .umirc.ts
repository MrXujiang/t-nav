import { defineConfig } from "umi";

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  routes: [
    { path: "/h5", component: "share", layout: false },
    { path: "/", component: "index" },
    { path: "/midPage", component: "midPage" },
  ],
  metas: [
    { name: 'keywords', content: '橙讯点评,工具,软件分享,热门工具推荐,在线工具,APP精选' },
    { name: 'description', content: '专注于分享前沿实用的互联网软件及工具' },
  ],
  title: '橙讯点评',
  publicPath: '/tool/',
  npmClient: 'pnpm',
  outputPath: '../basic-services/static/tool',
  define: {
    // https://192.168.3.7:3000
    // https://192.168.31.105:3000
    serverApi: 'https://www.turntip.cn'
    // serverApi: isDev ? 'https://192.168.31.105:3000' : 'https://www.turntip.cn'
  },
  scripts: [`
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?f8591e98fdeee2e20d80b6f3cda54212";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  })();
  `]
});

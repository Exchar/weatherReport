import { createApp } from "vue";
// @ts-ignore
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/globalMethod";
import naiveUI from "./plugins/naiveUI";
// 引入全局样式
import "./assets/style/reset.css";
// @ts-ignore
import WeatherIcon from "@/components/WeatherIcon.vue";
import 'dayjs/locale/zh-cn';
// 汉化
dayjs.locale('zh-cn');

// 拆分配置
const app = createApp(App);
const apiKey = import.meta.env.VITE_API_KEY;
window.projectConfig = {
  // 和风天气api key
  apiKey,

  //   高德地图apikey
  goodApiKey: "db332095568d582b8b72cc0e874dd63c",
  secretKey: 'cb1d95d1695f2c8d6395af080a795b3a'
};
const {goodApiKey,secretKey} = window.projectConfig;
// eslint-disable-next-line no-underscore-dangle
window._AMapSecurityConfig = {
  securityJsCode: secretKey,
};
window.AMapLoader.load({
  "key": goodApiKey,              // 申请好的Web端开发者Key，首次调用 load 时必填
  "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  "plugins": [],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
}).then((AMap:any)=>{
  console.log('加载AMap完成',AMap);
  window.AMap = AMap;
}).catch((e)=>{
  console.error(e);  // 加载错误提示
});
//  注册naiveui控件
app.use(naiveUI);
// 注册路由和vuex
app.use(router).use(store);
app.component("WeatherIcon", WeatherIcon);
app.config.globalProperties.$echarts = echarts;

// 挂载到节点
app.mount("#app");

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

//  注册naiveui控件
app.use(naiveUI);
// 注册路由和vuex
app.use(router).use(store);
app.component("WeatherIcon", WeatherIcon);
app.config.globalProperties.$echarts = echarts;

// 挂载到节点
app.mount("#app");

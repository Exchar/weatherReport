import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CreateAxiosDefaults,
} from "axios";
// @ts-ignore
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// 定义服务端接口返回的接口格式，其中data是主要数据
export type Response<T = any> = {
  massage?: string;
  code: number;
  list?: T;
  data?: T;
};
class Request {
  private readonly instance: AxiosInstance;

  constructor(config: CreateAxiosDefaults<any> | undefined) {
    this.instance = axios.create(config);
    //   设置全局拦截器
    // eslint-disable-next-line no-shadow
    this.instance.interceptors.request.use((config) => {
      NProgress.start();
      return config;
    });
    this.instance.interceptors.response.use(
      (res) => {
        console.log("响应拦截", res);
        NProgress.done(true);
        return res;
      },
      () => new Error("接口请求失败")
    );
  }

  getInstance() {
    return this.instance;
  }

  public getWrappedInstance = <T>(config: AxiosRequestConfig) => {
    console.log(this);
    const ins = this.getInstance();
    return new Promise<T>((res, rej) => {
      ins
        .request<T>(config)
        .then((response) => {
          console.log(response);
          if (response && response.data && response.status === 200) {
            res(response.data);
          } else {
            rej(response);
          }
        })
        .catch((err: any) => {
          console.log(err);
          rej(err);
        });
    });
  };
}
//  天气预报api请求
const baseWeatherUrl = import.meta.env.VITE_APP_SERVICE_WEATHER_URL;
console.log(baseWeatherUrl, import.meta);

const weatherAxios = new Request({
  baseURL: baseWeatherUrl,
  timeout: 100000,
}).getWrappedInstance;

// 获取地理位置信息api请求
const baseLocationUrl = import.meta.env.VITE_APP_SERVICE_LOCATION_URL;
console.log(baseLocationUrl);
const locationAxios = new Request({
  baseURL: baseLocationUrl,
  timeout: 100000,
}).getWrappedInstance;
export { weatherAxios, locationAxios };
// export const weatherAxios = <T>(config: AxiosRequestConfig) => {
//   return new Promise<Response<T>>((res, rej) => {
//     weatherAxiosInstance
//       .request<Response<T>>(config)
//       .then((response) => {
//         console.log(response);
//         if (response && response.data && response.status === 200) {
//           res(response.data);
//         } else {
//           rej(response);
//         }
//       })
//       .catch((err: any) => {
//         console.log(err);
//         rej(err);
//       });
//   });
// };

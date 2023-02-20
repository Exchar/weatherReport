
interface overrideType {
  arrDistinctByProp: (prop: string) => any[];
}
declare global {
  interface Window {
    projectConfig: any;
    projectEnvConfig: any;
    onLoad: any;
    AMap: any;
    getCurrentPosition: any;
    darkTheme: any;
  }
  interface cityInfo {
    // 第一级行政区划
    adm1: string;
    // 第二级行政区划
    adm2: string;
    country: string;
    fxLink: string;
    id: string;
    isDst: string;
    // 经度
    lat: string;
    // 纬度
    lon: string;
    // 地区名
    name: string;
    // 排序
    rank: string;
    type: string;
    tz: string;
    utcOffset: string;
  }

  interface ArrayConstructor {
    // @ts-ignore
    prototype: overrideType;
  }
//   定义风力等级枚举
}
export {};

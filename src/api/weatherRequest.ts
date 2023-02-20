import { weatherAxios } from "../utils/request";

interface RetRealTimeParams {
  // ID或者经纬度
  location: string;
  // apikey
  key: string;
  // 多语言范围
  lang?: string;
  // 	Unit公制单位还是英制单位
  unit?: "m" | "i";
}
export interface WeatherResponseNow {
  obsTime: string;
  temp: string;
  feelsLike: string;
  icon: string;
  text: string;
  wind360: string;
  windDir: string;
  windScale: string;
  windSpeed: string;
  humidity: string;
  precip: string;
  pressure: string;
  vis: string;
  cloud: string;
  dew: string;
};
export interface RealTimeWeatherResponse {
  now: WeatherResponseNow;
  code: string;
  refer: {
    sources: string;
    license: any;
  };
}
// location(必选)需要查询地区的LocationID或以英文逗号分隔的经度,纬度坐标（十进制，最多支持小数点后两位），LocationID可通过城市搜索服务获取。例如 location=101010100 或 location=116.41,39.92
// key(必选)用户认证key，请参考如何获取你的KEY。支持数字签名方式进行认证。例如 key=123456789ABC
// lang多语言设置，更多语言可选值参考语言代码。当数据不匹配你设置的语言时，将返回英文或其本地语言结果。
// unit数据单位设置，可选值包括unit=m（公制单位，默认）和unit=i（英制单位）。更多选项和说明参考度量衡单位。\
export interface RetDayReportParams {
  location:string,
  key:string,
  lang?:string,
  unit?:'m'|'i'
}



// 每日天气接受的参数
// code API状态码，具体含义请参考状态码
// updateTime 当前API的最近更新时间
// fxLink 当前数据的响应式页面，便于嵌入网站或应用
// now.obsTime 数据观测时间
// now.temp 温度，默认单位：摄氏度
// now.feelsLike 体感温度，默认单位：摄氏度
// now.icon 天气状况和图标的代码，图标可通过天气状况和图标下载
// now.text 天气状况的文字描述，包括阴晴雨雪等天气状态的描述
// now.wind360 风向360角度
// now.windDir 风向
// now.windScale 风力等级
// now.windSpeed 风速，公里/小时
// now.humidity 相对湿度，百分比数值
// now.precip 当前小时累计降水量，默认单位：毫米
// now.pressure 大气压强，默认单位：百帕
// now.vis 能见度，默认单位：公里
// now.cloud 云量，百分比数值。可能为空
// now.dew 露点温度。可能为空
// refer.sources 原始数据来源，或数据源说明，可能为空
// refer.license 数据许可或版权声明，可能为空
export const getRealTimeReport = (params: RetRealTimeParams) =>
  weatherAxios<RealTimeWeatherResponse>({
    url: "/weather/now",
    params,
  });


// 请求每天预报的响应
// code API状态码，具体含义请参考状态码
// updateTime 当前API的最近更新时间
// fxLink 当前数据的响应式页面，便于嵌入网站或应用
// daily.fxDate 预报日期
// daily.sunrise 日出时间，在高纬度地区可能为空
// daily.sunset 日落时间，在高纬度地区可能为空
// daily.moonrise 当天月升时间，可能为空
// daily.moonset 当天月落时间，可能为空
// daily.moonPhase 月相名称
// daily.moonPhaseIcon 月相图标代码，图标可通过天气状况和图标下载
// daily.tempMax 预报当天最高温度
// daily.tempMin 预报当天最低温度
// daily.iconDay 预报白天天气状况的图标代码，图标可通过天气状况和图标下载
// daily.textDay 预报白天天气状况文字描述，包括阴晴雨雪等天气状态的描述
// daily.iconNight 预报夜间天气状况的图标代码，图标可通过天气状况和图标下载
// daily.textNight 预报晚间天气状况文字描述，包括阴晴雨雪等天气状态的描述
// daily.wind360Day 预报白天风向360角度
// daily.windDirDay 预报白天风向
// daily.windScaleDay 预报白天风力等级
// daily.windSpeedDay 预报白天风速，公里/小时
// daily.wind360Night 预报夜间风向360角度
// daily.windDirNight 预报夜间当天风向
// daily.windScaleNight 预报夜间风力等级
// daily.windSpeedNight 预报夜间风速，公里/小时
// daily.precip 预报当天总降水量，默认单位：毫米
// daily.uvIndex 紫外线强度指数
// daily.humidity 相对湿度，百分比数值
// daily.pressure 大气压强，默认单位：百帕
// daily.vis 能见度，默认单位：公里
// daily.cloud 云量，百分比数值。可能为空
// refer.sources 原始数据来源，或数据源说明，可能为空
// refer.license 数据许可或版权声明，可能为空

export interface WeatherDaysReport {
  sunrise: string,
  sunset: string,
  moonrise:string,
  moonset: string,
  // 月相
  moonPhase:string,
  moonPhaseIcon:string,
  tempMax:string,
  tempMin:string,
  iconDay:string,
  textDay:string,
  iconNight:string,
  textNight:string,
  wind360Day:string,
  windDirDay:string,
  windScaleDay:string,
  windSpeedDay:string,
  wind360Night:string,
  windDirNight:string,
  windScaleNight:string,
  windSpeedNight:string,
  uvIndex:string,
  precip:string,
  humidity:string,
  pressure:string,
  vis:string,
  cloud:string,
}
export interface WeatherDaysReportResponse {
  code:string,
  updateTime: string,
  fxLink: string,
  daily:WeatherDaysReport[]
  refer:{
    sources:string[],
    license: string,
  }
}
export const getDaysWeatherReport = (day: 3|7|10|15|30,params:RetDayReportParams)=>
  weatherAxios<WeatherDaysReportResponse>({
    url:`/weather/${day}d`,
    params
});
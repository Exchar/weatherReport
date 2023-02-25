// eslint-disable-next-line no-extend-native
// @ts-ignore
// eslint-disable-next-line no-extend-native
Array.prototype.arrDistinctByProp = function (prop: string) {
  console.log(this);
  const arr = this;
  return arr.filter((item, index, self) => self.findIndex((el) => el[prop] == item[prop]) === index);
};

const apiKey = import.meta.env.VITE_API_KEY;
window.projectConfig = {
  // 和风天气api key
  apiKey,

  //   高德地图apikey
  goodApiKey: "db332095568d582b8b72cc0e874dd63c",
};
// eslint-disable-next-line no-underscore-dangle
window._AMapSecurityConfig = {
  securityJsCode:'cb1d95d1695f2c8d6395af080a795b3a',
};

export {};

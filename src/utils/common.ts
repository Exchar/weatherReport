// @ts-ignore
import {windScaleList} from "@/plugins/dicData";

export const getProjectConfig = (key: string): any => {
  if (window.projectConfig) {
    return window.projectConfig[key] || undefined;
  }
  return undefined;
};

export const getDeviceLocation = async (): Promise<any> => new Promise((resolve, reject) => {
    // const {AMap} = window;
    // AMap.plugin('AMap.CitySearch', () => {
    //   const citySearch = new AMap.CitySearch();
    //   citySearch.getLocalCity((status: any, result: any) => {
    //     console.log(status, result);
    //     if (status === 'complete' && result.info === 'OK') {
    //       // 查询成功，result即为当前所在城市信息
    //       console.log(result);
    //       resolve(result);
    //     } else {
    //       reject(result);
    //     }
    //   });
    // });
  });

// export const getDeviceLocation = (): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     const AMap = window.AMap;
//     AMap.plugin("AMap.Geolocation", function () {
//       const geolocation = new AMap.Geolocation({
//         // 是否使用高精度定位，默认：true
//         enableHighAccuracy: false,
//         // 设置定位超时时间，默认：无穷大
//         timeout: 10000,
//         // 定位按钮的停靠位置的偏移量
//       });
//
//       geolocation.getCurrentPosition(function (status: any, result: any) {
//         if (status == "complete") {
//           onComplete(result);
//         } else {
//           onError(result);
//         }
//       });
//
//       function onComplete(data: any) {
//         // data是具体的定位信息
//         resolve(data);
//       }
//
//       function onError(data: any) {
//         // 定位出错
//         reject(data);
//       }
//     });
//   });
// };

export const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};
export const getLocalStorage = (key: string) => {
  let cacheValue: any | undefined = localStorage.getItem(key);
  try {
    cacheValue = JSON.parse(cacheValue);
  } catch (e) {
    cacheValue = undefined;
  }
  return cacheValue;
};

export const isEmpty = (data: any) => {
  if ([undefined, null, ''].includes(data)) {
    return true;
  }
  return false;
};

export const getWindDicDataByLevel = (level:number)=> {
  const findItem = windScaleList.find(i=>i.level===Number(level)) || undefined;
  // console.log(findItem,level);
  return findItem;
};

export function  initGetWeatherInfo():Promise<{ city:string }> {
  console.log('获取定位信息');
  console.log(navigator.geolocation);
  // 获取定位信息
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        // 获取天气信息
        resolve({city:`${longitude},${latitude}`});

      },(e)=> {
        console.error('使用geolocation获取坐标失败',e);
        const {AMap} = window;
        AMap.plugin('AMap.CitySearch', () => {
          const citySearch = new AMap.CitySearch();
          citySearch.getLocalCity((status: any, result: any) => {
            console.log(status, result);
            if (status === 'complete' && result.info === 'OK') {
              // 查询成功，result即为当前所在城市信息
              console.log(result);
              resolve(result);
            } else {
              reject(result);
            }
          });
        });
      },{
        enableHighAccuracy : true,
        maximumAge: 60000,
        timeout: 5000
      });
    } else {
      console.error('浏览器不支持地理定位!');
      reject(new Error('浏览器不支持地理定位!'));
    }
  });

}

<script setup lang="ts">
import {ref, watch} from 'vue';
import {getProjectConfig, getWindDicDataByLevel} from '@/utils/common';
import {getRealTimeReport, WeatherResponseNow,RealTimeWeatherResponse} from "@/api/weatherRequest";
import WeatherIcon from "@/components/WeatherIcon.vue";
import DaysWeather from "@/views/home/DaysWeather.vue";

const props = defineProps<{
  cityInfo: cityInfo,
}>();
const nowWeatherInfo = ref<WeatherResponseNow>({});
// 获取实时天气
function getNowWeather() {
  getRealTimeReport({
    key: getProjectConfig('apiKey'),
    location:props.cityInfo.id,
  }).then((res: RealTimeWeatherResponse)=> {
    nowWeatherInfo.value = res.now;
  });
}
watch(()=>props.cityInfo,(newCityInfo,oldCityInfo)=> {
  if(newCityInfo && newCityInfo.id && (!oldCityInfo || newCityInfo.id!==oldCityInfo.id)){
    getNowWeather();
  }
},{
  flush: 'post',
  immediate:true,
});
function getWindLevelInfo(level:number) {
  const resData = getWindDicDataByLevel(level);
  return resData?.zh|| '';
}
</script>
<template>
    <n-space vertical class="home-container">
      <div class="home-main-content">
        <div class="top-weather">
          <n-card
              style="height:100%"
              class="main-card"
              embedded
              hoverable
              :bordered="false"
          >
            <div class="main-desc-icon">
              <WeatherIcon v-if="nowWeatherInfo.icon" :icon-name="nowWeatherInfo.icon" style="font-size: 3em"></WeatherIcon>
            </div>
            <p class="main-desc-title">{{nowWeatherInfo.text}}</p>
          </n-card>
        </div>
<!--      todo  每天预报（可切换）-->
        <div class="day-weather-content">
        <DaysWeather :cityInfo="props.cityInfo"></DaysWeather>
        </div>
<!--        todo 24小时天气-->
<!--        天气小项-->
        <div class="top-weather-desc">
          <n-card
              class="weather-desc-card"
              embedded
              hoverable
              :bordered="false"
          >
            <p class="main-desc-title">🤒温度</p>
            <p class="main-desc-content">{{nowWeatherInfo.temp}}℃</p>
          </n-card>
          <n-card
              class="weather-desc-card"
              embedded
              hoverable
              :bordered="false"
          >
            <p class="main-desc-title">🌡️体感温度</p>
            <p class="main-desc-content">{{nowWeatherInfo.feelsLike}}℃</p>
          </n-card>
          <n-card
              class="weather-desc-card"
              embedded
              hoverable
              :bordered="false"
          >
            <p class="main-desc-title">🍃风向</p>
            <p class="main-desc-content">{{nowWeatherInfo.windDir}}</p>
          </n-card>
          <n-card
              class="weather-desc-card"
              embedded
              hoverable
              :bordered="false"
          >
            <p class="main-desc-title">🎐风力等级</p>
            <p class="main-desc-content">
              {{nowWeatherInfo.windScale+"级|"+getWindLevelInfo(Number(nowWeatherInfo.windScale || 1))}}
            </p>
          </n-card>
          <n-card
              class="weather-desc-card"
              embedded
              hoverable
              :bordered="false"
          >
            <p class="main-desc-title">🪁风速</p>
            <p class="main-desc-content">{{nowWeatherInfo.windSpeed}}km/h</p>
          </n-card>
          <n-card
              class="weather-desc-card"
              embedded
              hoverable
              :bordered="false"
          >
            <p class="main-desc-title">👁️‍🗨️能见度</p>
            <p class="main-desc-content">{{nowWeatherInfo.vis}}km</p>
          </n-card>
          <n-card
              class="weather-desc-card"
              v-if="!!nowWeatherInfo.cloud"
              embedded
              hoverable
              :bordered="false"
          >
            <p class="main-desc-title">☁️云量</p>
            <p class="main-desc-content">{{nowWeatherInfo.cloud}}km/h</p>
          </n-card>
          <n-card
              class="weather-desc-card"
              v-if="!!nowWeatherInfo.cloud"
              embedded
              hoverable
              :bordered="false"
          >
            <p class="main-desc-title">💧累计降水量</p>
            <p class="main-desc-content">{{nowWeatherInfo.precip}}mm</p>
          </n-card>
          <n-card
              class="weather-desc-card"
              embedded
              hoverable
              :bordered="false"
          >
            <p class="main-desc-title">🫖大气压强</p>
            <p class="main-desc-content">{{nowWeatherInfo.pressure}}百帕</p>
          </n-card>
          <n-card
              class="weather-desc-card"
              embedded
              hoverable
              :bordered="false"
          >
            <p class="main-desc-title">♨️相对湿度</p>
            <p class="main-desc-content">{{nowWeatherInfo.humidity}}%</p>
          </n-card>
        </div>
      </div>
    </n-space>

</template>
<style lang="scss" scoped>
.home-container{
  height:100%;
}
.home-main-content{
  height: 140px;
  .top-weather{
    height:100%;
    .main-desc-title{
      text-align: center;
      font-size: 1.2em;
    }
    .main-card{
      border-radius:20px;
      width: calc(100% - 32px);
      margin: 0 auto;
    }
  }
}
.main-desc-icon{
  text-align: center;
}
.top-weather-desc{
  width: calc(100% - 16px);
 margin: 16px 0 0 16px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.weather-desc-card{
  flex: 1 1 140px;
  height: 120px;
  border-radius: 10px;
  margin-right:16px;
  margin-bottom: 16px;
  :deep() .n-card__content{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
// 每天预报
.day-weather-content{
  width: calc(100% - 32px);
  margin: 16px 0 0 16px;
  border-radius:10px;
  height: auto;
  overflow: hidden;
}
//今日天气详细
.main-desc-title{
  text-align: left;
  font-family: JetBrainsMono;
  font-size: 1.1em;
  font-weight: bold;
}
.main-desc-content{
  text-align: center;
  font-family: JetBrainsMono;
  font-size: 1.2em;
  font-weight: bold;
}
</style>
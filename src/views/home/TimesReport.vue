<script lang="ts" setup>
import * as echarts from 'echarts';
import {ref, watch} from "vue";
import {EChartsType} from "echarts";
import {ECBasicOption} from "echarts/types/dist/shared";
import dayjs from "dayjs";
import {KeyboardArrowUpRound as ArrowIcon} from '@vicons/material';
import {getTimesWeatherReport, WeatherTimesReport} from "@/api/weatherRequest";
import {getProjectConfig, getWindDicDataByLevel} from "@/utils/common";
import WeatherIcon from "@/components/WeatherIcon.vue";

const props = defineProps<{
  cityInfo: cityInfo,
}>();

const timesType = ref<24|72|168>(24);
const chartContainer = ref<HTMLElement|null>(null);
const listItemContainer = ref<HTMLElement|null>(null);
// const listItem = ref<HTMLElement|null>(null);
const chartInstance = ref<EChartsType | null>(null);
const timesDataList = ref<WeatherTimesReport[] | null>(null);
const listCollapse = ref(false);
const arrowBottom = ref<number|string>(0);
const arrowDisplay = ref<string>('none');

function initChart() {
  //   计算x坐标
  const xData = timesDataList.value?.map(i=> dayjs(i.fxTime).format('HH:mm'));
  const highData = timesDataList.value?.map(i=>i.temp);
  // 生成option
  const option:ECBasicOption = {
    grid:{
      left:'32px',
      right: '32px',
      bottom:'0',
      top:'16px'
    },
    tooltip:{
      formatter: (params: any)=> `${params.name} ${params.data.coord[1]}\u2103`
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show:false,
      }
    },
    series:[{
      type:'line',
      name:'温度',
      data:highData,
      symbol:'circle',
      symbolSize:24,
      label:{
        show:true,
        position:'inside',
        formatter:'{c}\u2103'
      }
    }],
  };
  chartInstance.value?.setOption(option);
}
function setArrow() {
  //   设置收缩箭头
  if(listItemContainer.value){
    // const listItemContainerHeight = getComputedStyle(listItemContainer.value).height;
    // console.log(listItemContainerHeight);
    const tempHeight = listCollapse.value ? 0:0;
    arrowBottom.value = `${tempHeight-6}px`;
    arrowDisplay.value = 'block';
  }
}
function getTimesWeather(type:24|72|168 = 24) {
  getTimesWeatherReport(type,{
    location:props.cityInfo.id,
    key: getProjectConfig('apiKey')
  }).then(res=> {
    timesDataList.value = res.hourly || [];
    setTimeout(()=> {
      if(chartContainer.value){
        const chart = echarts.init(chartContainer.value,'shine',{});
        chartInstance.value = chart;
        initChart();
      }
      setArrow();
    },0);
  });
}
function timesTypeChange(val:24|72|168) {
  getTimesWeather(val);
}

function getWindLevelInfo(level:number | string) {
  if(typeof level === "string"){
    const tempList = level.split('-');
    const resList = tempList.map(i=>getWindDicDataByLevel(Number(i))?.zh );
    const resTemp = resList.filter((i,index)=>resList.indexOf(i)===index);
    return resTemp.length===1 ? resTemp[0]:resTemp[1];
  }
    const resData = getWindDicDataByLevel(Number(level));
    return resData?.zh|| '';
  

}
function arrowClick() {
  listCollapse.value = !listCollapse.value;
  setTimeout(()=> {
    setArrow();
  },0);
}


// 监听城市信息，拿到城市信息时再获取天气信息
watch(()=>props.cityInfo,(newCityInfo,oldCityInfo)=> {
  if(newCityInfo && newCityInfo.id && (!oldCityInfo || newCityInfo.id!==oldCityInfo.id)){
    getTimesWeather();
  }
},{
  flush: 'post',
  immediate:true,
});


</script>
<script lang="ts">
export default {
  name: "TimesReport"
};
</script>
<template>
  <div class="top-switch">
    <n-radio-group v-model:value="timesType" @update:value="timesTypeChange">
      <n-radio-button :value="24">24h</n-radio-button>
      <n-radio-button :value="72">72h</n-radio-button>
      <n-radio-button :value="168">168h</n-radio-button>
    </n-radio-group>
  </div>
    <div class="list-container" ref="listContainer">
      <n-scrollbar x-scrollable class="times-report-container">
        <div ref="chartContainer" class="chart-container">

        </div>
      <div class="list-item-container" :class="{
      collapse: !!listCollapse
    }" ref="listItemContainer">
        <div class="list-item" v-for="(item,index) in timesDataList" :key="index">
          <span class="time list-item-inner">{{dayjs(item.fxTime).format('HH:mm')}}</span>
          <span class="icon list-item-inner">
          <WeatherIcon :icon-name="item.icon"></WeatherIcon>
          <span class="pop">💧{{item.pop}}%</span>
        </span>
          <span class="text list-item-inner">{{item.text}}</span>
          <span class="wind list-item-inner">{{getWindLevelInfo(item.windScale)}}</span>
          <span class="humi list-item-inner">♨️{{item.humidity}}%</span>
          <span class="direct list-item-inner">{{item.windDir}}</span>
          <span class="speed list-item-inner">{{item.windSpeed}}km/h</span>
        </div>
      </div>
      </n-scrollbar>
      <div class="arrow"
            :style="{
        bottom: arrowBottom,
        display:arrowDisplay,
      }">
      <n-button circle strong secondary type="primary" @click="arrowClick" class="arrow-btn">
        <template #icon>
          <n-icon class="arrow-btn-icon" :class="{
            rotate: !!listCollapse
          }"><ArrowIcon /></n-icon>
        </template>
      </n-button>
      </div>

    </div>
</template>


<style scoped lang="scss">
.top-switch{
  margin-top:16px;
}
.chart-container{
  height: 120px;
  width:100%;
}
.times-report-container{
    .list-item-container{
      height: 232px;
      display:flex;
      justify-content: flex-start;
      align-items:flex-start;
      border-bottom:1px solid #b9b9b9;
      overflow: hidden;
      position: relative;
      padding-bottom: 16px;
      transition:height .6s ease ;
      &.collapse {
        height: 80px;
      }
    }
    .list-item{
      width: calc(16px + 4em);
      text-align: center;
      font-family: JetBrainsMono;
      font-weight: bold;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      .list-item-inner{
        display: inline-block;
        text-align: center;
        font-size:14px;
        &.icon{
          font-size: 16px;
          .pop{
            display: inline-block;
            font-size: 10px;
            font-weight: lighter;
            font-family: "Microsoft YaHei UI";
          }
        }
        &:not(:last-of-type){
          margin-bottom:12px;
        }
        &.speed{
          font-size: 13px;
        }
      }

    }
}
.list-container {
  height: auto;
  display: flex;
  //box-shadow: var(--n-box-shadow);
  border-radius: 10px;
  //margin-top:8px;
  justify-content: flex-start;
  padding: 8px 0;
  align-items: center;
  overflow: visible;
  position: relative;
  &>.arrow{
    position: absolute;
    bottom:-12px;
    left: calc(50% - 12px);
    width:34px;
    height:34px;
    border-radius:50%;
    transition: top .6s ease;
    box-shadow: var(--n-box-shadow);
    z-index:10;
    .arrow-btn{
      :deep() .arrow-btn-icon{
        transition: all .6s ease;
        &.rotate{
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>

<script lang="ts" setup>

import {watch,ref} from "vue";
import dayjs from "dayjs";
import {ECBasicOption} from "echarts/types/dist/shared";
import * as echarts from "echarts";
import {EChartsType} from "echarts";
import {getProjectConfig} from "@/utils/common";
import {getRainsReport, RainsReportObj} from "@/api/weatherRequest";

const props = defineProps<{
  cityInfo: cityInfo,
}>();
const rainsInfoList = ref<RainsReportObj[] | null>(null);
const rainDesc = ref('');
const rainChartContainer = ref<HTMLElement|null>(null);
const chartInstance = ref<EChartsType | null>(null);
const calcWidth= ref('100%');


function initChart() {
  if(rainChartContainer.value){
    const chart = echarts.init(rainChartContainer.value,'shine',{});
    chartInstance.value = chart;
  }else{
    return;
  }
  //   计算x坐标
  const xData = rainsInfoList.value?.map(i=> dayjs(i.fxTime).format('HH:mm'));
  const highData = rainsInfoList.value?.map(i=>i.precip);
  // 生成option
  const option:ECBasicOption = {
    grid:{
      left:'32px',
      right: '16px',
      bottom:'24px',
      top:'16px'
    },
    tooltip:{
      formatter: (params: any)=>
          // console.log(params);
          `${params.name} ${params.value}mm`

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
      name:'降水/雪量',
      data:highData,
      symbol:'circle',
      symbolSize:10,
      areaStyle: {},
      label:{
        show:true,
        position:'top',
        formatter:(params:any)=> {
          console.log(params);
          return params.value;
        }
      }
    }],
  };
  chartInstance.value?.setOption(option);
}
function getRainsWeather() {
  getRainsReport({
    location:`${props.cityInfo.lon},${props.cityInfo.lat}`,
    key:getProjectConfig('apiKey'),
  }).then(res=> {
    console.log(res);
    rainsInfoList.value = res.minutely;
    rainDesc.value = res.summary || '';
    // 计算需要的宽度
    const itemWidth = 46;
    calcWidth.value = `${itemWidth*(rainsInfoList.value.length)}px`;
    console.log(calcWidth.value);
    setTimeout(()=> {
      initChart();
    },0);
  });
}

// 监听城市信息，拿到城市信息时再获取天气信息
watch(()=>props.cityInfo,(newCityInfo, oldCityInfo)=> {
  if(newCityInfo && newCityInfo.id && (!oldCityInfo || newCityInfo.id!==oldCityInfo.id)){
    console.log(newCityInfo);
    getRainsWeather();
  }
},{
  flush: 'post',
  immediate:true,
});
</script>
<script lang="ts">
export default {
  name: "RainReport"
};
</script>
<template>
  <n-el class="rain-container">
    <n-card class="card-container" :style="{
      maxWidth: `calc(${calcWidth} + 32px)`
    }">
      <p class="title">{{rainDesc}}</p>
      <n-scrollbar x-scrollable class="scroll-container">
        <div class="chart-container" :style="{
          width: calcWidth
        }" ref="rainChartContainer">
        </div>
      </n-scrollbar>
    </n-card>
  </n-el>
</template>

<style scoped lang="scss">
.rain-container{
  height:200px;
  padding: 0 32px;
  .card-container{
    height:100%;
    margin:0 auto;
    :deep() .n-card{
      height:100%;
    }
    :deep() .scroll-container{
      height: calc(100% - 24px);
      .n-scrollbar-container>.n-scrollbar-content{
        height:100%;
      }
    }
  }
}
.chart-container{
  height: 100%;
  position: relative;
}
.title{
  text-align:center;
}
</style>
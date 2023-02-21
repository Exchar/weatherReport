<script setup lang="ts">
import {watch,ref} from "vue";
import dayjs from "dayjs";
import {getDaysWeatherReport, WeatherDaysReport} from "@/api/weatherRequest";
import {getProjectConfig} from "@/utils/common";
import WeatherIcon from "@/components/WeatherIcon.vue";

const props = defineProps<{
  cityInfo: cityInfo,
}>();
const emits = defineEmits(['emitReportList']);

// 变量定义
const daysType = ref<3|7|10|15|30>(7);
const daysReportList = ref<WeatherDaysReport[]>([]);
// 方法
function getDaysWeather(days:3|7|10|15|30 = 7) {
  getDaysWeatherReport(days,{
    location:props.cityInfo.id,
    key: getProjectConfig('apiKey')
  }).then(res=> {
    daysReportList.value = res.daily;
    emits('emitReportList',daysReportList.value);
  });
}
function daysTypeChange(){
  getDaysWeather(daysType.value);
}

// 监听城市信息，拿到城市信息时再获取天气信息
watch(()=>props.cityInfo,(newCityInfo,oldCityInfo)=> {
  if(newCityInfo && newCityInfo.id && (!oldCityInfo || newCityInfo.id!==oldCityInfo.id)){
    getDaysWeather(daysType.value);
  }
},{
  flush: 'post',
  immediate:true,
});

</script>

<script lang="ts">
export default {
  name: 'DaysWeather'
};
</script>

<template>
  <!--  可切换天气预报-->
  <n-card
      style="height:100%"
      class="main-card"
      embedded
      hoverable
      :bordered="false"
  >
    <div class="top-switch">
      <n-radio-group v-model:value="daysType" @update:value="daysTypeChange">
        <n-radio-button :value="3">3天</n-radio-button>
        <n-radio-button :value="7">7天</n-radio-button>
        <n-radio-button :value="10">10天</n-radio-button>
        <n-radio-button :value="15">15天</n-radio-button>
        <n-radio-button :value="30">30天</n-radio-button>
      </n-radio-group>
    </div>
    <div class="bottom-chart">
<!--      上半部分-->
      <div class="desc-container">
        <n-scrollbar style="display:flex" class="scrollBar" x-scrollable>
        <div class="desc-item-container" v-for="(item,index) in daysReportList" :key="index" :class="{
          active: dayjs(item.fxDate).format('M/D')===dayjs().format('M/D')
        }">
<!--          日期-->
          <span class="date desc-item">{{dayjs(item.fxDate).format('M/D')}}</span>
          <span class="week desc-item">{{dayjs(item.fxDate).format('ddd')}}</span>
          <span class="desc-item icon">
            <WeatherIcon :icon-name="item.iconDay"></WeatherIcon>
          </span>
          <span class="desc-item">
            {{item.textDay}}
          </span>
          <span class="desc-item">
            {{item.tempMin+'~'+item.tempMax}}
          </span>
        </div>
        </n-scrollbar>
      </div>
      <div class="chart-container" ref="chartContainer"></div>
    </div>
  </n-card>
</template>

<style scoped lang="scss">
.desc-container{
  display: flex;
  overflow-x: clip;
  :deep() .scrollBar{
    .n-scrollbar-content{
      display: flex;
    }
  }
  .desc-item-container{
    display: flex;
    width: calc(2em + 32px);
    flex: 0 0  calc(2em + 32px);
    flex-direction: column;
    padding: 8px;
    border-radius:4px;
    .desc-item{
      display: inline-block;
      text-align: center;
      font-family: JetBrainsMono;
      font-weight: bold;
      &:not(:last-of-type){
        margin-bottom:8px;
      }
    }
    &.active{
      box-shadow: var(--n-box-shadow);
      background-color: rgba(171, 239, 221, 0.88);
    }
  }
}
.bottom-chart{
  height:calc(100% - 32px);
  box-sizing: border-box;
  padding-top:8px;
}
</style>
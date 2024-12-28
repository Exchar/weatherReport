<script setup lang="ts">
import { ref, watch } from 'vue';
import { getProjectConfig, getWindDicDataByLevel } from '@/utils/common';
import { getRealTimeReport, WeatherResponseNow, RealTimeWeatherResponse, WeatherDaysReport } from "@/api/weatherRequest";
import WeatherIcon from "@/components/WeatherIcon.vue";

const props = defineProps<{
    cityInfo: cityInfo,
}>();
const nowWeatherInfo = ref<WeatherResponseNow>({});
const nowDayInfo = ref<WeatherDaysReport | null>(null);
// 获取实时天气
function getNowWeather() {
    getRealTimeReport({
        key: getProjectConfig('apiKey'),
        location: props.cityInfo.id,
    }).then((res: RealTimeWeatherResponse) => {
        nowWeatherInfo.value = res.now;
    });
}
watch(() => props.cityInfo, (newCityInfo, oldCityInfo) => {
    if (newCityInfo && newCityInfo.id && (!oldCityInfo || newCityInfo.id !== oldCityInfo.id)) {
        getNowWeather();
    }
}, {
    flush: 'post',
    immediate: true,
});
</script>
<template>
    <n-space vertical class="home-container">
        <div class="home-main-content">
            <div class="top-weather">
                <n-card style="height:100%" class="main-card" embedded :bordered="false" v-if="nowWeatherInfo.text">
                    <div class="main-desc-icon">
                        <WeatherIcon v-if="nowWeatherInfo.icon" :icon-name="nowWeatherInfo.icon" style="font-size: 3em">
                        </WeatherIcon>
                    </div>
                    <p class="main-desc-title">{{ nowWeatherInfo.text }} {{ nowDayInfo ?
                        nowDayInfo?.tempMin + "℃~" + nowDayInfo?.tempMax + '℃' : '' }}</p>
                    <p class="main-desc-title little">
                        {{ `体感${nowWeatherInfo.feelsLike}℃,有${nowWeatherInfo.windScale}级${nowWeatherInfo.windDir}` }}
                    </p>
                </n-card>
                <div v-else>
                    <p>获取天气信息失败</p>
                </div>
            </div>
        </div>
    </n-space>

</template>
<style lang="scss" scoped>
.home-container {
    height: 100%;
}

.home-main-content {
    height: 100%;

    .top-weather {
        height: 100%;

        .main-desc-title {
            text-align: center;
            font-size: 1.2em;

            &.little {
                font-size: 1.1em;
            }
        }

        .main-card {
            border-radius: 20px;
            width: calc(100% - 32px);
            margin: 0 auto;
            background-color: transparent;
        }
    }
}

.main-desc-icon {
    text-align: center;
}

.top-weather-desc {
    width: calc(100% - 16px);
    margin: 16px 0 0 16px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}

.weather-desc-card {
    flex: 1 1 140px;
    height: 120px;
    border-radius: 10px;
    margin-right: 16px;
    margin-bottom: 16px;

    :deep() .n-card__content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
}

// 每天预报
.day-weather-content {
    width: calc(100% - 32px);
    margin: 16px 0 0 16px;
    border-radius: 10px;
    height: auto;
    overflow: hidden;
}

//今日天气详细
.main-desc-title {
    text-align: left;
    font-family: JetBrainsMono;
    font-size: 1.1em;
    font-weight: bold;
}

.main-desc-content {
    text-align: center;
    font-family: JetBrainsMono;
    font-size: 1.2em;
    font-weight: bold;
}
</style>
<script setup lang="ts">
import { darkTheme, NIcon, useMessage } from 'naive-ui';
import { BuiltInGlobalTheme } from "naive-ui/lib/themes/interface";
import {
  Sunny as SunIcon
} from '@vicons/ionicons5';
import {
  IosMoon as MoonIcon,
} from '@vicons/ionicons4';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { City as CityIcon } from '@vicons/fa';
import { Gps as GpsIcon } from '@vicons/tabler';
import { locationRequest } from '@/api/index';

import {
  getProjectConfig,
  // getDeviceLocation,
  getLocalStorage,
  setLocalStorage,
  isEmpty,
  initGetWeatherInfo
} from '@/utils/common';

const darkThemeIns = ref<null | BuiltInGlobalTheme>(null);
const isDark = ref(false);
const selectLoading = ref(false);
const locationLoading = ref(false);
const nowCity = ref<string | null>(null);
// 获取缓存的选中城市
const cachedCity: cityInfo = getLocalStorage('cachedCity');
const cityList = ref<cityInfo[]>([cachedCity]);
const nowCityName = cachedCity ? cachedCity.name : '';
const nowCityInfo = ref<cityInfo | undefined>(undefined);
const routeInfo = ref<{
  external?: '1' | '0',
  dark?: '1' | '0'
}>({});
const message = useMessage();

function themeChange() {
  setLocalStorage('isDark', isDark.value);
  if (isDark.value) {
    //   启用暗黑主题
    darkThemeIns.value = darkTheme;
    window.darkTheme = darkTheme;
  } else {
    //   启用浅色主题
    darkThemeIns.value = null;
    window.darkTheme = null;
  }
}
// 选中城市
function handleChange(val: string) {
  const findItem: cityInfo | undefined = cityList.value.find(i => i.id === val);
  nowCityInfo.value = findItem;
  setLocalStorage('cachedCity', findItem || null);
}
const localDarkStatus = getLocalStorage('isDark');
if (!isEmpty(localDarkStatus)) {
  isDark.value = localDarkStatus;
  themeChange();
}

window.darkTheme = null;

function getCityList(key: string, useLocal = false) {
  selectLoading.value = true;
  locationRequest.getCityLocation({
    key: getProjectConfig('apiKey'),
    location: key,
    number: 20,
  }).then(resp => {
    if (cachedCity) {
      const tempList = [...resp.location, cachedCity] as any;
      cityList.value = tempList.arrDistinctByProp('id');
    } else {
      cityList.value = resp.location;
    }
    const tempCity = cachedCity ? nowCity.value : (resp.location[0]?.id || null);
    nowCity.value = useLocal ? resp.location[0]?.id : tempCity;
    handleChange(nowCity.value || '');
  }).finally(() => {
    selectLoading.value = false;
  });
}
function getLocationInfo(useLocal = false) {
  locationLoading.value = true;
  //  获取经纬信息
  setTimeout(() => {
    initGetWeatherInfo().then(res => {
      // 精度
      const { city } = res;
      getCityList(city, useLocal);
    }).catch((e) => {
      console.log(e);
      message.error("无法获取到您的位置，请手动输入城市名！");
    }).finally(() => {
      locationLoading.value = false;
    });
  }, 500);

}

nowCity.value = cachedCity?.id || null;

// 获取首页附近城市列表
function handleSearch(val: string) {
  if (val) {
    getCityList(val);
  } else {
    getLocationInfo();
  }
}
onMounted(() => {
  if (nowCity.value) {
    getCityList(nowCityName, true);
  } else {
    getLocationInfo(true);
  }
  routeInfo.value = useRoute().query;
  console.log(routeInfo.value);
  if (routeInfo.value.dark === '1') {
    isDark.value = true;
    themeChange();
  } else {
    isDark.value = false;
    themeChange();
  }
});
</script>
<template>
  <n-config-provider :theme="darkThemeIns" class="main-container" :class="{
    external: routeInfo.external === '1'
  }">
    <n-space vertical size="large" style="height:100%" class="fe-space">
      <n-layout style="height:100%">
        <n-layout-header v-if="routeInfo.external !== '1'" style="height:64px;padding-left:16px;padding-right:16px"
          class="my-header">
          <!--          顶部内容区域-->
          <n-space class="city-select">
            <n-select placeholder="请选择城市名" v-model:value="nowCity" size="large" :options="cityList" label-field="name"
              value-field="id" filterable remote :style="{
                width: '100px'
              }" :loading="selectLoading" :clear-filter-after-select="false" @update:value="handleChange"
              @search="handleSearch">
              <template #arrow>
                <CityIcon />
              </template>
            </n-select>
            <n-button :loading="locationLoading" quaternary circle type="info" @click="getLocationInfo(true)">
              <template #icon>
                <n-icon><gps-icon /></n-icon>
              </template>
            </n-button>
          </n-space>
          <n-space class="top-switch">
            <n-switch v-model:value="isDark" @update:value="themeChange">
              <template #checked>
                <n-icon>
                  <MoonIcon></MoonIcon>
                </n-icon>
              </template>
              <template #unchecked>
                <n-icon color="#fffc75">
                  <SunIcon></SunIcon>
                </n-icon>
              </template>
            </n-switch>
          </n-space>
        </n-layout-header>
        <!--        主要内容区域-->
        <n-layout position="absolute" :style="routeInfo.external !== '1' ? {
          top: '64px',
          bottom: 0
        } : {
          top: 0,
          bottom: 0
        }">
          <template v-if="routeInfo.external === '1'">
            <router-view :cityInfo="nowCityInfo"></router-view>

          </template>
          <n-scrollbar v-else class="my-scrollbar">
            <router-view :cityInfo="nowCityInfo"></router-view>
          </n-scrollbar>
        </n-layout>
        <!--        <n-layout-footer position="absolute"-->
        <!--                         style="height: 64px; padding: 24px">底部区域</n-layout-footer>-->
      </n-layout>
    </n-space>
  </n-config-provider>
</template>

<style lang="scss" scoped>
.my-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.city-select {
  display: flex;
  align-items: center;
}

.top-weather {
  width: 80%;
  border-radius: 20px;
}

.my-scrollbar {
  :deep(.n-scrollbar-content) {
    height: 100%;
  }
}

.main-container {
  height: 100%;

  &.external {
    .n-layout {
      background-color: transparent !important;

      .n-layout-scroll-container {
        overflow-y: hidden;
      }

      div {
        overflow-y: hidden;
      }
    }
  }
}

.fe-space {
  :deep()>div {
    height: 100%;
  }
}
</style>
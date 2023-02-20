<template>
  <svg :class="svgClass" v-bind="$attrs" :style="{ color: color }">
    <use :xlink:href="iconName" rel="external nofollow" />
  </svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ""
  }
});

const iconName = computed(() => `#icon-${props.iconName}`);
const svgClass = computed(() => {
  console.log(props.iconName, "props.name");
  if (props.iconName) {
    return `svg-icon ${iconName.value}`;
  }
  return "svg-icon";
});
</script>

<style scoped lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  vertical-align: middle;
}
</style>
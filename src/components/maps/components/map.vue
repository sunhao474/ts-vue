<template>
  <div v-if="loaded" ref="mapContainer" class="amap-container"></div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
@Component
export default class Map extends Vue {
  //#region props
  //#endregion

  //#region data
  //#endregion

  //#region constructor
  //#endregion

  //#region methods
  //#endregion

  //#region life circle
  //#endregion
}
</script>
<style scoped>
.amap-container {
  width: 100%;
  height: 100%;
}
</style>
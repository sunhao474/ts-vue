<template>
  <div class="map-container">
    <div id="map" class="map-container" ref="mapContainer"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import MapComponent from '../utils/MapComponent';
import AMapLoader from '../../lib/main/index';
import { EVENTS } from '../config/constant';
import defaultPropTable from './propTable/AMap';
import "@amap/amap-jsapi-types";

@Component({
  name: 'i-amap'
})
export default class IotaAMap extends MapComponent {
  @Prop() private dragEnable?: boolean;
  @Prop() private invalidOne?: string;
  @Prop() private invalidTwo?: string;
  @Prop() private mapKey!: string;

  protected self: any;
  public mounted(): void {
    super.mounted();
  }

  protected bindWatchers(): void {
    const { $options: { propsData = {} } } = this;
    const statusProp = [
      'showIndoorMap',
      'resizeEnable',
      'dragEnable',
      'keyboardEnable',
      'doubleClickZoom',
      'zoomEnable',
      'rotateEnable'
      ];
    const watchStatusProps = Object.keys(propsData).filter(item => {
      return statusProp.indexOf(item) > -1;
    })

    // for (const i in watchStatusProps) {
    //   console.log(i);
    // }
    watchStatusProps.forEach(item => {
      const watchHandlers = this.$watch(item, newVal => {
        this.self.setStatus({ [item]: newVal })
      })

      this.watchHandlers.push(watchHandlers);
    });
  }

  protected initComponent(): void {
    if (window.AMap) {
      this.loadMap(window.AMap);
    } else {
      AMapLoader.load({
        key: this.mapKey,
      }).then(AMap => {
        this.loadMap(AMap);
      })
    }
  }

  protected loadMap(AMap: any): void {
    const el = this.$refs.mapContainer;
    if (!el) return;
    const id = (el as any).id;
    console.log(this.$options.propsData);
    console.log(this.filterInitProps(defaultPropTable));
    this.self = new AMap.Map(id, this.filterInitProps(defaultPropTable));
    this.regist();
    this.$emit(EVENTS.READY, this.self);
    this.$children.forEach(component => {
      component.$emit(EVENTS.READY, this.self);
    })
  }
}
</script>
<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>

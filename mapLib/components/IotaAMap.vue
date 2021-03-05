<template>
  <div class="map-container">
    <div id="map" class="map-container" ref="mapContainer"></div>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import MapComponent from '../utils/MapComponent';
import AMapLoader from '../../lib/main/index';
import { EVENTS } from '../config/constant';
import defaultOptions from './defaultOptions/IotaAMap';

@Component({
  name: 'i-amap'
})
export default class IotaAMap extends MapComponent {
  @Prop() private mapKey!: string;
  @Prop() private options?: AMap.MapOptions;
  // @Prop() private events?: Array<AMap.Event>;
  protected defaltOptions: Array<string> = defaultOptions;

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
    const options = (propsData as any).options;
    if (!options) return;
    const watchStatusProps = Object.keys(options).filter(item => {
      return statusProp.indexOf(item) > -1;
    })

    watchStatusProps.forEach(item => {
      const watchHandlers = this.$watch(`options.${item}`, newVal => {
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
    this.self = new AMap.Map(id, this.options);
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

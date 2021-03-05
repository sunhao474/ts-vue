<template>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import OverLays from '../../utils/Overlays';

@Component({
  name: 'i-amap-marker'
})
export default class IotaAMapMarker extends OverLays {
  protected amap: any;
  protected self: any;
  protected defaltOptions: Array<string> = [];

  @Prop() private options?: AMap.MarkerOptions;
  // @Prop() private events?: Array<AMap.Event>;

  public mounted(): void {
    super.mounted();
  }
  
  protected initSubComponents(): any {
    this.self = new AMap.Marker({
      ...this.options,
      map: this.amap,
    })
  }

  protected bindWatchers(): void {
    console.log('bind')
  }
}
</script>

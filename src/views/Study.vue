<template>
  <div>
    <div>
      <button @click="changeZoomEnable">changeZoomEnable</button>
      <button @click="changeDrag">changeDragEable</button>
      <button @click="changeMarkers">changeMarkerOptions</button>
    </div>
    <div>
      <span>inputValue:</span>
      <input v-model="inputValue" />
    </div>

    <div>
      <span>inputValue2:</span>
      <input v-model="inputValue2" />
    </div>

    <List :list="list"/>
    <div id='container' style="height: 500px; width: 500px">
      <IotaAMap
        map-key="9c581cda99009010a4212703098afe19"
        :options="options"
        :events="events"
      >
        <IotaAMapMarker
          :options="markerOptions"
          :events="markerEvents"
        />
      </IotaAMap>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import List from '../components/List.vue'
import IotaAMap from '../../mapLib/components/IotaAMap.vue';
import IotaAMapMarker from '../../mapLib/components/overlays/IotaAMapMarker.vue'

interface ArrayListItem {
  id: number;
  label: string;
  value: string;
}

@Component({
  components: { List, IotaAMap, IotaAMapMarker }
})
export default class Study extends Vue {
  //#region data
  private inputValue: string;
  private inputValue2: string;
  private map: any;
  private list: Array<ArrayListItem>;
  // private dragEnable = false;
  private options: AMap.MapOptions = {
    zoomEnable: false,
    dragEnable: false,
  }

  private markerOptions: AMap.MarkerOptions = {
    cursor: 'ani',
    draggable: false,
  }

  private markerEvents: any = {
    'mouseover': () => {
      console.log('marker mouseover')
    },
    'click': () => {
      console.log('marker click')
    }
  }

  private events: any = {
    'complete': () => {
      console.log('map complete');
    },
    'click': () => {
      console.log('map click');
    }
  };
  //#endregion

  //#region prop
  @Prop() private title!: string;
  //#endregion

  constructor() {
    super();
    this.inputValue = 'type somethings';
    this.inputValue2 = 'type somethings';
    this.map = null;
    this.list = [
      { id: 1, label: 'a', value: 'aa' },
      { id: 2, label: 'b', value: 'bb' },
      { id: 3, label: 'c', value: 'cc' },
      { id: 4, label: 'd', value: 'dd' },
    ]
  }

  public changeDrag(): void {
    this.options.dragEnable = !this.options.dragEnable;
  }

  public changeZoomEnable(): void {
    this.options.zoomEnable = !this.options.zoomEnable;
  }

  public changeMarkers(): void {
    this.markerOptions.draggable = !this.markerOptions.draggable;
  }

  //#region life Circle

  public mounted(): void {
    // AMapLoader.load({
    //   key: '9c581cda99009010a4212703098afe19',
    // }).then((AMap) => {
    //   this.map = new AMap.Map('container')
    // })
  }
  //#endregion

  //#region watch
  @Watch('inputValue')
  onChange(val: string, oldVal: string) {
    console.log(val);
    console.log(oldVal);
  }

  //#endregion
}
</script>

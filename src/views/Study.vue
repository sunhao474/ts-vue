<template>
  <div>
    <div>{{ title }}</div>
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

    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import List from '../components/List.vue'
import AMapLoader from '../../lib/main/index'

interface ArrayListItem {
  id: number;
  label: string;
  value: string;
}

@Component({
  components: { List }
})
export default class Study extends Vue {
  //#region data
  private inputValue: string;
  private inputValue2: string;
  private map: any;
  private list: Array<ArrayListItem>;
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

  //#region life Circle
  public created(): void {
    console.log('created')
  }

  public mounted(): void {
    console.log('mounted');
    AMapLoader.load({
      key: '9c581cda99009010a4212703098afe19',
    }).then((AMap) => {
      this.map = new AMap.Map('container')
    })
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

import MapComponent from './MapComponent';
import { EVENTS } from '../config/constant';

export default abstract class OverLay extends MapComponent {
  protected abstract amap: any;

  protected onMapInitReady(amap: any): void {
    this.amap = amap;

    let res = this.initSubComponents();
    if (res && res.then) {
      res.then((instance: any) => {
        this.self = instance;
        this.regist();
      })
    } else {
      this.regist();
    }
  }

  protected abstract initSubComponents(): any;
  protected initComponent(): any {
    this.$on(EVENTS.READY, this.onMapInitReady);
  }
}

import { Vue, Prop } from 'vue-property-decorator'
import upperCamelCase from 'uppercamelcase';

export default abstract class MapComponent extends Vue {
  @Prop() private events?: any;

  protected abstract self: any;

  protected abstract defaltOptions: Array<string>;

  protected watchHandlers: Array<Function> = [];
  protected eventListeners: Array<Function> = [];
  
  // 所有类型的组件，都拥有一种通过(set[A-Z]{1}[a-z, A-Z]+)设置属性的函数，正则表达式set后面表示属性
  // 通过watch绑定prop来实现v-bind
  protected bindPropWatchers(): void {
    const { $options: { propsData = {} } } = this;

    const options = (propsData as any).options;

    if(!options) return;

    Object.keys(options).forEach(prop => {
      const setPropFunc = this.self[`set${upperCamelCase(prop)}`];
      console.log(this.self);
      console.log(setPropFunc);
      if (!setPropFunc) return;

      let unwatch = this.$watch(`options.${prop}`, function (newValue) {
        console.log(newValue);
        setPropFunc.call(this.self, newValue);
      });

      this.watchHandlers.push(unwatch);
    })

    this.bindWatchers();
  }

  protected bindEvents(): void {
    console.log('bindEvents')
    if (!window.AMap.event) throw Error('amap not loaded');
    const { $options: { propsData = {} } } = this;
    console.log(this);
    console.log(propsData);
    const events = (propsData as any).events;
    if (!events) return;
    for (let eventKey in events) {
      let listener = window.AMap.event.addListener(this.self, eventKey, events[eventKey]);
      this.eventListeners.push(listener);
    }
  }

  protected removeEvents(): void {
    if (!window.AMap.event) throw Error('amap not loaded');
    this.eventListeners.forEach(listener => {
      window.AMap.event.removeListener(listener);
    })
    this.eventListeners = [];
  }

  protected unwatchProps(): void {
    this.watchHandlers.forEach(unwatch => {
      unwatch();
    })
    this.watchHandlers = [];
  }

  public mounted(): void {
    this.initComponent();
  }

  public destroy(): void {
    this.unwatchProps();
    this.removeEvents();
  }

  protected regist(): void {
    if (!this.self) return;
    this.bindPropWatchers();
    this.bindEvents();
  }

  // 各自组件不同行为的属性绑定方式
  protected abstract bindWatchers(): void;
  protected abstract initComponent(): any;
}

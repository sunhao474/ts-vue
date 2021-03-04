import { Vue } from 'vue-property-decorator'
import upperCamelCase from 'uppercamelcase';

type FilteredProps = {
  [key: string]: any;
}

export default abstract class MapComponent extends Vue {
  protected abstract self: any;

  protected watchHandlers: Array<Function> = [];
  
  // 所有类型的组件，都拥有一种通过(set[A-Z]{1}[a-z, A-Z]+)设置属性的函数，正则表达式set后面表示属性
  // 通过watch绑定prop来实现v-bind
  protected bindPropWatchers(): void {
    const { $options: { propsData = {} } } = this;
    Object.keys(propsData).forEach(prop => {
      const handler = this.self[`set${upperCamelCase(prop)}`];
      if (!handler) return;

      const watchHandler = this.$watch(prop, newVal => {
        handler.call(this.self, newVal)
      })
      this.watchHandlers.push(watchHandler);
    })

    this.bindWatchers();
  }

  protected bindEvents(): void {
    console.log('bind events');
  }

  public mounted(): void {
    this.initComponent();
  }

  // 过滤合法属性
  filterInitProps(filters: Array<string>): FilteredProps {
    const { $options: { propsData = {} } } = this;
    const result: FilteredProps = {};

    Object
      .keys(propsData)
      .filter(prop => {
        return filters.indexOf(prop) > -1
      })
      .forEach(prop => {
        result[prop] = (propsData as any)[prop];
      })

    return result;
  }

  protected regist(): void {
    this.bindPropWatchers();
    this.bindEvents();
  }
  
  // 各自组件不同行为的属性绑定方式
  protected abstract bindWatchers(): void;
  protected abstract initComponent(): any;
}

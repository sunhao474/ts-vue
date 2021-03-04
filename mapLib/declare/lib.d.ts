interface Vue {
  _amap: any;
  id: any
}

interface convertMap {
  [index: string]: Function;
}

interface Handler {
  [index: string]: Function;
}

declare module 'uppercamelcase'

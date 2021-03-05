import "@amap/amap-jsapi-types";

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

interface ComponentEvent {
  [index: string]: AMap.EVENT;
}

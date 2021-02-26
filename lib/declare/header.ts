enum LoadStatus {
  notload = 'notload',
  loading = 'loading',
  loaded = 'loaded',
  failed = 'failed'
}

interface MapComponents {
  version: string;
  plugins: string[];
}

interface Loca {
  version?: string;
}

interface LoadOption {
  key: string;
  version?: string;
  plugins?: string[];
  AMapUI?: MapComponents;
  Loca?: Loca;
}

interface Config {
  key: string;
  AMap: MapComponents;
  AMapUI: MapComponents;
  Loca: Loca;
}

interface STATUS {
  AMap: LoadStatus;
  AMapUI: LoadStatus;
  Loca: LoadStatus;
}

interface CALLBACK {
  AMap: Array<any>;
  AMapUI: Array<any>;
  Loca: Array<any>;
}

export {
  LoadStatus,
  MapComponents,
  Loca,
  LoadOption,
  Config,
  STATUS,
  CALLBACK
}

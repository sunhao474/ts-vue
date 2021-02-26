import {
  Config
} from '../declare/header';

const defaultConfig: Readonly<Config> = {
  key: '',
  AMap: {
    version: '1.4.15',
    plugins: [],
  },
  AMapUI: {
    version: '1.1',
    plugins: [],
  },
  Loca: {
    version: '1.3.2'
  }
}

export default defaultConfig;

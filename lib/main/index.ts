import {
  LoadStatus,
  MapComponents,
  Loca,
  LoadOption,
  Config,
  STATUS,
  CALLBACK
} from '../declare/header';
import defaultConfig from '../config/config';

let config: Config = JSON.parse(JSON.stringify(defaultConfig));
let Status: STATUS = {
  AMap: LoadStatus.notload,
  AMapUI: LoadStatus.notload,
  Loca: LoadStatus.notload,
}

let Callback: CALLBACK = {
  AMap: [],
  AMapUI: [],
  Loca: [],
}

function onAMapUIRequestSuccess(newPlugins: string[], resolve: Function, isSpliceAMapUICallback?: boolean) {
  window.AMapUI.loadUI(newPlugins, (...args: any[]) => {
    for (let i = 0; i < newPlugins.length; i++) {
      const path = newPlugins[i];
      const name = path.split('/').slice(-1)[0];
      window.AMapUI[name] = args[i]; // tslint:disable-line
    }

    resolve();

    if (!isSpliceAMapUICallback) return;
    while (Callback.AMapUI.length) {
      Callback.AMapUI.splice(0, 1)[0]();
    }
  })
}

function onAMapUIRequestError(reject: Function): void {
  reject('请求 AMapUI 失败')
}

const onloadCBKs: Array<Function> = [];
function loadLoca(params: Loca): Promise<void> {
  return new Promise((resolve, reject) => {
    if (config.AMap.version?.startsWith('2.0')) reject('Loca 暂不适配 JSAPI 2.0,请使用 1.4.15');
    else if (Status.Loca === LoadStatus.failed) reject('前一次请求loca失败');
    else if (Status.Loca === LoadStatus.notload) {
      Status.Loca = LoadStatus.loading;
      const version = config.Loca.version = params.version || config.Loca.version;
      const parentNode = document.body || document.head;
      const key = config.key;
      const script = document.createElement('script');
      script.type = "text/javascript";
      script.src = `https://webapi.amap.com/loca?v=${version}&key=${key}`;

      script.onerror = (e) => {
        Status.Loca = LoadStatus.failed;
        reject('请求 AMapUI 失败');
      }

      script.onload = () => {
        Status.Loca = LoadStatus.loaded;
        resolve();

        while (Callback.Loca.length) {
          Callback.Loca.splice(0, 1)[0]();
        }
      };

      parentNode.appendChild(script);
    } else if (Status.Loca === LoadStatus.loaded) {
      if (params?.version !== config.Loca.version) reject('不允许多个版本AMapUI混用');
      else resolve();
    } else {
      if (params?.version !== config.Loca.version) reject('不允许多个版本AMapUI混用');
      else {
        Callback.Loca.push((err: any) => {
          if (err) reject(err);
          else reject();
        })
      }
    }
  })
}

function loadAMapUI(params: MapComponents): Promise<void> {
  return new Promise((resolve, reject) => {
    const newPlugins: string[] = [];
    if (params.plugins) {
      for (let i = 0; i < params.plugins.length; i++) {
        if (config.AMapUI?.plugins?.indexOf(params.plugins[i]) == -1) {
          newPlugins.push(params.plugins[i]);
        }
      }
    }

    if (Status.AMapUI === LoadStatus.failed) reject('前一次AMapUI 请求失败');
    else if (Status.AMapUI === LoadStatus.notload) {
      Status.AMapUI = LoadStatus.loading;
      config.AMapUI.version = params.version || config.AMapUI.version;
      const version = config.AMapUI.version;
      const parentNode = document.body || document.head;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://webapi.amap.com/ui/${version}/main.js`;

      script.onerror = (e) => {
        Status.AMapUI = LoadStatus.failed;
        onAMapUIRequestError(reject);
      };

      script.onload = () => {
        Status.AMapUI = LoadStatus.loaded;
        onAMapUIRequestSuccess(newPlugins, resolve, true);
      }

      parentNode.appendChild(script);
    } else if (Status.AMapUI === LoadStatus.loaded) {
      if (params.version && params.version !== config.AMapUI.version) {
        reject('不允许多个版本AMapUI混用');
      } else {
        onAMapUIRequestSuccess(newPlugins, resolve);
      }
    } else {
      onAMapUIRequestSuccess(newPlugins, resolve);
    }
  })
}

function appendOhter(option: LoadOption): Promise<any> {
  const promises: Promise<void>[] = [];
  if (option.AMapUI) promises.push(loadAMapUI(option.AMapUI));
  if (option.Loca) promises.push(loadLoca(option.Loca))
  return Promise.all(promises);
}


function onload(callback: Function): void {
  if (Status.AMap === LoadStatus.loaded) {
    callback(window.AMap);
    return;
  }

  onloadCBKs.push(callback);
}

function load(options: LoadOption): Promise<any> {
  return new Promise((resolve, reject) => {
    if (Status.AMap === LoadStatus.failed) reject('AMap load faild');
    else if (Status.AMap === LoadStatus.notload) {
      const { key, version, plugins } = options;
      if (!key) reject('请填写key');
      if (window.AMap && location.host !== 'lbs.amap.com') reject('禁止多种API加载方式混用');
      config.key = key;
      config.AMap.version = version || config.AMap.version;
      config.AMap.plugins = plugins || config.AMap.plugins;
      Status.AMap = LoadStatus.loading;

      const parentNode = document.body || document.head;

      window.___onAPILoaded = function (err: any): void {
        delete window.___onAPILoaded;
        if (err) {
          Status.AMap = LoadStatus.failed;
          reject('AMap load faild');
        } else {
          Status.AMap = LoadStatus.loaded;
          appendOhter(options)
            .then(() => {
              resolve(window.AMap);
            })
            .catch(reject)
          while (onloadCBKs.length) {
            onloadCBKs.splice(0, 1)[0]();
          }
        }
      }

      console.log(config)

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://webapi.amap.com/maps?callback=___onAPILoaded&v=${config.AMap.version}&key=${key}&plugin=${config.AMap.plugins?.join(',')}`
      script.onerror = (e) => {
        Status.AMap = LoadStatus.failed;
        reject(e);
      }

      parentNode.appendChild(script);
    } else if (Status.AMap === LoadStatus.loaded) {
      if (options?.key !== config.key) {
        reject('多个不一致的key');
        return;
      }

      if (options?.version !== config.AMap.version) {
        reject('不允许多个版本的jsapi调用');
        return;
      }

      const newPlugins: Array<string> = [];
      if (options.plugins) {
        for (let i = 0; i < options.plugins.length; i++) {
          if (config.AMap.plugins.indexOf(options.plugins[i]) == -1) {
            newPlugins.push(options.plugins[i]);
          }
        }
      }

      if (newPlugins.length) {
        window.AMap.plugin(newPlugins, () => {
          appendOhter(options)
            .then(() => {
              resolve(window.AMap);
            })
            .catch(reject)
        });
      } else {
        appendOhter(options)
          .then(() => {
            resolve(window.AMap);
          })
          .catch(reject);
      }
    } else {
      if (options.key && options.key !== config.key) {
        reject("多个不一致的 key");
        return;
      }
      if (options.version && options.version !== config.AMap.version) {
        reject("不允许多个版本 JSAPI 混用");
        return;
      }
      const newPlugins: Array<string> = [];
      if (options.plugins) {
        for (let i = 0; i < options.plugins.length; i += 1) {
          if (config.AMap.plugins.indexOf(options.plugins[i]) == -1) {
            newPlugins.push(options.plugins[i]);
          }
        }
      }
      onload(() => {
        if (newPlugins.length) {
          window.AMap.plugin(newPlugins, () => {
            appendOhter(options)
              .then(() => {
                resolve(window.AMap);
              })
              .catch(reject);
          });
        } else {
          appendOhter(options)
            .then(() => {
              resolve(window.AMap);
            })
            .catch(reject);
        }
      });
    }
  })
}

function reset(): void {
  delete window.AMap;
  delete window.AMapUI;
  delete window.Loca;

  config = JSON.parse(JSON.stringify(defaultConfig));
  Status = {
    AMap: LoadStatus.notload,
    AMapUI: LoadStatus.notload,
    Loca: LoadStatus.notload,
  };
  Callback = {
      AMap: [],
      AMapUI: [],
      Loca: [],
  };
}

export default {
  load, reset
}
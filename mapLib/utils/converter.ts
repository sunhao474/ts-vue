export function toPixel(arr: Array<any>): any {
  return new window.AMap.Pixel(arr[0], arr[1]);
}

export function toSize(arr: Array<any>): any {
  return new window.AMap.Size(arr[0], arr[1]);
}

export function pixelTo(pixel: any): Array<any> {
  if (Array.isArray(pixel)) return pixel;
  return [pixel.getX(), pixel.getY()];
}

export function toLngLat(arr: Array<any>): any {
  return new window.AMap.LngLat(arr[0], arr[1]);
}

export function lngLatTo(lngLat: any): Array<any> {
  if (Array.isArray(lngLat)) return lngLat.slice();
  return [lngLat.getLng(), lngLat.getLat()];
}

export function toBounds(arrs: Array<Array<any>>): any {
  return new window.AMap.Bounds(toLngLat(arrs[0]), toLngLat(arrs[1]));
}

export const commonConvertMap: convertMap = {
  position: toLngLat,
  offset: toPixel,
  bounds: toBounds,
  lngLat: toLngLat,
  Pixel: toPixel,
  Size: toSize,
}

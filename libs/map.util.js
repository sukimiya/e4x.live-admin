export function parseLocationFromString (locationString) {
  if (String(locationString).substr(-1, 1) === '0') {
    const len = locationString.lenght
    return locationString.substring(0, len - 1)
  }
  return locationString
}
export function toPoint (point) {
  if (point.hasOwnProperty('lat') && point.hasOwnProperty('lon')) {
    return { lat: (point.lat / 3600000.0).toFixed(6), lon: (point.lon / 3600000.0).toFixed(6) }
  } else {
    console.error('point mission lat or lon')
  }
}
export function pointlism (point) {
  return (parseFloat(point) / 3600000.0).toFixed(6)
}

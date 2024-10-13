export const deepMerge = <T extends object, K extends object>(obj1: T, obj2: K): T & K => {
  const newObj = { ...obj1 }

  for (const key in obj2) {
    if (obj2 instanceof Object && Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (obj2[key] instanceof Object && newObj[key] instanceof Object) {
        newObj[key] = deepMerge(newObj[key], obj2[key])
      } else {
        newObj[key] = obj2[key]
      }
    }
  }
  return obj1
}


export function getAccessorDescriptors(value) {
  const descriptors = Object.getOwnPropertyDescriptors(value)
  return Object.entries(descriptors)
    .filter(([key, descriptor]: [any, any]) => typeof descriptor.get === 'function')
    .map(([key]) => key)
}

// https://stackoverflow.com/a/6969486
export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
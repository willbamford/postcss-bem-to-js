const toCamelCase = str => str.replace(/-([a-z])/g, (g, group) => group.toUpperCase())

const toUpperCamelCase = (str) => {
  const s = toCamelCase(str)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

module.exports = {
  toCamelCase,
  toUpperCamelCase
}

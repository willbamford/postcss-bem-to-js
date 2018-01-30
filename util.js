const toCamelCase = str =>
  str
    .replace(/-([a-z])/g, (g, group) => group.toUpperCase())
    .replace(
      /\\(.[a-z])/g,
      (g, group) => `${group[0]}${group[group.length - 1].toUpperCase()}`,
    )

// str => str.replace(/[\\-]([@]?[a-z])/, (match, group) => group.toUpperCase())

const toUpperCamelCase = (str) => {
  const s = toCamelCase(str)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

module.exports = {
  toCamelCase,
  toUpperCamelCase,
}

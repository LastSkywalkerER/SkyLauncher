export const compareVersions = (versionA, versionB): number => {
  for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
    const partA = versionA[i] || 0
    const partB = versionB[i] || 0
    if (partA !== partB) return partB - partA // Сортировка по убыванию
  }
  return 0
}

export const compareFullVersions = (fullVersionPrev, fullVersionNext): number => {
  const [mcVersionPrev, , modpackVersionPrev] = fullVersionPrev.split('-')
  const [mcVersionNext, , modpackVersionNext] = fullVersionNext.split('-')

  const parseVersion = (version): string[] | null =>
    version ? version.split('.').map(Number) : null

  const mcVersionPrevParts = parseVersion(mcVersionPrev)
  const modpackVersionPrevParts = parseVersion(modpackVersionPrev)
  const mcVersionNextParts = parseVersion(mcVersionNext)
  const modpackVersionNextParts = parseVersion(modpackVersionNext)

  if (modpackVersionPrevParts && modpackVersionNextParts) {
    return compareVersions(modpackVersionPrevParts, modpackVersionNextParts)
  } else if (!modpackVersionPrevParts && !modpackVersionNextParts) {
    return compareVersions(mcVersionPrevParts, mcVersionNextParts)
  } else {
    return modpackVersionPrevParts ? -1 : 1
  }
}

export const sortVersions = (fullVersions: string[]): string[] =>
  fullVersions.sort(compareFullVersions)

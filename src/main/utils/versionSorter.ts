import { forgeVersionSeparator } from '../../constants'

export const sortVersions = (fullVersions: string[]): string[] =>
  fullVersions.sort((fullVersionPrev, fullVersionNext) => {
    const [mcVersionPrev, forgeVersionPrev] = fullVersionPrev.split(forgeVersionSeparator)
    const [mcVersionNext, forgeVersionNext] = fullVersionNext.split(forgeVersionSeparator)

    const parseVersion = (version) => (version ? version.split('.').map(Number) : null)

    const mcVersionPrevParts = parseVersion(mcVersionPrev)
    const forgeVersionPrevParts = parseVersion(forgeVersionPrev)
    const mcVersionNextParts = parseVersion(mcVersionNext)
    const forgeVersionNextParts = parseVersion(forgeVersionNext)

    const compareVersions = (versionA, versionB) => {
      for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
        const partA = versionA[i] || 0
        const partB = versionB[i] || 0
        if (partA !== partB) return partB - partA // Сортировка по убыванию
      }
      return 0
    }

    if (forgeVersionPrevParts && forgeVersionNextParts) {
      return compareVersions(forgeVersionPrevParts, forgeVersionNextParts)
    } else if (!forgeVersionPrevParts && !forgeVersionNextParts) {
      return compareVersions(mcVersionPrevParts, mcVersionNextParts)
    } else {
      return forgeVersionPrevParts ? -1 : 1
    }
  })

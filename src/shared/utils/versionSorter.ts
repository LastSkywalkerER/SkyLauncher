/**
 * Compares two version number arrays (e.g., [1, 2, 3] for version "1.2.3")
 * Returns a number for Array.sort() method:
 * - Positive number if versionB is greater (sorts versionB before versionA)
 * - Negative number if versionA is greater (sorts versionA before versionB)
 * - 0 if versions are equal
 * Note: This function sorts in descending order (newest versions first)
 */
export const compareVersions = (versionA, versionB): number => {
  for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
    const partA = versionA[i] || 0
    const partB = versionB[i] || 0
    if (partA !== partB) return partB - partA // Сортировка по убыванию
  }
  return 0
}

/**
 * Compares full version strings in format "MC_VERSION-MODLOADER-MODPACK_VERSION" (e.g., "1.20.1-forge1.0.0")
 * Prioritizes modpack version comparison if both versions have modpack parts
 * Falls back to Minecraft version comparison if no modpack versions are present
 * Returns a number for Array.sort() method:
 * - Positive number if next version is greater (sorts next version before previous)
 * - Negative number if previous version is greater (sorts previous version before next)
 * - 0 if versions are equal
 * Note: This function sorts in descending order (newest versions first)
 */
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

/**
 * Sorts an array of full version strings in descending order (newest versions first)
 * Uses compareFullVersions as the sorting comparator
 */
export const sortVersions = (fullVersions: string[]): string[] =>
  fullVersions.sort(compareFullVersions)

import { readdir, rename, rmdir } from 'node:fs/promises'

import { join } from 'path'

export const removeNestedDirectories = async (
  outputDirectory: string,
  dirName: string
): Promise<string> => {
  const contents = await readdir(outputDirectory, { withFileTypes: true })

  const directory = contents.find((item) => item.isDirectory() && item.name === dirName)

  if (!directory) {
    return outputDirectory
  }

  const nestedDirectory = join(outputDirectory, directory.name)

  const itemsInNestedDirectory = await readdir(nestedDirectory)

  for (const item of itemsInNestedDirectory) {
    const srcPath = join(nestedDirectory, item)
    const destPath = join(outputDirectory, item)
    await rename(srcPath, destPath)
  }

  await rmdir(nestedDirectory)

  return outputDirectory
}

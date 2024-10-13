import { readdir, stat as fsStat } from 'node:fs/promises'
import { join } from 'path'
import { DirMeta } from './interfaces'

/**
 * Asynchronous function to search for folders containing the specified subfolder
 * @param dir Path to the root directory
 * @param targetFolder Name of the target subfolder
 * @param isRecursive
 * @param onError
 * @returns A promise that resolves to an array of paths to folders containing the specified subfolder
 */
export const findFoldersWithTargetFolder = async ({
  targetFolder,
  dir,
  isRecursive = false,
  onError = (): void => {}
}: {
  dir: string
  targetFolder: string
  onError?: (...data: unknown[]) => void
  isRecursive?: boolean
}): Promise<DirMeta[]> => {
  const result: DirMeta[] = []

  try {
    // Get the list of all files and folders in the directory
    const items = await readdir(dir, { withFileTypes: true })

    for (const item of items) {
      const itemPath = join(dir, item.name)

      if (item.isDirectory()) {
        const targetPath = join(itemPath, targetFolder)

        // Check if the target folder exists and if it is a directory
        try {
          const stat = await fsStat(targetPath)
          if (stat.isDirectory()) {
            result.push({ path: itemPath, name: item.name })
          }
        } catch (err) {
          // If the target folder is not found, continue
        }

        if (isRecursive) {
          // Recursively check subfolders
          const subFolders = await findFoldersWithTargetFolder({
            targetFolder,
            dir: itemPath,
            isRecursive,
            onError
          })
          result.push(...subFolders)
        }
      }
    }
  } catch (err) {
    onError(`Error during read: ${dir}`, err)
  }

  return result
}

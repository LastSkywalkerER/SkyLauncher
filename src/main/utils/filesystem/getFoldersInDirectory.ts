import { readdir } from 'node:fs/promises'
import { join } from 'path'
import { DirMeta } from './interfaces'

/**
 * Asynchronous function to get a list of folders in the specified directory
 * @param dir Path to the directory
 * @param onError
 * @returns A promise that resolves to an array of folder names
 */
export const getFoldersInDirectory = async ({
  dir,
  onError = (): void => {}
}: {
  dir: string
  onError?: (...data: unknown[]) => void
}): Promise<DirMeta[]> => {
  const folders: DirMeta[] = []

  try {
    // Get the list of all files and folders in the directory
    const items = await readdir(dir, { withFileTypes: true })

    for (const item of items) {
      const itemPath = join(dir, item.name)

      // Check if the item is a directory
      if (item.isDirectory()) {
        folders.push({ path: itemPath, name: item.name }) // Add folder to the result
      }
    }
  } catch (err) {
    onError(`Error reading directory: ${dir}`, err)
  }

  return folders
}

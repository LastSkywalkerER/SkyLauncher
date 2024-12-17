import { readdir, rename, rmdir } from 'node:fs/promises'

import { join } from 'path'

export const removeNestedDirectories = async (
  outputDirectory: string,
  dirName: string
): Promise<string> => {
  // Получаем список содержимого директории
  const contents = await readdir(outputDirectory, { withFileTypes: true })

  // Фильтруем содержимое, оставляя только директории
  const directory = contents.find((item) => item.isDirectory() && item.name === dirName)

  // Проверяем, что в директории ровно одна поддиректория и больше ничего
  if (!directory) {
    return outputDirectory
  }

  // Получаем путь к этой единственной поддиректории
  const singleDirectory = join(outputDirectory, directory.name)

  // Переносим содержимое единственной директории на уровень выше
  const itemsInSingleDirectory = await readdir(singleDirectory)
  for (const item of itemsInSingleDirectory) {
    const srcPath = join(singleDirectory, item)
    const destPath = join(outputDirectory, item)
    await rename(srcPath, destPath)
  }

  // Удаляем пустую директорию
  await rmdir(singleDirectory)

  return outputDirectory
}

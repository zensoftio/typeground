import * as fs from 'fs'
import * as path from 'path'

const autoImport = async (folder: string, filter: (file: string) => boolean) => {
  const files: string[] = fs.readdirSync(folder)
  await Promise.all(files.filter(filter)
                         .map(async it => {
                           await import(path.join(folder, it))
                         }))
}

export default autoImport

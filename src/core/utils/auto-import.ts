import * as fs from 'fs'
import * as path from 'path'

const walkSync = (dir: string) => {
  const fileList: string[] = []
  fs.readdirSync(dir)
    .forEach(file => {
      const filePath = path.join(dir, file)
      if (fs.statSync(filePath)
            .isDirectory()) {
        fileList.push(...walkSync(filePath))
      } else {
        fileList.push(filePath)
      }
    })
  return fileList
}

const autoImport = (folder: string, filter: (file: string) => boolean = it => !!it) => {
  return Promise.all(walkSync(folder)
                       .filter(
                         it =>
                           // exclude mappings
                           !it.includes('.map') &&
                           // exclude test
                           !it.includes('.spec') &&
                           // only js files
                           it.includes('.js')
                       )
                       .filter(filter)
                       .map(it => import(it)))
}

export default autoImport

import expressHandlebars from 'express-handlebars'
import path from 'path'
import fs from 'fs'

export function configureHandlebars() {
  const hbs = expressHandlebars.create({
    defaultLayout: 'main',
    extname: '.handlebars',
    partialsDir: path.join(process.cwd(), 'src/views')
  })

  fs.readdirSync(path.join(process.cwd(), 'src/views')).forEach(filename => {
    const partialPath = path.join(process.cwd(), 'src/views', filename)
    const stat = fs.statSync(partialPath)

    if (stat.isFile()) {
      const partialName = path.parse(filename).name
      const partialContent = fs.readFileSync(partialPath, 'utf8')
      hbs.handlebars.registerPartial(partialName, partialContent)
    }
  })

  return hbs
}

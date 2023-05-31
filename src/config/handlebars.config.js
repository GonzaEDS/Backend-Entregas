import expressHandlebars from 'express-handlebars'
import path from 'path'
import fs from 'fs'

export function configureHandlebars() {
  const hbs = expressHandlebars.create({
    defaultLayout: 'main',
    extname: '.handlebars',
    partialsDir: path.join(process.cwd(), 'src/views')
  })

  // Register custom times helper
  hbs.handlebars.registerHelper('multiply', function (a, b) {
    return a * b
  })
  hbs.handlebars.registerHelper('times', function (n, block) {
    let result = ''

    for (let i = 1; i <= n; ++i) {
      result += block.fn(i)
    }

    return result
  })

  // New 'eq' helper
  hbs.handlebars.registerHelper('eq', function (v1, v2) {
    return v1 === v2
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

// import expressHandlebars from 'express-handlebars'
// import path from 'path'
// import fs from 'fs'

// export function configureHandlebars() {
//   const hbs = expressHandlebars.create({
//     defaultLayout: 'main',
//     extname: '.handlebars',
//     partialsDir: path.join(process.cwd(), 'src/views')
//   })

//   fs.readdirSync(path.join(process.cwd(), 'src/views')).forEach(filename => {
//     const partialPath = path.join(process.cwd(), 'src/views', filename)
//     const stat = fs.statSync(partialPath)

//     if (stat.isFile()) {
//       const partialName = path.parse(filename).name
//       const partialContent = fs.readFileSync(partialPath, 'utf8')
//       hbs.handlebars.registerPartial(partialName, partialContent)
//     }
//   })

//   return hbs
// }

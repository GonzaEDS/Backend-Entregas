import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'
const uuid = uuidv4()

class ProductManager {
  constructor(fileName) {
    this.fileName = `./src/models/${fileName}`
    this.count = 0
  }
  async createOrReset(type) {
    try {
      await fs.writeFile(this.fileName, '[]')
      console.log(type)
    } catch (error) {
      console.error(error)
    }
  }

  async saveProduct(title, description, price, thumbnail, stock, status) {
    let productsArray = []
    try {
      productsArray = await fs.readFile(this.fileName, 'utf-8')
      productsArray = JSON.parse(productsArray)
      this.count = [...productsArray].pop().id
    } catch (error) {
      try {
        await this.createOrReset('container created')
      } catch (err) {
        console.error(error.message)
      }
    }
    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      stock,
      status
    }

    if (!title || !description || !price || !thumbnail || !stock) {
      console.log('All fields are required')
      return
    }
    if (!status) {
      newProduct.status = true
    }
    const product = {
      ...newProduct,
      id: this.count + 1,
      code: uuid
    }
    productsArray.push(product)
    productsArray = JSON.stringify(productsArray, null, 3)
    await fs.writeFile(this.fileName, productsArray)
    return product
  }

  async getById(num) {
    try {
      const id = parseInt(num)
      const data = await fs.readFile(this.fileName, 'utf-8'),
        jsonData = JSON.parse(data),
        found = jsonData.find(product => product.id === id)
      if (found) {
        return found
      } else {
        console.log(`ID "${id}" not found`)
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }
  async getAll() {
    try {
      const data = await fs.readFile(this.fileName, 'utf-8'),
        jsonData = await JSON.parse(data)
      if (data.length > 0) {
        return jsonData
      } else {
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async getOne() {
    try {
      const data = await fs.readFile(this.fileName, 'utf-8')
      const jsonData = await JSON.parse(data)
      if (jsonData.length > 0) {
        const random = parseInt(Math.random() * jsonData.length)
        return jsonData[random]
      } else {
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async putById(id, prop) {
    try {
      let data = await fs.readFile(this.fileName, 'utf-8')
      const jsonData = JSON.parse(data)
      let product = jsonData.find(pro => pro.id == id)
      //si existe lo modifico
      if (product) {
        product = {
          ...product,
          ...prop
        }
        data = jsonData.map(prod => {
          if (prod.id == product.id) {
            return product
          }
          return prod
        })
        const stringData = JSON.stringify(data, null, 3)
        //lo guardo en el archivo
        await fs.writeFile(this.fileName, stringData)
        return product
      } else {
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }
  async findProductByCode(code) {
    try {
      console.log('code', code)
      const data = await fs.readFile(this.fileName, 'utf-8'),
        jsonData = JSON.parse(data)
      const prod = jsonData.find(prod => prod.code === code)
      if (prod) {
        return prod.id
      } else {
        console.log('product not found')
        return null
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteById(num) {
    const id = parseInt(num)
    try {
      const data = await fs.readFile(this.fileName, 'utf-8'),
        jsonData = JSON.parse(data),
        foundIndex = jsonData.findIndex(element => element.id === id)
      if (foundIndex !== -1) {
        jsonData.splice(foundIndex, 1)
        fs.writeFile(this.fileName, JSON.stringify(jsonData, null, 2))
        return id
      } else {
        console.log(`ID "${id}" not found`)
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async deleteAll() {
    fs.writeFileSync(`./${this.fileName}`, '[]')
  }
}

let products = new ProductManager('products.json')

export default products

import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'
const uuid = uuidv4()

class ProductDaoFS {
  constructor(fileName) {
    this.fileName = `./src/dao/filesystem/storage/${fileName}`
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
      this.count = [...productsArray].pop()._id
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
        found = jsonData.find(product => product._id === id)
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
  async getAll(limit, page, sortPrice, qCategory, qStatus) {
    try {
      const data = await fs.readFile(this.fileName, 'utf-8')
      let products = JSON.parse(data)

      if (qCategory) {
        products = products.filter(product => qCategory.test(product.category))
      }

      if (qStatus !== undefined) {
        const statusBool = JSON.parse(qStatus.toLowerCase())
        products = products.filter(product => product.status === statusBool)
      }
      if (sortPrice) {
        products.sort((a, b) => {
          if (sortPrice.toLowerCase() === 'asc') {
            return a.price - b.price
          } else if (sortPrice.toLowerCase() === 'desc') {
            return b.price - a.price
          }
        })
      }

      // Calculate the pagination indices
      const limitNum = parseInt(limit) || 10
      const pageNum = parseInt(page) || 1
      const start = (pageNum - 1) * limitNum
      const end = start + limitNum

      const result = {
        docs: products.slice(start, end),
        totalDocs: products.length,
        limit: limitNum,
        page: pageNum,
        totalPages: Math.ceil(products.length / limitNum),
        hasPrevPage: pageNum > 1,
        hasNextPage: pageNum < Math.ceil(products.length / limitNum),
        prevPage: pageNum > 1 ? pageNum - 1 : null,
        nextPage:
          pageNum < Math.ceil(products.length / limitNum) ? pageNum + 1 : null
      }

      return result
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
      let product = jsonData.find(pro => pro._id == id)
      //si existe lo modifico
      if (product) {
        product = {
          ...product,
          ...prop
        }
        data = jsonData.map(prod => {
          if (prod._id == product._id) {
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
      const data = await fs.readFile(this.fileName, 'utf-8'),
        jsonData = JSON.parse(data)
      const prod = jsonData.find(prod => prod.code === code)
      if (prod) {
        return prod._id
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
        foundIndex = jsonData.findIndex(element => element._id === id)
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

//let products = new ProductManager('products.json')

export default ProductDaoFS

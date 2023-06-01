import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'

const uuid = uuidv4()

class ProductDaoFS {
  constructor(fileName) {
    this.fileName = `./src/dao/filesystem/storage/${fileName}`
    this.count = 0
  }

  async readFile() {
    const data = await fs.readFile(this.fileName, 'utf-8')
    return JSON.parse(data)
  }

  async writeFile(data) {
    await fs.writeFile(this.fileName, JSON.stringify(data, null, 2))
  }

  async createOrReset(type) {
    try {
      await this.writeFile([])
      console.log(type)
    } catch (error) {
      console.error(error)
    }
  }

  async saveProduct(title, description, price, thumbnail, stock, status) {
    let productsArray = []
    try {
      productsArray = await this.readFile()
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
    await this.writeFile(productsArray)
    return product
  }

  //... Other functions go here, replacing fs.readFile with this.readFile and fs.writeFile with this.writeFile ...
  async getById(num) {
    try {
      const id = parseInt(num)
      const jsonData = await this.readFile(),
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
      let products = await this.readFile()

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
      const data = await this.readFile()
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
      const jsonData = await this.readFile()
      let product = jsonData.find(pro => pro._id == id)
      if (product) {
        product = {
          ...product,
          ...prop
        }
        const updatedData = jsonData.map(prod => {
          if (prod._id == product._id) {
            return product
          }
          return prod
        })
        await this.writeFile(updatedData)
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
      const jsonData = await this.readFile()
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
      const data = await this.readFile(),
        jsonData = JSON.parse(data),
        foundIndex = jsonData.findIndex(element => element._id === id)
      if (foundIndex !== -1) {
        jsonData.splice(foundIndex, 1)
        //fs.writeFile(this.fileName, JSON.stringify(jsonData, null, 2))
        await this.writeFile(jsonData)

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
    await this.writeFile([])
  }

  async adjustStock(pid, quantity) {
    try {
      let products = await this.readFile()

      // Find the product with the given id
      let product = products.find(product => product._id === pid)
      if (!product) {
        throw new Error('Product not found')
      }

      product.stock += quantity

      if (product.stock < 0) {
        // The stock can't be negative.
        throw new Error("Stock can't be negative.")
      }

      // Update the product in the array
      products = products.map(prod => (prod._id === pid ? product : prod))

      // Write the updated products back to the file
      await this.writeFile(products)

      return product
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  }
}

export default ProductDaoFS

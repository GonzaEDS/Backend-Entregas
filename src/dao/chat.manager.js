import ChatModel from './models/chat.model.js'

class ChatManager {
  async saveMessage(user, message) {
    if (!user || !message) {
      console.log('User and message are required')
      return
    }

    const chatMessage = new ChatModel({
      user,
      message
    })

    await chatMessage.save()
    return chatMessage
  }

  async getAllMessages() {
    try {
      const messages = await ChatModel.find({})
      return messages
    } catch (err) {
      throw new Error(err)
    }
  }

  async deleteMessageById(id) {
    try {
      const message = await ChatModel.findByIdAndDelete(id)
      if (message) {
        return message.id
      } else {
        console.log(`ID "${id}" not found`)
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async editMessageById(id, user, message) {
    try {
      const updatedMessage = await ChatModel.findByIdAndUpdate(
        id,
        {
          user,
          message
        },
        {
          new: true
        }
      )
      if (updatedMessage) {
        return updatedMessage
      } else {
        console.log(`ID "${id}" not found`)
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }
}

const chatManager = new ChatManager()

export default chatManager

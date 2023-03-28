const socket = io()

const messagesForm = document.querySelector('#messagesForm')
const emailInput = document.querySelector('#email-input')
const messageInput = document.querySelector('#message-input')
const submitButton = document.querySelector('button[type="submit"]')

messagesForm.addEventListener('submit', event => {
  event.preventDefault()
  const messageData = {
    user: emailInput.value,
    message: messageInput.value
  }

  // Emit the message data to the server
  socket.emit('chat', messageData)
  // Clear input values
  messageInput.value = ''
  console.log(messageData)
})

socket.on('NEW_MESSAGE_SERVER', message => {
  const messagesUI = document.getElementById('messagesUl')
  const messageLi = document.createElement('li')
  messageLi.classList.add('messageLi')
  const messageEmailDiv = document.createElement('div')
  messageEmailDiv.classList.add('messageEmailDiv')
  messageEmailDiv.innerText = message.user
  const messageContentDiv = document.createElement('div')
  messageContentDiv.classList.add('messageContentDiv')
  messageContentDiv.innerText = message.message
  messageLi.appendChild(messageEmailDiv)
  messageLi.appendChild(messageContentDiv)
  messagesUI.appendChild(messageLi)
})

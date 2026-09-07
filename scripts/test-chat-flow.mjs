import WebSocket from 'ws'

const BASE = 'http://localhost:4001'

async function request(path, options = {}) {
  const { headers: extraHeaders = {}, ...rest } = options
  const response = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  })

  const text = await response.text()
  let json
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = text
  }

  if (!response.ok) {
    throw new Error(`${path} failed: ${JSON.stringify(json)}`)
  }

  return json
}

async function waitForSocketEvent(socket, predicate, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off('message', onMessage)
      reject(new Error('Timed out waiting for websocket event'))
    }, timeoutMs)

    const onMessage = (event) => {
      const payload = JSON.parse(event.toString())
      if (predicate(payload)) {
        clearTimeout(timer)
        socket.off('message', onMessage)
        resolve(payload)
      }
    }

    socket.on('message', onMessage)
  })
}

const socket = new WebSocket('ws://localhost:4001')
await new Promise((resolve, reject) => {
  socket.on('open', resolve)
  socket.on('error', reject)
})

const login = await request('/api/auth/admin/login', {
  method: 'POST',
  body: JSON.stringify({ email: 'admin@thehaven.org', password: 'TheHaven2026!' }),
})

const adminToken = login.token
const createdEventPromise = waitForSocketEvent(socket, (payload) => payload.type === 'chat:update' && payload.event === 'conversation-created')
const customerConversation = await request('/api/chat/conversations', {
  method: 'POST',
  body: JSON.stringify({
    customer_name: 'Test Customer',
    customer_email: 'customer@example.com',
    customer_phone: '+1 (555) 010-0000',
    donation_amount: 100,
    donation_currency: 'USD',
    donation_frequency: 'Monthly',
    first_message: 'I would like to make a monthly donation to The Haven.',
  }),
})

const createdEvent = await createdEventPromise
console.log('websocket-created', createdEvent.conversation.id)

const customerMessageEventPromise = waitForSocketEvent(socket, (payload) => payload.type === 'chat:update' && payload.event === 'message-sent')
const customerMessage = await request(`/api/chat/conversations/${customerConversation.id}/messages`, {
  method: 'POST',
  body: JSON.stringify({
    sender_type: 'CUSTOMER',
    sender_id: 'customer-test-1',
    message: 'Can you help me with the secure monthly donation process?',
  }),
})
await customerMessageEventPromise

const adminConversations = await request('/api/admin/conversations', {
  method: 'GET',
  headers: { Authorization: `Bearer ${adminToken}` },
})

const seenConversation = adminConversations.conversations.find((conversation) => conversation.id === customerConversation.id)
if (!seenConversation) {
  throw new Error('Customer conversation did not appear in admin queue')
}

const adminReplyEventPromise = waitForSocketEvent(socket, (payload) => payload.type === 'chat:update' && payload.event === 'admin-reply')
const adminReply = await request(`/api/admin/conversations/${customerConversation.id}/messages`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${adminToken}` },
  body: JSON.stringify({ message: 'Absolutely — we can securely confirm your monthly commitment before payment.' }),
})

const messageEvent = await adminReplyEventPromise
console.log('websocket-admin-reply', messageEvent.conversation.id)

const refreshedAdmin = await request('/api/admin/conversations', {
  method: 'GET',
  headers: { Authorization: `Bearer ${adminToken}` },
})

const finalConversation = refreshedAdmin.conversations.find((conversation) => conversation.id === customerConversation.id)
if (!finalConversation || !finalConversation.messages.some((message) => message.message.includes('securely confirm'))) {
  throw new Error('Admin reply not persisted to the conversation history')
}

console.log('chat flow verified')
console.log(JSON.stringify({
  conversationId: customerConversation.id,
  customerMessage: customerMessage.message,
  adminReply: adminReply.conversation.messages[adminReply.conversation.messages.length - 1]?.message,
  adminCount: refreshedAdmin.conversations.length,
}, null, 2))

socket.close()
await new Promise((resolve) => setTimeout(resolve, 250))

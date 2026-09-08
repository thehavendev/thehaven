import express from 'express'
import cors from 'cors'
import { WebSocketServer } from 'ws'
import { createServer } from 'node:http'
import { randomUUID, createHmac, randomBytes } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import Database from 'better-sqlite3'
import nodemailer from 'nodemailer'

const app = express()
const httpServer = createServer(app)
const port = Number(process.env.PORT || 4001)
const dataDir = join(process.cwd(), 'data')
mkdirSync(dataDir, { recursive: true })

const db = new Database(join(dataDir, 'thehaven.db'))
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    donation_amount REAL NOT NULL,
    donation_currency TEXT NOT NULL DEFAULT 'USD',
    donation_frequency TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'NEW',
    assigned_admin TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_message_at TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender_type TEXT NOT NULL CHECK(sender_type IN ('CUSTOMER', 'ADMIN', 'SYSTEM')),
    sender_id TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TEXT,
    FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS admin_logs (
    id TEXT PRIMARY KEY,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
  CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at);
  CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
`)

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@thehaven.health'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TheHaven2026!'
const EMAIL_TO = process.env.EMAIL_TO || 'contact.thehavenfoundation.org@gmail.com'
const JWT_SECRET = process.env.JWT_SECRET || 'thehaven-chat-secret'

app.use(cors())
app.use(express.json({ limit: '1mb' }))

const wss = new WebSocketServer({ server: httpServer })
const wsClients = new Set()

function broadcastChatEvent(event) {
  const payload = JSON.stringify({ type: 'chat:update', ...event })
  for (const client of wsClients) {
    if (client.readyState === 1) client.send(payload)
  }
}

wss.on('connection', (socket) => {
  wsClients.add(socket)
  socket.on('close', () => wsClients.delete(socket))
})

function createToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${signature}`
}

function verifyToken(token) {
  if (!token || !token.startsWith('Bearer ')) return null
  const raw = token.replace('Bearer ', '').trim()
  const parts = raw.split('.')
  if (parts.length !== 3) return null

  const [header, payload, signature] = parts
  const expected = createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url')
  if (signature !== expected) return null

  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
  } catch {
    return null
  }
}

function isAdminAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization
  const user = verifyToken(authHeader || '')

  if (!user || user.email !== ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Unauthorized administrator access.' })
  }

  req.adminEmail = user.email
  return next()
}

function sanitizeConversation(row) {
  const messageQuery = db.prepare(`
    SELECT message, sender_type, created_at
    FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at DESC
    LIMIT 1
  `)
  const lastMessage = messageQuery.get(row.id) || null
  const unreadCount = db.prepare(`
    SELECT COUNT(*) AS count
    FROM messages
    WHERE conversation_id = ?
      AND sender_type = 'CUSTOMER'
      AND read_at IS NULL
  `).get(row.id)?.count || 0

  return {
    id: row.id,
    customer_name: row.customer_name,
    customer_email: row.customer_email,
    customer_phone: row.customer_phone,
    donation_amount: Number(row.donation_amount),
    donation_currency: row.donation_currency,
    donation_frequency: row.donation_frequency,
    status: row.status,
    assigned_admin: row.assigned_admin,
    created_at: row.created_at,
    updated_at: row.updated_at,
    last_message_at: row.last_message_at,
    last_message: lastMessage?.message || '',
    unread_count: Number(unreadCount),
    messages: fetchConversationMessages(row.id),
  }
}

function fetchConversationMessages(conversationId) {
  return db.prepare(`
    SELECT id, conversation_id, sender_type, sender_id, message, created_at
    FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
  `).all(conversationId)
}

function normalizeStatus(status) {
  const allowed = ['NEW', 'WAITING FOR REPRESENTATIVE', 'IN PROGRESS', 'PAYMENT PENDING', 'COMPLETED', 'CLOSED']
  return allowed.includes(status) ? status : 'NEW'
}

async function sendAdminNotification(conversation) {
  const subject = 'New Customer Chat'
  const messageText = `New Customer Chat\n\nCustomer:\n${conversation.customer_name}\n\nEmail:\n${conversation.customer_email}\n\nDonation Commitment:\n$${Number(conversation.donation_amount).toFixed(2)} ${conversation.donation_currency || 'USD'}\n\nFrequency:\n${conversation.donation_frequency}\n\nMessage:\n${conversation.first_message || 'No message provided.'}`

  const emailBody = `
    <h2>New Customer Chat</h2>
    <p><strong>Customer:</strong> ${conversation.customer_name}</p>
    <p><strong>Email:</strong> ${conversation.customer_email}</p>
    <p><strong>Donation Commitment:</strong> $${Number(conversation.donation_amount).toFixed(2)} ${conversation.donation_currency || 'USD'}</p>
    <p><strong>Frequency:</strong> ${conversation.donation_frequency}</p>
    <p><strong>Message:</strong> ${conversation.first_message || 'No message provided.'}</p>
    <p><a href="${process.env.ADMIN_UI_URL || 'http://localhost:5173'}/admin" target="_blank" rel="noreferrer">Open Administrator Conversation</a></p>
  `

  const transporterConfig = {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    secure: Boolean(process.env.SMTP_SECURE === 'true'),
    auth: process.env.SMTP_USER && process.env.SMTP_PASS
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  }

  if (!transporterConfig.host || !transporterConfig.auth) {
    console.log('EMAIL_NOTIFICATION_QUEUED')
    console.log(messageText)
    return { queued: true }
  }

  const transporter = nodemailer.createTransport(transporterConfig)
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@thehaven.org',
    to: EMAIL_TO,
    subject,
    text: messageText,
    html: emailBody,
  })

  return { queued: false }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'the-haven-chat' })
})

app.post('/api/auth/admin/login', (req, res) => {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    // Log failed admin login attempt (do NOT store passwords)
    try {
      db.prepare(`INSERT INTO admin_logs (id, admin_email, action, details, created_at) VALUES (?, ?, ?, ?, ?)`)
        .run(randomUUID(), email || 'unknown', 'login-failed', JSON.stringify({ ip: req.ip || '' }), new Date().toISOString())
    } catch (e) {
      console.error('Failed to write failed-login admin log', e)
    }

    console.warn(`Admin login failed for ${email} from ${req.ip || 'unknown'}`)
    return res.status(401).json({ error: 'Invalid administrator credentials.' })
  }

  const token = createToken({ email, role: 'admin', exp: Date.now() + 1000 * 60 * 60 * 12 })

  try {
    db.prepare(`INSERT INTO admin_logs (id, admin_email, action, details, created_at) VALUES (?, ?, ?, ?, ?)`)
      .run(randomUUID(), email, 'login', JSON.stringify({ ip: req.ip || '' }), new Date().toISOString())
  } catch (e) {
    console.error('Failed to write admin login log', e)
  }
  return res.json({ token, user: email })
})

app.get('/api/admin/conversations', isAdminAuthenticated, (req, res) => {
  const rows = db.prepare(`
    SELECT *
    FROM conversations
    ORDER BY COALESCE(last_message_at, created_at) DESC
  `).all()

  const conversations = rows.map((row) => sanitizeConversation(row))
  return res.json({ conversations, admin: req.adminEmail })
})

app.post('/api/chat/conversations', async (req, res) => {
  const {
    customer_name,
    customer_email,
    customer_phone = '',
    donation_amount,
    donation_currency = 'USD',
    donation_frequency,
    first_message = '',
    status = 'NEW',
  } = req.body || {}

  if (!customer_name || !customer_email || !donation_amount || !donation_frequency) {
    return res.status(400).json({ error: 'Customer name, email, donation amount, and donation frequency are required.' })
  }

  const id = randomUUID()
  const now = new Date().toISOString()

  db.transaction(() => {
    db.prepare(`
      INSERT INTO conversations (
        id,
        customer_name,
        customer_email,
        customer_phone,
        donation_amount,
        donation_currency,
        donation_frequency,
        status,
        assigned_admin,
        created_at,
        updated_at,
        last_message_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      customer_name,
      customer_email,
      customer_phone,
      Number(donation_amount),
      donation_currency,
      donation_frequency,
      normalizeStatus(status),
      null,
      now,
      now,
      now,
    )

    if (first_message && String(first_message).trim()) {
      db.prepare(`
        INSERT INTO messages (id, conversation_id, sender_type, sender_id, message, created_at, read_at)
        VALUES (?, ?, 'CUSTOMER', ?, ?, ?, NULL)
      `).run(randomUUID(), id, `customer-${id}`, String(first_message).trim(), now)
    }
  })()

  const conversation = sanitizeConversation(
    db.prepare('SELECT * FROM conversations WHERE id = ?').get(id),
  )

  broadcastChatEvent({ event: 'conversation-created', conversation })

  await sendAdminNotification({
    customer_name,
    customer_email,
    donation_amount,
    donation_currency,
    donation_frequency,
    first_message,
  })

  res.status(201).json(conversation)
})

app.post('/api/chat/conversations/:id/messages', (req, res) => {
  const { id } = req.params
  const { sender_type, sender_id, message } = req.body || {}

  if (!id || !sender_type || !message || !String(message).trim()) {
    return res.status(400).json({ error: 'A valid conversation ID, sender type, and message are required.' })
  }

  const safeSenderType = ['CUSTOMER', 'ADMIN', 'SYSTEM'].includes(sender_type) ? sender_type : 'CUSTOMER'
  const conversationRow = db.prepare('SELECT * FROM conversations WHERE id = ?').get(id)

  if (!conversationRow) {
    return res.status(404).json({ error: 'Conversation not found.' })
  }

  const now = new Date().toISOString()
  const messageId = randomUUID()

  db.transaction(() => {
    db.prepare(`
      INSERT INTO messages (id, conversation_id, sender_type, sender_id, message, created_at, read_at)
      VALUES (?, ?, ?, ?, ?, ?, NULL)
    `).run(messageId, id, safeSenderType, sender_id || `anonymous-${safeSenderType}`, String(message).trim(), now)

    db.prepare(`
      UPDATE conversations
      SET updated_at = ?,
          last_message_at = ?,
          status = ?
      WHERE id = ?
    `).run(
      now,
      now,
      safeSenderType === 'CUSTOMER' ? 'WAITING FOR REPRESENTATIVE' : conversationRow.status,
      id,
    )
  })()

  const conversation = sanitizeConversation(db.prepare('SELECT * FROM conversations WHERE id = ?').get(id))
  broadcastChatEvent({ event: 'message-sent', conversation })

  // If a customer sent a message, notify admins via email (queued if SMTP not configured)
  if (safeSenderType === 'CUSTOMER') {
    // send minimal conversation info including last message
    sendAdminNotification({
      customer_name: conversation.customer_name,
      customer_email: conversation.customer_email,
      donation_amount: conversation.donation_amount,
      donation_currency: conversation.donation_currency,
      donation_frequency: conversation.donation_frequency,
      first_message: String(message).trim(),
    }).catch((err) => console.error('Failed to send admin notification:', err))
  }

  res.status(201).json({
    id: messageId,
    conversation_id: id,
    sender_type: safeSenderType,
    sender_id: sender_id || `anonymous-${safeSenderType}`,
    message: String(message).trim(),
    created_at: now,
    conversation,
  })
})

app.patch('/api/admin/conversations/:id/status', isAdminAuthenticated, (req, res) => {
  const { id } = req.params
  const { status } = req.body || {}

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' })
  }

  const normalized = normalizeStatus(status)
  const now = new Date().toISOString()
  const row = db.prepare('SELECT * FROM conversations WHERE id = ?').get(id)

  if (!row) {
    return res.status(404).json({ error: 'Conversation not found.' })
  }

  db.prepare(`
    UPDATE conversations
    SET status = ?, updated_at = ?, last_message_at = ?
    WHERE id = ?
  `).run(normalized, now, now, id)

  db.prepare(`
    INSERT INTO messages (id, conversation_id, sender_type, sender_id, message, created_at, read_at)
    VALUES (?, ?, 'SYSTEM', ?, ?, ?, NULL)
  `).run(randomUUID(), id, `admin-${req.adminEmail}`, `Conversation status updated to ${normalized}.`, now)

  // admin log
  try {
    db.prepare(`INSERT INTO admin_logs (id, admin_email, action, details, created_at) VALUES (?, ?, ?, ?, ?)`)
      .run(randomUUID(), req.adminEmail, 'status-update', JSON.stringify({ conversation_id: id, status: normalized }), now)
  } catch (e) {
    console.error('Failed to write admin log', e)
  }

  const conversation = sanitizeConversation(db.prepare('SELECT * FROM conversations WHERE id = ?').get(id))
  broadcastChatEvent({ event: 'status-updated', conversation })

  res.json(conversation)
})

app.post('/api/admin/conversations/:id/messages', isAdminAuthenticated, (req, res) => {
  const { id } = req.params
  const { message } = req.body || {}

  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: 'Admin reply message is required.' })
  }

  const now = new Date().toISOString()
  const messageId = randomUUID()
  const row = db.prepare('SELECT * FROM conversations WHERE id = ?').get(id)

  if (!row) {
    return res.status(404).json({ error: 'Conversation not found.' })
  }

  db.transaction(() => {
    db.prepare(`
      INSERT INTO messages (id, conversation_id, sender_type, sender_id, message, created_at, read_at)
      VALUES (?, ?, 'ADMIN', ?, ?, ?, NULL)
    `).run(messageId, id, `admin-${req.adminEmail}`, String(message).trim(), now)

    db.prepare(`
      UPDATE conversations
      SET status = ?, updated_at = ?, last_message_at = ?, assigned_admin = ?
      WHERE id = ?
    `).run('IN PROGRESS', now, now, req.adminEmail, id)
  })()

  const conversation = sanitizeConversation(db.prepare('SELECT * FROM conversations WHERE id = ?').get(id))
  broadcastChatEvent({ event: 'admin-reply', conversation })

  // admin log for replies
  try {
    db.prepare(`INSERT INTO admin_logs (id, admin_email, action, details, created_at) VALUES (?, ?, ?, ?, ?)`)
      .run(randomUUID(), req.adminEmail, 'reply', JSON.stringify({ conversation_id: id, message: String(message).trim() }), now)
  } catch (e) {
    console.error('Failed to write admin reply log', e)
  }

  res.status(201).json({
    id: messageId,
    conversation_id: id,
    sender_type: 'ADMIN',
    sender_id: `admin-${req.adminEmail}`,
    message: String(message).trim(),
    created_at: now,
    conversation,
  })
})

app.get('/api/chat/conversations/:id', (req, res) => {
  const { id } = req.params
  const row = db.prepare('SELECT * FROM conversations WHERE id = ?').get(id)

  if (!row) {
    return res.status(404).json({ error: 'Conversation not found.' })
  }

  return res.json(sanitizeConversation(row))
})

app.get('/api/admin/logs', isAdminAuthenticated, (req, res) => {
  const rows = db.prepare(`SELECT id, admin_email, action, details, created_at FROM admin_logs ORDER BY created_at DESC LIMIT 200`).all()
  return res.json({ logs: rows })
})

httpServer.listen(port, () => {
  console.log(`The Haven chat backend running on http://localhost:${port}`)
})

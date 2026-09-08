import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import './App.css'

const OFFICIAL_EMAIL = 'contact.thehavenfoundation.org@gmail.com'

const heroStats = [
  { value: 500, suffix: '+', label: 'Children Supported' },
  { value: 10000, suffix: '+', label: 'Meals Provided' },
  { value: 95, suffix: '%', label: 'School Enrollment' },
  { value: 25, suffix: '+', label: 'Community Programs' },
]

const childrenStories = [
  {
    name: 'Amina',
    age: '8-10',
    story: 'Amina is learning to read with confidence and enjoys drawing scenes from her favorite books and stories.',
    interest: 'Reading & Art',
  },
  {
    name: 'Daniel',
    age: '11-13',
    story: 'Daniel is building practical skills in the workshop and developing routines that help him feel more secure and capable.',
    interest: 'Hands-on Projects',
  },
  {
    name: 'Leah',
    age: '6-8',
    story: 'Leah has grown more confident through music, play, and supportive routines that help her feel at home.',
    interest: 'Music & Play',
  },
]

const programs = [
  { title: 'Safe Shelter & Care', description: 'Providing a secure, nurturing environment where children can feel protected and supported.', icon: '🏠' },
  { title: 'Education & Learning', description: 'Supporting access to quality education, learning materials, tutoring, and academic development.', icon: '📚' },
  { title: 'Healthcare & Wellness', description: 'Helping children access essential healthcare and develop healthy lives.', icon: '💊' },
  { title: 'Nutrition', description: 'Providing nutritious meals and supporting healthy physical development.', icon: '🥗' },
  { title: 'Emotional Wellbeing', description: 'Creating supportive environments where children can develop confidence, resilience, and healthy relationships.', icon: '💛' },
  { title: 'Skills & Future Opportunities', description: 'Helping older children develop practical skills, confidence, and pathways toward independence.', icon: '🌱' },
]

const impactStats = [
  { value: 500, suffix: '+', label: 'Children Supported' },
  { value: 12500, suffix: '+', label: 'Meals Provided' },
  { value: 850, suffix: '+', label: 'Educational Resources' },
  { value: 1200, suffix: '+', label: 'Healthcare Visits' },
  { value: 75, suffix: '+', label: 'Volunteers' },
  { value: 30, suffix: '+', label: 'Community Initiatives' },
]

const transparencyBreakdown = [
  { label: 'Food & Nutrition', value: 24 },
  { label: 'Education', value: 26 },
  { label: 'Healthcare', value: 15 },
  { label: 'Housing & Utilities', value: 18 },
  { label: 'Child Development', value: 11 },
  { label: 'Operations', value: 6 },
]

const testimonials = [
  {
    quote: 'The Haven creates a thoughtful, stable environment where children can feel safe and encouraged to grow. It is a model of dignity and care.',
    name: 'Nia T.',
    role: 'Volunteer Mentor',
  },
  {
    quote: 'The organization balances warmth with professionalism, and it is clear that the children are seen as individuals with potential and promise.',
    name: 'Andre L.',
    role: 'Community Partner',
  },
  {
    quote: 'The care and attention given to every child feels genuinely human and deeply intentional. It is a place built on trust.',
    name: 'Sara M.',
    role: 'Education Supporter',
  },
]

const faqs = [
  { q: 'How can I donate?', a: 'You can choose a one-time or monthly commitment, then speak with a representative in the live chat to complete the donation securely.' },
  { q: 'Can I make a monthly donation?', a: 'Yes. The donation experience allows you to select a monthly commitment and continue the conversation with a representative.' },
  { q: 'How are donations used?', a: 'Donations help support shelter, education, healthcare, nutrition, wellbeing, and child-development programs with regular reporting and accountability.' },
  { q: 'How can I volunteer?', a: 'Visit the Get Involved section or contact our team through the support panel to learn about mentoring and skills-based opportunities.' },
  { q: 'Can organizations partner with The Haven?', a: 'Yes. We welcome partnerships with businesses, schools, and community organizations. Please use the partnership inquiry form.' },
  { q: 'How can I support The Haven remotely?', a: 'You can donate online, share our stories, fundraise in your network, or contribute professional skills and support remotely.' },
  { q: 'How can I contact The Haven?', a: 'Use the contact page or the live support feature to connect with the team for donations, volunteering, or general questions.' },
  { q: 'Can I fundraise for The Haven?', a: 'Yes. We welcome fundraising efforts that align with our mission. Please connect with our team to coordinate.' },
  { q: 'How does The Haven protect children?', a: 'We follow safeguarding standards, protect privacy, and maintain strict child-protection policies across all programs and communications.' },
]

const newsArticles = [
  {
    category: 'Stories of Hope',
    title: 'A new reading corner opens for children to explore imagination and confidence.',
    description: 'Thoughtful learning spaces help children feel more settled, curious, and excited about the future.',
    date: 'May 14, 2026',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'Community Updates',
    title: 'Local volunteers join a community garden day with The Haven.',
    description: 'A collective day of care and hands-on support brought together neighbors, families, and volunteers.',
    date: 'April 28, 2026',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'Education',
    title: 'Learning kits and mentorship sessions expand support for school readiness.',
    description: 'Practical resources and caring guidance help children feel prepared and supported in their learning journey.',
    date: 'March 31, 2026',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
  },
]

const events = [
  {
    name: 'Community Reading Day',
    date: 'June 18, 2026',
    time: '10:00 AM - 1:00 PM',
    location: 'The Haven Learning Centre',
    description: 'A welcoming afternoon of books, storytelling, and family connection.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Wellbeing & Wellness Workshop',
    date: 'July 02, 2026',
    time: '2:00 PM - 4:30 PM',
    location: 'Community Hall',
    description: 'A guided session focused on resilient habits, healthy routines, and emotional support.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Open House & Volunteer Morning',
    date: 'July 23, 2026',
    time: '9:00 AM - 12:00 PM',
    location: 'The Haven Campus',
    description: 'An opportunity for community members to connect with staff and learn about support programs.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  },
]

const partnerLogos = ['Community Care', 'Bright Future', 'Northstar', 'Rooted Learning', 'Civic Works', 'Kind Hands']

const donationImpact = [
  { amount: 25, detail: 'Can help provide essential daily supplies.' },
  { amount: 50, detail: 'Can support educational resources.' },
  { amount: 100, detail: 'Can contribute toward healthcare and wellbeing.' },
  { amount: 250, detail: 'Can support broader child-development needs.' },
]

const adminStats = [
  { label: 'Total Donations', value: '$84,250' },
  { label: 'Monthly Donations', value: '$12,740' },
  { label: 'One-Time Donations', value: '$45,600' },
  { label: 'Number of Donors', value: '368' },
  { label: 'Average Donation', value: '$140' },
  { label: 'Recent Donations', value: '17' },
]

const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? 'http://localhost:4001' : 'https://thehaven.onrender.com')

const representativeChats = [
  {
    id: 'CHAT-1041',
    donor: 'Ava Thompson',
    email: 'ava.thompson@gmail.com',
    phone: '+1 (415) 555-0198',
    status: 'NEW',
    amount: 100,
    frequency: 'MONTHLY',
    lastUpdated: '2 min ago',
    preview: 'Hello, I’d like to make a $100 monthly donation to The Haven.',
    messages: [
      { sender: 'donor', text: 'Hello, I’d like to make a $100 monthly donation to The Haven.', time: '09:14 AM' },
      { sender: 'rep', text: 'Thank you for your interest in supporting The Haven. I can help with the next steps and payment instructions.', time: '09:16 AM' },
    ],
  },
  {
    id: 'CHAT-1048',
    donor: 'Marcus Reid',
    email: 'marcus.reid@email.com',
    phone: '+1 (503) 555-1184',
    status: 'PAYMENT PENDING',
    amount: 250,
    frequency: 'ONE-TIME',
    lastUpdated: '18 min ago',
    preview: 'I would like to speak about how my donation can support education.',
    messages: [
      { sender: 'donor', text: 'I would like to speak about how my donation can support education.', time: '08:47 AM' },
      { sender: 'rep', text: 'Absolutely. A donation of this size can help support educational resources and learning programs.', time: '08:49 AM' },
    ],
  },
  {
    id: 'CHAT-1049',
    donor: 'Lena Brooks',
    email: 'lena.brooks@email.com',
    phone: '+1 (206) 555-4741',
    status: 'IN PROGRESS',
    amount: 50,
    frequency: 'MONTHLY',
    lastUpdated: '40 min ago',
    preview: 'Can I change the amount after the first conversation?',
    messages: [
      { sender: 'donor', text: 'Can I change the amount after the first conversation?', time: '08:05 AM' },
      { sender: 'rep', text: 'Of course. We can adjust the commitment before payment is completed.', time: '08:11 AM' },
    ],
  },
]

function formatCurrency(value) {
  const numericValue = Number(value || 0)
  return `$${numericValue.toLocaleString('en-US')} USD`
}

function formatChatTime(value) {
  if (!value) return 'Now'

  try {
    return new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  } catch {
    return 'Now'
  }
}

function normalizeConversation(conversation) {
  const messages = Array.isArray(conversation?.messages) ? conversation.messages.map((message) => {
    const sender = message.sender_type === 'ADMIN'
      ? 'rep'
      : message.sender_type === 'SYSTEM'
        ? 'system'
        : 'donor'

    return {
      id: message.id,
      sender,
      name: message.sender_type === 'ADMIN' ? 'Naomi Martin' : message.sender_type === 'SYSTEM' ? 'System' : conversation.customer_name || 'Supporter',
      text: message.message,
      time: formatChatTime(message.created_at),
    }
  }) : []

  return {
    id: conversation.id,
    donor: conversation.customer_name || conversation.donor || 'Supporter',
    email: conversation.customer_email || conversation.email || '',
    phone: conversation.customer_phone || conversation.phone || '+1 (000) 000-0000',
    status: conversation.status || 'NEW',
    amount: Number(conversation.donation_amount ?? conversation.amount ?? 0),
    frequency: conversation.donation_frequency || conversation.frequency || 'MONTHLY',
    lastUpdated: 'Just now',
    preview: conversation.last_message || messages.at(-1)?.text || 'New conversation started.',
    messages,
    created_at: conversation.created_at,
  }
}

function formatNumber(value, suffix = '') {
  const rounded = Number(value).toLocaleString('en-US')
  return `${rounded}${suffix}`
}

function Counter({ value, suffix, label }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let frame = 0
    const duration = 1200
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <div className="stat-block">
      <strong>{formatNumber(display, suffix)}</strong>
      <span>{label}</span>
    </div>
  )
}

function ScrollToAnchor({ id }) {
  useEffect(() => {
    if (window.location.hash === `#${id}`) {
      const element = document.getElementById(id)
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [id])

  return null
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Our Children', to: '/#children' },
    { label: 'Programs', to: '/#programs' },
    { label: 'Our Impact', to: '/#impact' },
    { label: 'Get Involved', to: '/#involved' },
    { label: 'Contact', to: '/contact' },
  ]

  return (
    <header className="site-header">
      <nav className="topbar" aria-label="Main navigation">
        <NavLink to="/" className="brand" aria-label="The Haven home">
          <span className="brand-mark">TH</span>
          <span className="brand-copy">
            <strong>The Haven</strong>
            <small>Every Child Deserves a Haven.</small>
          </span>
        </NavLink>

        <button type="button" className="nav-toggle" aria-label="Toggle navigation menu" aria-expanded={isOpen} onClick={() => setIsOpen((v) => !v)}>
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <a key={item.label} href={item.to} onClick={() => setIsOpen(false)}>
              {item.label}
            </a>
          ))}
          <NavLink to="/donate" className="button button-primary nav-donate">
            Donate Now
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand brand-footer">
            <span className="brand-mark">TH</span>
            <span className="brand-copy">
              <strong>The Haven</strong>
            </span>
          </div>
          <p>Creating safe spaces, brighter futures, and opportunities for every child.</p>
        </div>

        <div>
          <h3>About</h3>
          <ul>
            <li>About Us</li>
            <li>Our Mission</li>
            <li>Our Values</li>
            <li>Our Team</li>
          </ul>
        </div>

        <div>
          <h3>Programs</h3>
          <ul>
            <li>Safe Shelter</li>
            <li>Education</li>
            <li>Healthcare</li>
            <li>Nutrition</li>
            <li>Wellbeing</li>
            <li>Skills Development</li>
          </ul>
        </div>

        <div>
          <h3>Get Involved</h3>
          <ul>
            <li>Donate</li>
            <li>Volunteer</li>
            <li>Partner With Us</li>
            <li>Fundraise</li>
          </ul>
        </div>

        <div>
          <h3>Resources</h3>
          <ul>
            <li>Stories</li>
            <li>News</li>
            <li>Events</li>
            <li>Reports</li>
            <li>FAQ</li>
          </ul>
        </div>

        <div>
          <h3>Contact</h3>
          <ul>
            <li>{OFFICIAL_EMAIL}</li>
            <li>+1 (555) 219-8946</li>
            <li>145 Willow Lane, Portland, OR</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 The Haven. All Rights Reserved.</span>
        <div className="legal-links">
          <span>Privacy Policy</span>
          <span>Terms of Use</span>
          <span>Donation Policy</span>
          <span>Child Safeguarding Policy</span>
          <span>Accessibility</span>
        </div>
      </div>
    </footer>
  )
}

function SupportPanel() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'Ask a Question', message: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  return (
    <>
      <button type="button" className="support-fab" onClick={() => setOpen((value) => !value)}>
        Support
      </button>

      {open && (
        <aside className="support-panel" aria-label="Support panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Need help?</span>
              <h3>Contact The Haven</h3>
            </div>
            <button type="button" className="close-button" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          <div className="support-options">
            {['Ask a Question', 'Donation Support', 'Volunteer Support', 'Partnership Inquiry', 'General Support'].map((option) => (
              <button key={option} type="button" className={form.subject === option ? 'selected' : ''} onClick={() => setForm((current) => ({ ...current, subject: option }))}>
                {option}
              </button>
            ))}
          </div>

          <form className="support-form">
            <label>
              Full Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} />
            </label>
            <label>
              Subject
              <select name="subject" value={form.subject} onChange={handleChange}>
                {['Ask a Question', 'Donation Support', 'Volunteer Support', 'Partnership Inquiry', 'General Support'].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              Message
              <textarea name="message" value={form.message} onChange={handleChange} rows="4" required />
            </label>
            <button type="submit" className="button button-primary full-width">Send Message</button>
          </form>

          <div className="support-contact">
            <p>Email: {OFFICIAL_EMAIL}</p>
            <p>Phone: +1 (555) 219-8946</p>
            <p>Office: 145 Willow Lane, Portland, OR</p>
            <p>Opening Hours: Mon–Fri, 9:00 AM–5:00 PM</p>
          </div>
        </aside>
      )}
    </>
  )
}

function DonationChat({ commitment, donorName = 'Supporter', onClose, chatId, initialMessages = [], onSendMessage }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(
    initialMessages.length > 0
      ? initialMessages
      : [
          { sender: 'system', text: `Donation Commitment: ${formatCurrency(commitment.amount)} — ${commitment.frequency}`, time: 'Now' },
          { sender: 'system', text: 'Hello! Thank you for choosing to support The Haven. A customer representative will assist you with completing your donation.', time: 'Now' },
          { sender: 'rep', name: 'Naomi', text: `Hi ${donorName || 'friend'}, I am Naomi from The Haven support team. I can help with your donation and the safest next steps for payment.`, time: '09:18 AM' },
        ],
  )
  const [repTyping, setRepTyping] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const updateConnection = () => setIsOffline(!navigator.onLine)
    updateConnection()
    window.addEventListener('online', updateConnection)
    window.addEventListener('offline', updateConnection)
    return () => {
      window.removeEventListener('online', updateConnection)
      window.removeEventListener('offline', updateConnection)
    }
  }, [])

  const sendMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed || isSending) return

    setMessages((current) => [...current, { sender: 'donor', name: donorName || 'You', text: trimmed, time: 'Now' }])
    setInput('')
    setIsSending(true)
    setRepTyping(true)
    onSendMessage?.(chatId, trimmed)

    window.setTimeout(() => {
      const responseText =
        commitment.frequency === 'MONTHLY'
          ? 'Thank you for your monthly commitment. We can provide secure payment instructions once you confirm your preferred payment method and a safe way to proceed.'
          : 'Thank you for your one-time commitment. I can walk you through the secure payment process and answer any questions without asking for sensitive financial credentials in chat.'

      setMessages((current) => [...current, { sender: 'rep', name: 'Naomi', text: responseText, time: 'Just now' }])
      setRepTyping(false)
      setIsSending(false)
    }, 900)
  }

  return (
    <div className="chat-shell">
      <div className="chat-header">
        <div className="chat-profile">
          <div className="avatar">N</div>
          <div>
            <strong>Naomi</strong>
            <span>{isOffline ? 'Offline — temporarily disconnected' : 'Customer Support • Online'}</span>
          </div>
        </div>
        <div className="chat-actions">
          <button type="button" className="ghost-button" onClick={onClose}>Return to form</button>
        </div>
      </div>

      <div className="chat-summary">
        <span>Donation Commitment</span>
        <strong>{formatCurrency(commitment.amount)}</strong>
        <small>{commitment.frequency}</small>
      </div>

      {isOffline && <div className="chat-status-banner">You are offline. Your message will be queued for the next available representative.</div>}

      <div className="chat-body">
        {messages.map((message, index) => (
          <div key={`${message.sender}-${index}`} className={`chat-bubble ${message.sender}`}>
            {message.name && <span className="bubble-author">{message.name}</span>}
            <p>{message.text}</p>
            <time>{message.time}</time>
          </div>
        ))}

        {repTyping && (
          <div className="chat-bubble rep typing">
            <span className="bubble-author">Naomi</span>
            <div className="typing-dots"><span /><span /><span /></div>
          </div>
        )}
      </div>

      <div className="chat-security-note">
        <strong>Secure guidance:</strong> Our team never requests card numbers, CVV, passwords, PINs, or authentication codes in chat.
      </div>

      <div className="chat-input-row">
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type a message..." disabled={isOffline} />
        <button type="button" className="button button-primary" onClick={() => sendMessage(input)} disabled={isOffline || isSending}>
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

function HomePage({ onNewChatStarted, onDonorMessage }) {
  const [selectedTestimonial, setSelectedTestimonial] = useState(0)
  const [activeFaq, setActiveFaq] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', amount: '100', frequency: 'MONTHLY' })
  const [chatOpen, setChatOpen] = useState(false)
  const [chatCommitment, setChatCommitment] = useState({ amount: 100, frequency: 'MONTHLY' })
  const [chatMeta, setChatMeta] = useState(null)
  const [submitStatus, setSubmitStatus] = useState('')

  const selected = testimonials[selectedTestimonial]

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.email || !form.amount) {
      setSubmitStatus('Please complete the required donation fields.')
      return
    }

    const commitment = { amount: Number(form.amount), frequency: form.frequency }
    const preview = `I’d like to support The Haven with a ${form.frequency.toLowerCase()} donation of ${formatCurrency(Number(form.amount))}.`
    const createdChat = await onNewChatStarted({
      donor: form.name,
      email: form.email,
      phone: '+1 (000) 000-0000',
      amount: Number(form.amount),
      frequency: form.frequency,
      preview,
      message: preview,
    })

    setChatCommitment(commitment)
    setChatMeta(createdChat || {
      id: `CHAT-${Date.now()}`,
      donor: form.name,
      email: form.email,
      phone: '+1 (000) 000-0000',
      status: 'WAITING FOR REPRESENTATIVE',
      amount: Number(form.amount),
      frequency: form.frequency,
      lastUpdated: 'Just now',
      preview,
      messages: [{ sender: 'donor', text: preview, time: 'Now' }],
    })
    setSubmitStatus('')
    setChatOpen(true)
  }

  const containerClass = useMemo(
    () => ({ backgroundImage: "linear-gradient(90deg, rgba(13, 28, 24, 0.7), rgba(13, 28, 24, 0.28)), url('https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1500&q=80')" }),
    [],
  )

  return (
    <>
      <ScrollToAnchor id="children" />
      <section className="hero-section" style={containerClass}>
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow light">A safe place to grow</span>
            <h1>Every Child Deserves a Haven.</h1>
            <p>Creating a safe place where children can grow, learn, heal, and build brighter futures.</p>
            <div className="button-row">
              <a href="#donate" className="button button-primary">Donate Now</a>
              <a href="#about" className="button button-secondary">Discover Our Mission</a>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">Scroll</div>
      </section>

      <div className="container trust-strip">
        {heroStats.map((stat) => (
          <div key={stat.label} className="mini-stat">
            <strong>{formatNumber(stat.value, stat.suffix)}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <main>
        <section id="about" className="section split-section">
          <div className="container split-grid">
            <div className="image-panel">
              <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80" alt="Children learning together in a safe and supportive environment" />
            </div>
            <div className="content-panel">
              <span className="eyebrow">Who We Are</span>
              <h2>More Than a Home. A Place to Belong.</h2>
              <p>The Haven exists to give vulnerable children more than a roof over their heads. We create an environment where every child can feel safe, valued, supported, and empowered to build a future filled with possibility.</p>

              <div className="feature-list">
                <div>
                  <h3>Mission</h3>
                  <p>Provide safe care, education, healthcare, and opportunities for vulnerable children.</p>
                </div>
                <div>
                  <h3>Vision</h3>
                  <p>A future where every child has the opportunity to grow, thrive, and reach their potential.</p>
                </div>
                <div>
                  <h3>Values</h3>
                  <p>Compassion · Integrity · Safety · Education · Dignity · Community</p>
                </div>
              </div>

              <a href="/about" className="button button-primary">Learn More About Us</a>
            </div>
          </div>
        </section>

        <section id="children" className="section section-soft">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Our Children</span>
              <h2>Every Child Has a Story. Every Story Deserves Hope.</h2>
            </div>
            <p className="section-intro">The Haven focuses on creating opportunities rather than defining children by their circumstances. Each story is shared with care, privacy, and dignity.</p>

            <div className="story-grid">
              {childrenStories.map((child) => (
                <article key={child.name} className="story-card">
                  <div className="story-avatar">{child.name.slice(0, 1)}</div>
                  <div className="story-meta">
                    <span>{child.name}</span>
                    <span>{child.age}</span>
                  </div>
                  <p>{child.story}</p>
                  <div className="story-interest">
                    <strong>Interest</strong>
                    <span>{child.interest}</span>
                  </div>
                  <button type="button" className="text-link">Read Story</button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="programs" className="section">
          <div className="container">
            <div className="section-heading center">
              <span className="eyebrow">What We Provide</span>
              <h2>What We Provide</h2>
            </div>
            <div className="program-grid">
              {programs.map((program) => (
                <article key={program.title} className="program-card">
                  <div className="program-icon" aria-hidden="true">{program.icon}</div>
                  <h3>{program.title}</h3>
                  <p>{program.description}</p>
                  <a href="/about" className="text-link">Learn More</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="impact" className="section impact-section">
          <div className="container">
            <div className="section-heading center light-heading">
              <span className="eyebrow light">Our Impact</span>
              <h2>Together, We Create Change.</h2>
            </div>
            <div className="impact-grid">
              {impactStats.map((stat) => (
                <Counter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
              ))}
            </div>
          </div>
        </section>

        <section className="section story-spotlight">
          <div className="container spotlight-grid">
            <div className="spotlight-image-wrap">
              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80" alt="A child smiling while learning and receiving support" />
            </div>
            <div className="spotlight-copy">
              <span className="eyebrow">Stories of Hope</span>
              <h2>Small Moments. Lasting Change.</h2>
              <p>Every day at The Haven brings small gestures that build confidence, belonging, and opportunity. Through encouragement, learning, and care, children begin to discover what is possible.</p>
              <button type="button" className="button button-primary">Read Full Story</button>
            </div>
          </div>
        </section>

        <section className="section donation-section" id="donate">
          <div className="container donation-grid">
            <div className="donation-panel">
              <span className="eyebrow">Support The Haven</span>
              <h2>Make a gift that helps children feel safe, seen, and supported.</h2>

              <form className="donation-form" onSubmit={handleSubmit}>
                <div className="donation-type-toggle">
                  <label className={form.frequency === 'ONE-TIME' ? 'selected' : ''}>
                    <input type="radio" name="frequency" value="ONE-TIME" checked={form.frequency === 'ONE-TIME'} onChange={handleFieldChange} />
                    One-Time
                  </label>
                  <label className={form.frequency === 'MONTHLY' ? 'selected' : ''}>
                    <input type="radio" name="frequency" value="MONTHLY" checked={form.frequency === 'MONTHLY'} onChange={handleFieldChange} />
                    Monthly
                  </label>
                </div>

                <div className="amount-grid">
                  {['25', '50', '100', '250', '500'].map((amount) => (
                    <button key={amount} type="button" className={form.amount === amount ? 'amount-pill selected' : 'amount-pill'} onClick={() => setForm((current) => ({ ...current, amount }))}>
                      ${amount}
                    </button>
                  ))}
                  <label className="custom-amount">
                    <span>Custom Amount</span>
                    <input name="amount" type="number" min="5" value={form.amount} onChange={handleFieldChange} />
                  </label>
                </div>

                <div className="form-grid two-col">
                  <label>
                    Full Name
                    <input name="name" value={form.name} onChange={handleFieldChange} required />
                  </label>
                  <label>
                    Email Address
                    <input name="email" type="email" value={form.email} onChange={handleFieldChange} required />
                  </label>
                </div>

                <div className="donation-summary compact">
                  <h3>Current Commitment</h3>
                  <div className="summary-row">
                    <span>{formatCurrency(form.amount)}</span>
                    <span>{form.frequency}</span>
                  </div>
                </div>

                {submitStatus && <p className="form-message error">{submitStatus}</p>}
                <button type="submit" className="button button-primary full-width">Proceed To Payment</button>
              </form>
            </div>

            <div className="donation-side">
              <div className="impact-card">
                <h3>Donation Impact</h3>
                {donationImpact.map((impact) => (
                  <div key={impact.amount} className="impact-row">
                    <strong>${impact.amount}</strong>
                    <span>{impact.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section transparency-section">
          <div className="container transparency-grid">
            <div className="transparency-copy">
              <span className="eyebrow">Transparency</span>
              <h2>Your Trust Matters.</h2>
              <p>We believe responsible stewardship is essential to creating lasting trust. Donations are supported by careful oversight, transparent reporting, and clear accountability.</p>
              <div className="reports-list">
                <span>Annual Reports</span>
                <span>Financial Reports</span>
                <span>Impact Reports</span>
                <span>Safeguarding Policies</span>
                <span>Governance Information</span>
              </div>
              <button type="button" className="button button-primary">View Our Reports</button>
            </div>

            <div className="chart-card">
              {transparencyBreakdown.map((item) => (
                <div key={item.label} className="chart-row">
                  <div className="chart-topline">
                    <span>{item.label}</span>
                    <strong>{item.value}%</strong>
                  </div>
                  <div className="progress-track">
                    <span style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="involved" className="section section-soft">
          <div className="container">
            <div className="section-heading center">
              <span className="eyebrow">Get Involved</span>
              <h2>There are many ways to stand with The Haven.</h2>
            </div>
            <div className="involved-grid">
              {[
                { title: 'Donate', text: "Help support The Haven's mission.", cta: 'Give Today' },
                { title: 'Volunteer', text: 'Share your time, skills, and experience.', cta: 'Join Us' },
                { title: 'Partner With Us', text: 'Work with The Haven as an organization or business.', cta: 'Explore Partnership' },
                { title: 'Fundraise', text: 'Help raise awareness and support.', cta: 'Start a Campaign' },
              ].map((item) => (
                <article key={item.title} className="involved-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <button type="button" className="button button-secondary">{item.cta}</button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading center">
              <span className="eyebrow">Supporters</span>
              <h2>Together, We Can Do More.</h2>
            </div>
            <div className="partner-grid">
              {partnerLogos.map((name) => (
                <div key={name} className="partner-logo">{name}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-soft testimonial-section">
          <div className="container">
            <div className="section-heading center">
              <span className="eyebrow">Testimonials</span>
              <h2>Community voices and support.</h2>
            </div>
            <div className="testimonial-card">
              <p className="quote">“{selected.quote}”</p>
              <div className="testimonial-meta">
                <strong>{selected.name}</strong>
                <span>{selected.role}</span>
              </div>
              <div className="testimonial-controls">
                {testimonials.map((item, index) => (
                  <button key={item.name} type="button" className={index === selectedTestimonial ? 'dot active' : 'dot'} aria-label={`Show testimonial ${index + 1}`} onClick={() => setSelectedTestimonial(index)} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading center">
              <span className="eyebrow">Events</span>
              <h2>Community moments to come together.</h2>
            </div>
            <div className="event-grid">
              {events.map((event) => (
                <article key={event.name} className="event-card">
                  <img src={event.image} alt={event.name} />
                  <div className="event-body">
                    <div className="event-meta">
                      <span>{event.date}</span>
                      <span>{event.time}</span>
                    </div>
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                    <div className="event-location"><strong>{event.location}</strong></div>
                    <button type="button" className="button button-secondary full-width">Register</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section faq-section">
          <div className="container faq-grid">
            <div className="faq-copy">
              <span className="eyebrow">FAQ</span>
              <h2>Questions we hear often.</h2>
            </div>
            <div className="faq-list">
              {faqs.map((item, index) => (
                <div key={item.q} className={`faq-item ${activeFaq === index ? 'open' : ''}`}>
                  <button type="button" onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}>
                    <span>{item.q}</span>
                    <span>{activeFaq === index ? '−' : '+'}</span>
                  </button>
                  {activeFaq === index && <p>{item.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section newsletter-section">
          <div className="container newsletter-box">
            <div>
              <span className="eyebrow">Stay Connected</span>
              <h2>Stay Connected With The Haven.</h2>
              <p>Receive updates about our programs, stories, events, and impact.</p>
            </div>
            <form className="newsletter-form">
              <label className="sr-only" htmlFor="newsletter-email">Email Address</label>
              <input id="newsletter-email" type="email" placeholder="Email Address" />
              <button type="submit" className="button button-primary">Subscribe</button>
            </form>
          </div>
        </section>
      </main>

      {chatOpen && chatMeta && (
        <div className="chat-overlay">
          <DonationChat
            commitment={chatCommitment}
            donorName={form.name}
            chatId={chatMeta.id}
            initialMessages={chatMeta.messages}
            onSendMessage={(chatId, text) => onDonorMessage(chatId, text)}
            onClose={() => setChatOpen(false)}
          />
        </div>
      )}
    </>
  )
}

function AboutPage() {
  return (
    <main className="page-shell">
      <section className="page-hero about-hero">
        <div className="container">
          <span className="eyebrow light">About The Haven</span>
          <h1>Safe spaces, care, and opportunity for every child.</h1>
        </div>
      </section>

      <section className="section">
        <div className="container double-copy">
          <div>
            <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80" alt="A caregiver working with children in a warm, safe environment" />
          </div>
          <div>
            <span className="eyebrow">Our Story</span>
            <h2>We nurture possibility with care, dignity, and stability.</h2>
            <p>The Haven was created to meet children where they are—with safety, encouragement, and practical support. We work alongside caregivers, educators, and community partners to create a place where growth feels possible.</p>
            <p>Our model is rooted in listening, dignity, and long-term care. We believe children deserve environments where they can heal, learn, and imagine their future with confidence.</p>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container values-grid">
          {[
            ['Mission', 'Provide safe care, education, healthcare, and opportunities for vulnerable children.'],
            ['Vision', 'A future where every child has the opportunity to grow, thrive, and reach their potential.'],
            ['Values', 'Compassion, integrity, safety, education, dignity, and community.'],
          ].map(([title, desc]) => (
            <article key={title} className="value-card">
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function NewsPage() {
  return (
    <main className="page-shell">
      <section className="page-hero news-hero">
        <div className="container">
          <span className="eyebrow light">News & Stories</span>
          <h1>Updates, impact, and community stories.</h1>
        </div>
      </section>

      <section className="section">
        <div className="container article-grid">
          {newsArticles.map((article) => (
            <article key={article.title} className="article-card">
              <img src={article.image} alt={article.title} />
              <div className="article-body">
                <span>{article.category}</span>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <div className="article-meta">
                  <small>{article.date}</small>
                  <button type="button" className="text-link">Read More</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function ContactPage() {
  return (
    <main className="page-shell">
      <section className="page-hero contact-hero">
        <div className="container">
          <span className="eyebrow light">Contact</span>
          <h1>We'd Love to Hear From You.</h1>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <form className="contact-form">
            <label>
              Full Name
              <input type="text" required />
            </label>
            <label>
              Email
              <input type="email" required />
            </label>
            <label>
              Phone
              <input type="tel" />
            </label>
            <label>
              Subject
              <input type="text" required />
            </label>
            <label>
              Message
              <textarea rows="5" required />
            </label>
            <button type="submit" className="button button-primary">Send Message</button>
          </form>

          <div className="contact-details">
            <div className="info-card">
              <h3>Contact Information</h3>
              <p>Email: {OFFICIAL_EMAIL}</p>
              <p>Phone: +1 (555) 219-8946</p>
              <p>Office: 145 Willow Lane, Portland, OR</p>
              <p>Opening Hours: Mon–Fri, 9:00 AM–5:00 PM</p>
            </div>
            <div className="map-placeholder">
              <span>Map placeholder</span>
              <small>Google Maps or map provider can be connected here.</small>
            </div>
            <div className="social-links">
              <span>Instagram</span>
              <span>Facebook</span>
              <span>X</span>
              <span>LinkedIn</span>
              <span>YouTube</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function AdminPage({ chatQueue, selectedChatId, onSelectChat, onAddReply, onChatAction, adminSession, onLogin, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [adminLogin, setAdminLogin] = useState({ email: '', password: '' })
  const [replyText, setReplyText] = useState('Thank you for your support. We can provide secure payment instructions and confirm the donation details before completion.')

  const filteredChats = chatQueue.filter((chat) => {
    const matchesStatus = statusFilter === 'ALL' || chat.status === statusFilter
    const normalizedQuery = searchTerm.toLowerCase()
    const matchesSearch = !normalizedQuery || [chat.donor, chat.email, chat.status, chat.frequency, String(chat.amount)].join(' ').toLowerCase().includes(normalizedQuery)
    return matchesStatus && matchesSearch
  })

  const selectedChat = filteredChats.find((chat) => chat.id === selectedChatId) || chatQueue.find((chat) => chat.id === selectedChatId) || chatQueue[0]

  const stats = {
    new: chatQueue.filter((chat) => chat.status === 'NEW').length,
    waiting: chatQueue.filter((chat) => chat.status === 'WAITING FOR REPRESENTATIVE').length,
    active: chatQueue.filter((chat) => chat.status === 'IN PROGRESS').length,
    pending: chatQueue.filter((chat) => chat.status === 'PAYMENT PENDING').length,
    completed: chatQueue.filter((chat) => chat.status === 'COMPLETED').length,
    closed: chatQueue.filter((chat) => chat.status === 'CLOSED').length,
  }

  if (!adminSession.loggedIn) {
    return (
      <main className="page-shell admin-login-shell">
        <section className="container admin-login-wrap">
          <div className="admin-login-card">
            <span className="eyebrow">Secure Access</span>
            <h1>Administrator Portal</h1>
            <p>Manage donor conversations, payment coordination, and support requests for The Haven.</p>
            <form
              className="admin-login-form"
              onSubmit={(event) => {
                event.preventDefault()
                onLogin(adminLogin.email, adminLogin.password)
              }}
            >
              <label>
                Administrator Email
                <input type="email" value={adminLogin.email} onChange={(event) => setAdminLogin((current) => ({ ...current, email: event.target.value }))} required />
              </label>
              <label>
                Password
                <input type="password" value={adminLogin.password} onChange={(event) => setAdminLogin((current) => ({ ...current, password: event.target.value }))} required />
              </label>
              <button type="submit" className="button button-primary full-width">Sign In</button>
            </form>
            <div className="login-notice">
              <strong>Official support inbox:</strong> {OFFICIAL_EMAIL}
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <section className="page-hero admin-hero">
        <div className="container">
          <span className="eyebrow light">Administration</span>
          <h1>Customer Support Dashboard</h1>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container admin-grid dashboard-grid">
          {[
            ['New', stats.new],
            ['Waiting', stats.waiting],
            ['Active', stats.active],
            ['Pending', stats.pending],
            ['Completed', stats.completed],
            ['Closed', stats.closed],
          ].map(([label, value]) => (
            <div key={label} className="admin-stat-card">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container dashboard-layout">
          <aside className="queue-panel">
            <div className="queue-header">
              <h3>Incoming Donation Chats</h3>
              <span className="status-badge">{chatQueue.length} Active</span>
            </div>

            <div className="queue-toolbar">
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search donor, email, amount..." />
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="ALL">All statuses</option>
                {['NEW', 'WAITING FOR REPRESENTATIVE', 'IN PROGRESS', 'PAYMENT PENDING', 'COMPLETED', 'CLOSED'].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {filteredChats.length === 0 ? (
              <div className="empty-state">No conversations match this search or filter.</div>
            ) : (
              filteredChats.map((chat) => (
                <button key={chat.id} type="button" className={`queue-item ${selectedChat?.id === chat.id ? 'active' : ''}`} onClick={() => onSelectChat(chat.id)}>
                  <div className="queue-topline">
                    <strong>{chat.donor}</strong>
                    <span>{chat.status}</span>
                  </div>
                  <p>{chat.preview}</p>
                  <div className="queue-meta">
                    <span>{chat.amount > 0 ? formatCurrency(chat.amount) : '$0 USD'}</span>
                    <span>{chat.frequency}</span>
                  </div>
                  <div className="queue-meta subtle-meta">
                    <span>{chat.email}</span>
                    <span>{chat.lastUpdated}</span>
                  </div>
                </button>
              ))
            )}
          </aside>

          {selectedChat ? (
            <div className="rep-chat-panel">
              <div className="rep-chat-header">
                <div>
                  <span className="eyebrow">Donation Conversation</span>
                  <h3>{selectedChat.donor}</h3>
                </div>
                <div className="rep-actions">
                  <span className="status-badge">{selectedChat.status}</span>
                  <button type="button" className="button button-secondary" onClick={onLogout}>Sign Out</button>
                </div>
              </div>

              <div className="commitment-box">
                <span>Donation Commitment</span>
                <strong>{formatCurrency(selectedChat.amount)}</strong>
                <small>{selectedChat.frequency}</small>
              </div>

              <div className="donor-profile-grid">
                <div>
                  <span>Customer</span>
                  <strong>{selectedChat.donor}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{selectedChat.email}</strong>
                </div>
                <div>
                  <span>Phone</span>
                  <strong>{selectedChat.phone}</strong>
                </div>
                <div>
                  <span>Representative</span>
                  <strong>Naomi Martin</strong>
                </div>
              </div>

              <div className="chat-control-strip">
                <button type="button" className="chip-button" onClick={() => onChatAction(selectedChat.id, 'WAITING FOR REPRESENTATIVE')}>Waiting</button>
                <button type="button" className="chip-button" onClick={() => onChatAction(selectedChat.id, 'IN PROGRESS')}>In Progress</button>
                <button type="button" className="chip-button" onClick={() => onChatAction(selectedChat.id, 'PAYMENT PENDING')}>Payment Pending</button>
                <button type="button" className="chip-button" onClick={() => onChatAction(selectedChat.id, 'COMPLETED')}>Completed</button>
                <button type="button" className="chip-button" onClick={() => onChatAction(selectedChat.id, 'CLOSED')}>Closed</button>
              </div>

              <div className="rep-message-list">
                {selectedChat.messages.map((message, index) => (
                  <div key={`${message.sender}-${index}`} className={`rep-message ${message.sender}`}>
                    <p>{message.text}</p>
                    <time>{message.time}</time>
                  </div>
                ))}
              </div>

              <div className="rep-reply-box">
                <textarea value={replyText} onChange={(event) => setReplyText(event.target.value)} rows="4" />
                <div className="reply-actions">
                  <button type="button" className="button button-secondary" onClick={() => onChatAction(selectedChat.id, 'PAYMENT PENDING')}>Request payment details</button>
                  <button type="button" className="button button-secondary" onClick={() => onChatAction(selectedChat.id, 'WAITING FOR REPRESENTATIVE')}>Send secure instructions</button>
                  <button type="button" className="button button-primary" onClick={() => onAddReply(selectedChat.id, replyText)}>Send Response</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rep-chat-panel empty-chat-panel">
              <p>Select a conversation to view donor details and reply.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function DonatePage({ onNewChatStarted, onDonorMessage }) {
  const [form, setForm] = useState({ name: '', email: '', amount: '100', frequency: 'MONTHLY' })
  const [chatOpen, setChatOpen] = useState(false)
  const [chatCommitment, setChatCommitment] = useState({ amount: 100, frequency: 'MONTHLY' })
  const [chatMeta, setChatMeta] = useState(null)
  const [submitStatus, setSubmitStatus] = useState('')

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.email || !form.amount) {
      setSubmitStatus('Please complete the required donation fields.')
      return
    }

    const commitment = { amount: Number(form.amount), frequency: form.frequency }
    const preview = `I’d like to support The Haven with a ${form.frequency.toLowerCase()} donation of ${formatCurrency(Number(form.amount))}.`
    const createdChat = await onNewChatStarted({
      donor: form.name,
      email: form.email,
      phone: '+1 (000) 000-0000',
      amount: Number(form.amount),
      frequency: form.frequency,
      preview,
      message: preview,
    })

    setChatCommitment(commitment)
    setChatMeta(createdChat || {
      id: `CHAT-${Date.now()}`,
      donor: form.name,
      email: form.email,
      phone: '+1 (000) 000-0000',
      status: 'WAITING FOR REPRESENTATIVE',
      amount: Number(form.amount),
      frequency: form.frequency,
      lastUpdated: 'Just now',
      preview,
      messages: [{ sender: 'donor', text: preview, time: 'Now' }],
    })
    setSubmitStatus('')
    setChatOpen(true)
  }

  return (
    <main className="page-shell">
      <section className="page-hero donate-hero">
        <div className="container">
          <span className="eyebrow light">Make a Difference</span>
          <h1>Support children with a gift that feels personal and lasting.</h1>
        </div>
      </section>

      <section className="section donation-section">
        <div className="container donation-grid">
          <div className="donation-panel">
            <span className="eyebrow">Your Commitment</span>
            <h2>Choose a giving level and start a secure conversation with our team.</h2>

            <form className="donation-form" onSubmit={handleSubmit}>
              <div className="donation-type-toggle">
                <label className={form.frequency === 'ONE-TIME' ? 'selected' : ''}>
                  <input type="radio" name="frequency" value="ONE-TIME" checked={form.frequency === 'ONE-TIME'} onChange={handleFieldChange} />
                  One-Time
                </label>
                <label className={form.frequency === 'MONTHLY' ? 'selected' : ''}>
                  <input type="radio" name="frequency" value="MONTHLY" checked={form.frequency === 'MONTHLY'} onChange={handleFieldChange} />
                  Monthly
                </label>
              </div>

              <div className="amount-grid">
                {['25', '50', '100', '250', '500'].map((amount) => (
                  <button key={amount} type="button" className={form.amount === amount ? 'amount-pill selected' : 'amount-pill'} onClick={() => setForm((current) => ({ ...current, amount }))}>
                    ${amount}
                  </button>
                ))}
                <label className="custom-amount">
                  <span>Custom Amount</span>
                  <input name="amount" type="number" min="5" value={form.amount} onChange={handleFieldChange} />
                </label>
              </div>

              <div className="form-grid two-col">
                <label>
                  Full Name
                  <input name="name" value={form.name} onChange={handleFieldChange} required />
                </label>
                <label>
                  Email Address
                  <input name="email" type="email" value={form.email} onChange={handleFieldChange} required />
                </label>
              </div>

              <div className="donation-summary compact">
                <h3>Current Commitment</h3>
                <div className="summary-row">
                  <span>{formatCurrency(form.amount)}</span>
                  <span>{form.frequency}</span>
                </div>
              </div>

              {submitStatus && <p className="form-message error">{submitStatus}</p>}
              <button type="submit" className="button button-primary full-width">Proceed To Payment</button>
            </form>
          </div>

          <div className="donation-side">
            <div className="impact-card">
              <h3>How Your Gift Helps</h3>
              {donationImpact.map((impact) => (
                <div key={impact.amount} className="impact-row">
                  <strong>${impact.amount}</strong>
                  <span>{impact.detail}</span>
                </div>
              ))}
            </div>
            <div className="confirmation-card">
              <h3>Why give to The Haven?</h3>
              <ul>
                <li>• Direct support for children in safe, caring environments.</li>
                <li>• Transparent reporting and careful stewardship.</li>
                <li>• A trusted international nonprofit commitment.</li>
              </ul>
              <button type="button" className="button button-secondary full-width">View Our Impact</button>
            </div>
          </div>
        </div>
      </section>

      {chatOpen && chatMeta && (
        <div className="chat-overlay">
          <DonationChat
            commitment={chatCommitment}
            donorName={form.name}
            chatId={chatMeta.id}
            initialMessages={chatMeta.messages}
            onSendMessage={(chatId, text) => onDonorMessage(chatId, text)}
            onClose={() => setChatOpen(false)}
          />
        </div>
      )}
    </main>
  )
}

function NotFoundPage() {
  return (
    <main className="page-shell error-page">
      <div className="container error-box">
        <span className="eyebrow">404</span>
        <h1>Looks like you've wandered outside The Haven.</h1>
        <NavLink to="/" className="button button-primary">Return Home</NavLink>
      </div>
    </main>
  )
}

function App() {
  const [chatQueue, setChatQueue] = useState(representativeChats)
  const [selectedChatId, setSelectedChatId] = useState(representativeChats[0]?.id || '')
  const [adminSession, setAdminSession] = useState({ loggedIn: false, user: '', token: '' })

  const loadAdminConversations = async (token) => {
    if (!token) return

    try {
      const response = await fetch(`${API_BASE}/api/admin/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Unable to load admin conversations.')
      }

      const payload = await response.json()
      const normalized = (payload.conversations || []).map(normalizeConversation)
      setChatQueue(normalized)
      if (normalized[0]) setSelectedChatId(normalized[0].id)
    } catch (error) {
      console.error('Failed to load admin queue:', error)
    }
  }

  useEffect(() => {
    const cachedSession = localStorage.getItem('the-haven-admin-session')
    if (!cachedSession) return

    try {
      const parsedSession = JSON.parse(cachedSession)
      if (parsedSession.loggedIn && parsedSession.token) {
        setAdminSession(parsedSession)
      }
    } catch (error) {
      console.error('Invalid admin session cache:', error)
    }
  }, [])

  useEffect(() => {
    if (!adminSession.loggedIn || !adminSession.token) return
    localStorage.setItem('the-haven-admin-session', JSON.stringify(adminSession))
    loadAdminConversations(adminSession.token)
  }, [adminSession.loggedIn, adminSession.token])

  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WS_URL || (import.meta.env.DEV ? 'ws://localhost:4001' : 'wss://thehaven.onrender.com'))

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        if (!payload || payload.type !== 'chat:update' || !payload.conversation) return

        const normalized = normalizeConversation(payload.conversation)
        setChatQueue((current) => {
          const next = [...current]
          const index = next.findIndex((chat) => chat.id === normalized.id)
          if (index >= 0) next[index] = normalized
          else next.unshift(normalized)
          return next.sort((left, right) => new Date(right.created_at || 0) - new Date(left.created_at || 0))
        })
      } catch (error) {
        console.error('Socket message error:', error)
      }
    }

    return () => socket.close()
  }, [])

  const handleNewChatStarted = async (newChat) => {
    const payload = {
      customer_name: newChat.donor,
      customer_email: newChat.email,
      customer_phone: newChat.phone || '',
      donation_amount: Number(newChat.amount || 0),
      donation_currency: 'USD',
      donation_frequency: newChat.frequency || 'MONTHLY',
      first_message: newChat.message || newChat.preview || 'I would like to support The Haven.',
    }

    try {
      const response = await fetch(`${API_BASE}/api/chat/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Unable to create conversation.')
      }

      const createdConversation = normalizeConversation(await response.json())
      setChatQueue((current) => [createdConversation, ...current.filter((chat) => chat.id !== createdConversation.id)])
      setSelectedChatId(createdConversation.id)
      return createdConversation
    } catch (error) {
      console.error('Failed to create donor chat:', error)
      return null
    }
  }

  const handleDonorMessage = async (chatId, text) => {
    try {
      const response = await fetch(`${API_BASE}/api/chat/conversations/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_type: 'CUSTOMER',
          sender_id: `customer-${chatId}`,
          message: text,
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to save donor message.')
      }

      const payload = await response.json()
      if (payload?.conversation) {
        const normalized = normalizeConversation(payload.conversation)
        setChatQueue((current) => {
          const next = [...current]
          const index = next.findIndex((chat) => chat.id === normalized.id)
          if (index >= 0) next[index] = normalized
          else next.unshift(normalized)
          return next
        })
      }
    } catch (error) {
      console.error('Failed to send donor message:', error)
    }
  }

  const handleAdminReply = async (chatId, text) => {
    if (!adminSession.token) return

    try {
      const response = await fetch(`${API_BASE}/api/admin/conversations/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSession.token}`,
        },
        body: JSON.stringify({ message: text }),
      })

      if (!response.ok) {
        throw new Error('Unable to send admin response.')
      }

      const payload = await response.json()
      if (payload?.conversation) {
        const normalized = normalizeConversation(payload.conversation)
        setChatQueue((current) => {
          const next = [...current]
          const index = next.findIndex((chat) => chat.id === normalized.id)
          if (index >= 0) next[index] = normalized
          else next.unshift(normalized)
          return next
        })
      }
    } catch (error) {
      console.error('Failed to send admin reply:', error)
    }
  }

  const handleStatusUpdate = async (chatId, nextStatus) => {
    if (!adminSession.token) return

    try {
      const response = await fetch(`${API_BASE}/api/admin/conversations/${chatId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSession.token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      })

      if (!response.ok) {
        throw new Error('Unable to update conversation status.')
      }

      const updatedConversation = normalizeConversation(await response.json())
      setChatQueue((current) => {
        const next = [...current]
        const index = next.findIndex((chat) => chat.id === updatedConversation.id)
        if (index >= 0) next[index] = updatedConversation
        else next.unshift(updatedConversation)
        return next
      })
    } catch (error) {
      console.error('Failed to update chat status:', error)
    }
  }

  const handleLogin = async (email, password) => {
    if (!email || !password) return false

    try {
      const response = await fetch(`${API_BASE}/api/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Invalid administrator credentials.')
      }

      const payload = await response.json()
      const nextSession = { loggedIn: true, user: payload.user, token: payload.token }
      setAdminSession(nextSession)
      localStorage.setItem('the-haven-admin-session', JSON.stringify(nextSession))
      return true
    } catch (error) {
      console.error('Admin login failed:', error)
      setAdminSession({ loggedIn: false, user: '', token: '' })
      localStorage.removeItem('the-haven-admin-session')
      return false
    }
  }

  const handleLogout = () => {
    setAdminSession({ loggedIn: false, user: '', token: '' })
    localStorage.removeItem('the-haven-admin-session')
  }

  return (
    <BrowserRouter>
      <div className="site-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage onNewChatStarted={handleNewChatStarted} onDonorMessage={handleDonorMessage} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/donate" element={<DonatePage onNewChatStarted={handleNewChatStarted} onDonorMessage={handleDonorMessage} />} />
          <Route path="/admin" element={<AdminPage chatQueue={chatQueue} selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} onAddReply={handleAdminReply} onChatAction={handleStatusUpdate} adminSession={adminSession} onLogin={handleLogin} onLogout={handleLogout} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
        <SupportPanel />
      </div>
    </BrowserRouter>
  )
}

export default App

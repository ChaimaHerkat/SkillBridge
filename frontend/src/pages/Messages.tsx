import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import messageService from '../services/messageService'
import type { Message as MsgType } from '../types/message'

const Messages: React.FC = () => {
  const { user } = useAuth()
  const [otherUserId, setOtherUserId] = useState('')
  const [messages, setMessages] = useState<MsgType[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) return <div>Please login to view messages.</div>

  const loadConversation = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await messageService.getConversation(otherUserId)
      setMessages(data)
    } catch (err: any) {
      setError(err?.message || 'Failed to load conversation')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!otherUserId || !text) return
    setError(null)
    try {
      const msg = await messageService.sendMessage(otherUserId, text)
      setMessages(prev => [...prev, msg])
      setText('')
    } catch (err: any) {
      setError(err?.message || 'Send failed')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Messages</h1>

      <div style={{ marginBottom: 12 }}>
        <label>Other user id</label>
        <input value={otherUserId} onChange={e => setOtherUserId(e.target.value)} style={{ marginLeft: 8 }} />
        <button onClick={loadConversation} style={{ marginLeft: 8 }}>Load</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div style={{ border: '1px solid #ddd', padding: 12, minHeight: 200 }}>
        {messages.map(m => (
          <div key={m.id} style={{ marginBottom: 8 }}>
            <strong style={{ display: 'block' }}>{m.senderId === user.id ? 'You' : 'Them'}</strong>
            <div>{m.content}</div>
            <small>{new Date(m.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <textarea value={text} onChange={e => setText(e.target.value)} style={{ width: '100%', minHeight: 80 }} />
        <div style={{ marginTop: 8 }}>
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Messages

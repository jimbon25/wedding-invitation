import React, { useState } from 'react';

const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<{ from: 'user' | 'ai', text: string }[]>([
    { from: 'ai', text: 'Halo! Saya asisten AI undangan pernikahan Dimas & Niken. Silakan tanya apa saja seputar acara, lokasi, RSVP, atau info lain yang ingin kamu ketahui.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });
      const data = await res.json();
      let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiText) {
        aiText = '[Tidak ada jawaban dari Gemini API]\n' + JSON.stringify(data, null, 2);
      }
      setMessages(msgs => [...msgs, { from: 'ai', text: aiText }]);
    } catch {
      setMessages(msgs => [...msgs, { from: 'ai', text: 'Terjadi kesalahan.' }]);
    }
    setInput('');
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 350, minWidth: 260, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.13)', padding: 16, position: 'relative' }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#9CAF88', textAlign: 'center' }}>Tanya Asisten Undangan</h4>
      <div style={{ minHeight: 90, maxHeight: 200, overflowY: 'auto', marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <span style={{
              display: 'inline-block',
              background: msg.from === 'user' ? '#9CAF88' : '#f3f3f3',
              color: msg.from === 'user' ? '#fff' : '#333',
              borderRadius: 8,
              padding: '6px 12px',
              maxWidth: '80%',
              wordBreak: 'break-word',
              fontSize: '0.98em'
            }}>{msg.text}</span>
          </div>
        ))}
        {loading && <div style={{ color: '#888', fontSize: '0.95em' }}>Mengetik...</div>}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Tulis pertanyaan..."
          style={{ flex: 1, borderRadius: 8, border: '1px solid #ccc', padding: 8, fontSize: '0.98em' }}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ borderRadius: 8, padding: '8px 14px', background: '#9CAF88', color: '#fff', border: 'none', fontWeight: 600 }}>
          Kirim
        </button>
      </div>
    </div>
  );
};

export default GeminiChat;

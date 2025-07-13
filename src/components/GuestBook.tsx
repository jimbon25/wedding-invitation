import React, { useState, useEffect } from 'react';
import StoryItem from './StoryItem';

interface GuestbookEntry {
  timestamp: string;
  name: string;
  message: string;
}

const GuestBook: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [nameError, setNameError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchGuestbookEntries = async () => {
    setIsLoadingEntries(true);
    setFetchError(null);
    try {
      const response = await fetch('/.netlify/functions/get-guestbook-entries');
      if (!response.ok) {
        throw new Error('Gagal memuat pesan buku tamu.');
      }
      const data: GuestbookEntry[] = await response.json();
      setGuestbookEntries(data);
    } catch (err) {
      if (err instanceof Error) {
        setFetchError(err.message);
      } else {
        setFetchError('Terjadi kesalahan saat memuat pesan.');
      }
      console.error('Error fetching guestbook entries:', err);
    } finally {
      setIsLoadingEntries(false);
    }
  };

  useEffect(() => {
    fetchGuestbookEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setNameError('');
    setMessageError('');

    let isValid = true;

    if (!name.trim()) {
      setNameError('Nama tidak boleh kosong.');
      isValid = false;
    }

    if (!message.trim()) {
      setMessageError('Pesan tidak boleh kosong.');
      isValid = false;
    }

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    const payload = {
      type: 'guestbook', // Important for the Netlify function to differentiate
      name,
      message,
    };

    try {
      const response = await fetch('/.netlify/functions/send-discord-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setName('');
        setMessage('');
        // Re-fetch entries to show the new message
        await fetchGuestbookEntries();
      } else {
        setSubmitStatus('error');
        console.error('Server Error:', response.status, response.statusText);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Network or other error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <StoryItem><h2>Buku Tamu</h2></StoryItem>
      <StoryItem delay="0.2s"><p>Mohon tinggalkan harapan dan pesan Anda untuk Dimas & Niken!</p></StoryItem>

      <StoryItem delay="0.4s">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="guestName" className="form-label">Nama Anda:</label>
            <input
              type="text"
              className={`form-control ${nameError ? 'is-invalid' : ''}`}
              id="guestName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {nameError && <div className="invalid-feedback">{nameError}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="guestMessage" className="form-label">Pesan Anda:</label>
            <textarea
              className={`form-control ${messageError ? 'is-invalid' : ''}`}
              id="guestMessage"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            {messageError && <div className="invalid-feedback">{messageError}</div>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
          </button>
        </form>
      </StoryItem>

      {submitStatus === 'success' && (
        <StoryItem delay="0.6s">
          <div className="mt-3 alert alert-success">Terima kasih! Pesan Anda telah terkirim.</div>
        </StoryItem>
      )}
      {submitStatus === 'error' && (
        <StoryItem delay="0.6s">
          <div className="mt-3 alert alert-danger">Terjadi kesalahan saat mengirim pesan Anda. Mohon coba lagi.</div>
        </StoryItem>
      )}

      <StoryItem delay="0.8s">
        <div className="mt-5">
          <h4>Pesan dari Sahabat & Keluarga</h4>
          {isLoadingEntries ? (
            <p>Memuat pesan...</p>
          ) : fetchError ? (
            <p className="text-danger">Error: {fetchError}</p>
          ) : guestbookEntries.length === 0 ? (
            <p>Belum ada pesan. Jadilah yang pertama meninggalkan pesan!</p>
          ) : (
            guestbookEntries.map((entry, index) => (
              <div className="card mt-3" key={index}>
                <div className="card-body">
                  <h5 className="card-title">{entry.name}</h5>
                  <p className="card-text">{entry.message}</p>
                  <small className="text-muted">
                    {new Date(entry.timestamp).toLocaleString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </StoryItem>
    </div>
  );
};

export default GuestBook;
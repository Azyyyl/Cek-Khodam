import React, { useState } from 'react';
import './App.css'; // Kita akan membuat file CSS ini

function App() {
  const [nama, setNama] = useState('');
  const [khodamResult, setKhodamResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setKhodamResult(null); // Clear previous result
    setError(null);       // Clear previous error

    if (!nama.trim()) {
      setError('Nama tidak boleh kosong!');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/cek-khodam', { // Pastikan URL ini sesuai dengan port backend Anda
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama: nama }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setKhodamResult(data);
    } catch (err) {
      console.error('Error fetching khodam:', err);
      setError('Terjadi kesalahan saat memeriksa khodam. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔮 Cek Khodam 🔮</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Masukkan nama Anda..."
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Mengecek...' : 'Cek Khodam Anda!'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {khodamResult && (
          <div className="result-card">
            <h2>Hasil Cek Khodam untuk {khodamResult.namaInput}</h2>
            <p>Khodam yang mendampingi Anda adalah: <strong>{khodamResult.nama_khodam}</strong></p>
            <p>Deskripsi: {khodamResult.deskripsi}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
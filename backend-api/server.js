// backend-api/server.js
import express from 'express'; // Ubah require menjadi import
import cors from 'cors';       // Ubah require menjadi import
import fs from 'fs';           // Ubah require menjadi import
import path from 'path';       // Ubah require menjadi import
import { fileURLToPath } from 'url'; // Tambahkan ini untuk mendapatkan __dirname di ES Modules

// Dapatkan __dirname yang setara di ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001; // Port untuk API

app.use(cors());
app.use(express.json());

// Lokasi file khodam.json
const khodamFilePath = path.join(__dirname, 'khodam.json');

// Endpoint untuk cek khodam
app.post('/api/cek-khodam', (req, res) => {
    const { nama } = req.body;

    if (!nama) {
        return res.status(400).json({ error: 'Nama tidak boleh kosong!' });
    }

    fs.readFile(khodamFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading khodam.json:', err);
            return res.status(500).json({ error: 'Gagal memuat data khodam.' });
        }

        try {
            const khodamList = JSON.parse(data);

            if (!Array.isArray(khodamList) || khodamList.length === 0) {
                return res.status(500).json({ error: 'Format data khodam tidak valid atau kosong.' });
            }

            // Simple hash for consistent result based on name
            let hash = 0;
            for (let i = 0; i < nama.length; i++) {
                const char = nama.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash |= 0; // Convert to 32bit integer
            }
            const randomIndex = Math.abs(hash) % khodamList.length;

            const selectedKhodam = khodamList[randomIndex];

            res.json({
                namaInput: nama,
                nama_khodam: selectedKhodam.nama_khodam,
                deskripsi: selectedKhodam.deskripsi
            });

        } catch (parseErr) {
            console.error('Error parsing khodam.json:', parseErr);
            res.status(500).json({ error: 'Gagal memproses data khodam.' });
        }
    });
});

app.listen(port, () => {
    console.log(`Backend API berjalan di http://localhost:${port}`);
});
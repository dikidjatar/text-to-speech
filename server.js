const express = require('express');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const app = express();

// Konfigurasi => ganti dengan punya anda
const projectId = '<PROJECT_ID>';
const keyFilename = 'path/speech-381023-58ff2fd3c51f.json';
const client = new textToSpeech.TextToSpeechClient({ projectId, keyFilename });

// Rute untuk mengonversi teks menjadi suara
app.get('/api/speak', (req, res) => {
    const text = req.query.text;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }
    
    // Opsi suara
    const request = {
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    // Fungsi untuk membuat file audio dari teks
    function synthesizeSpeech(request) {
        client.synthesizeSpeech(request, (err, response) => {
            if (err) {
                console.error('Error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            // Simpan audio ke file
            const fileName = `${Date.now()}.mp3`;
            const filePath = `${__dirname}/${fileName}`;
            fs.writeFile(filePath, response.audioContent, 'binary', err => {
                if (err) {
                    console.error('Error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                return res.json({ url: `http://localhost:3000/${fileName}` });
            });
        });
    }

    // Panggil fungsi untuk membuat audio
    synthesizeSpeech(request);
});

// Serve file audio
app.use(express.static(__dirname));

// Jalankan server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});

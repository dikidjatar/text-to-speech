const textInput = document.querySelector('#text-input');
const speakButton = document.querySelector('#speak-button');
const audioPlayer = document.querySelector('#audio-player');

speakButton.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (text === '') {
        return;
    }

    // Kirim permintaan ke server untuk mengonversi teks menjadi suara
    fetch(`/api/speak?text=${encodeURIComponent(text)}`)
        .then(response => response.json())
        .then(data => {
            // Putar file audio yang dihasilkan oleh server
            audioPlayer.src = data.url;
            audioPlayer.play();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
});

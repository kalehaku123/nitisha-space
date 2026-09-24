// --- Floating Hearts Background ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 20;
        this.size = Math.random() * 12 + 8;
        this.speedY = Math.random() * 1 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.type = Math.random() > 0.5 ? '❤️' : '✨';
    }
    update() {
        this.y -= this.speedY;
        if (this.y < -20) this.reset();
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size}px serif`;
        ctx.fillText(this.type, this.x, this.y);
    }
}

for (let i = 0; i < 25; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// --- Theme Toggle ---
const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
});

// --- Love Burst Confetti ---
document.getElementById('loveBurstBtn').addEventListener('click', () => {
    confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4081', '#ff79b0', '#ffffff']
    });
});

// --- Anniversary Counter (August 15, 2026) ---
const startDateInput = document.getElementById('startDateInput');
let startDate = localStorage.getItem('anniversaryDate') || '2026-08-15';
startDateInput.value = startDate;

startDateInput.addEventListener('change', (e) => {
    startDate = e.target.value;
    localStorage.setItem('anniversaryDate', startDate);
});

function updateCounter() {
    const start = new Date(startDate).getTime();
    const now = new Date().getTime();
    const diff = now - start;

    if (diff < 0) {
        document.getElementById('days').innerText = "00";
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
}
setInterval(updateCounter, 1000);

// --- Custom Animated Music Jukebox ---
const audioPlayer = document.getElementById('audioPlayer');
const vinyl = document.getElementById('vinyl');
const vinylWrapper = document.getElementById('vinylWrapper');
const equalizer = document.getElementById('equalizer');
const currentTrackTitle = document.getElementById('currentTrackTitle');
const currentTrackArtist = document.getElementById('currentTrackArtist');
const playlistContainer = document.getElementById('playlist');
const emptyMsg = document.getElementById('emptyMsg');

// Default 3 Permanent Songs
const defaultPlaylist = [
    { title: 'Song 1', url: 'song1.mp3' },
    { title: 'Song 2', url: 'song2.mp3' },
    { title: 'Song 3', url: 'song3.mp3' }
];

let playlist = JSON.parse(localStorage.getItem('myCustomPlaylist')) || defaultPlaylist;

function renderPlaylist() {
    playlistContainer.innerHTML = '';
    
    if (playlist.length === 0) {
        playlistContainer.appendChild(emptyMsg);
        emptyMsg.style.display = 'block';
        currentTrackTitle.innerText = "No Song Selected";
        currentTrackArtist.innerText = "Select a song to start";
        return;
    }

    emptyMsg.style.display = 'none';

    playlist.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.innerHTML = `
            <span><i class="fa-solid fa-music"></i> ${song.title}</span>
            <i class="fa-solid fa-trash delete-song-btn" title="Remove Song"></i>
        `;
        
        item.querySelector('span').addEventListener('click', () => playTrack(index));
        item.querySelector('.delete-song-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteSong(index);
        });

        playlistContainer.appendChild(item);
    });
}

function playTrack(index) {
    if (!playlist[index]) return;
    audioPlayer.src = playlist[index].url;
    currentTrackTitle.innerText = playlist[index].title;
    currentTrackArtist.innerText = "Playing for Nitisha ❤️";
    
    document.querySelectorAll('.playlist-item').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });

    audioPlayer.play();
}

function deleteSong(index) {
    playlist.splice(index, 1);
    localStorage.setItem('myCustomPlaylist', JSON.stringify(playlist));
    renderPlaylist();
}

document.getElementById('audioFileUpload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const songName = file.name.replace(/\.[^/.]+$/, "");
        const fileURL = URL.createObjectURL(file);
        
        playlist.push({ title: songName, url: fileURL });
        localStorage.setItem('myCustomPlaylist', JSON.stringify(playlist));
        renderPlaylist();
        playTrack(playlist.length - 1);
    }
});

audioPlayer.addEventListener('play', () => {
    vinyl.classList.add('playing');
    vinylWrapper.classList.add('playing');
    equalizer.classList.add('playing');
});

audioPlayer.addEventListener('pause', () => {
    vinyl.classList.remove('playing');
    vinylWrapper.classList.remove('playing');
    equalizer.classList.remove('playing');
});

renderPlaylist();

// --- Interactive Photo Scrapbook Gallery ---
const galleryGrid = document.getElementById('galleryGrid');

// 7 Permanent Photos
const defaultPhotos = [
    { url: 'photo1.jpg', caption: '' },
    { url: 'photo2.jpg', caption: '' },
    { url: 'photo3.jpg', caption: '' },
    { url: 'photo4.jpg', caption: '' },
    { url: 'photo5.jpg', caption: '' },
    { url: 'photo6.jpg', caption: '' },
    { url: 'photo7.jpg', caption: '' }
];

let photos = JSON.parse(localStorage.getItem('nitishaPhotos')) || defaultPhotos;

function renderGallery() {
    galleryGrid.innerHTML = '';
    if (photos.length === 0) {
        galleryGrid.innerHTML = '<p class="empty-msg" style="grid-column: 1/-1;">No photos added yet.</p>';
        return;
    }
    photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'polaroid';
        const captionHTML = photo.caption ? `<p>${photo.caption}</p>` : '';
        item.innerHTML = `
            <button class="delete-photo-btn" onclick="deletePhoto(${index})"><i class="fa-solid fa-xmark"></i></button>
            <img src="${photo.url}" alt="Memory">
            ${captionHTML}
        `;
        galleryGrid.appendChild(item);
    });
}

function deletePhoto(index) {
    photos.splice(index, 1);
    localStorage.setItem('nitishaPhotos', JSON.stringify(photos));
    renderGallery();
}

document.getElementById('imageUpload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const caption = document.getElementById('captionInput').value.trim();
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            photos.unshift({ url: event.target.result, caption: caption });
            localStorage.setItem('nitishaPhotos', JSON.stringify(photos));
            renderGallery();
            document.getElementById('captionInput').value = '';
        };
        reader.readAsDataURL(file);
    }
});
renderGallery();

// --- Secret Vault Passcode (PIN: 1429) ---
const VAULT_PASSCODE = '1429';
const vaultLocked = document.getElementById('vaultLocked');
const vaultUnlocked = document.getElementById('vaultUnlocked');

document.getElementById('unlockVaultBtn').addEventListener('click', () => {
    const pin = document.getElementById('vaultPasscode').value;
    if (pin === VAULT_PASSCODE) {
        vaultLocked.classList.add('hidden');
        vaultUnlocked.classList.remove('hidden');
        renderNotes();
    } else {
        alert('Incorrect passcode!');
        document.getElementById('vaultPasscode').value = '';
    }
});

document.getElementById('lockVaultBtn').addEventListener('click', () => {
    vaultUnlocked.classList.add('hidden');
    vaultLocked.classList.remove('hidden');
    document.getElementById('vaultPasscode').value = '';
});

// Vault Secret Notes
let secretNotes = JSON.parse(localStorage.getItem('vaultNotes')) || [
    "August 15, 2026 - The day our story officially began. I promise to love and cherish you every single day, Nitisha ❤️"
];

function renderNotes() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
    secretNotes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerText = note;
        notesList.appendChild(card);
    });
}

document.getElementById('saveNoteBtn').addEventListener('click', () => {
    const input = document.getElementById('secretNoteInput');
    if (input.value.trim()) {
        secretNotes.unshift(input.value.trim());
        localStorage.setItem('vaultNotes', JSON.stringify(secretNotes));
        renderNotes();
        input.value = '';
    }
});
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
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    });
}

// --- Love Burst Confetti ---
const loveBtn = document.getElementById('loveBurstBtn');
if (loveBtn) {
    loveBtn.addEventListener('click', () => {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff4081', '#ff79b0', '#ffffff']
            });
        }
    });
}

// --- Anniversary Counter (Default: August 15, 2026) ---
const startDateInput = document.getElementById('startDateInput');
let startDate = localStorage.getItem('anniversaryDate') || '2026-08-15';

if (startDateInput) {
    startDateInput.value = startDate;
    startDateInput.addEventListener('change', (e) => {
        if (e.target.value) {
            startDate = e.target.value;
            localStorage.setItem('anniversaryDate', startDate);
            updateCounter();
        }
    });
}

function updateCounter() {
    if (!startDate) return;
    
    const start = new Date(startDate + 'T00:00:00').getTime();
    const now = new Date().getTime();
    const diff = now - start;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!daysEl) return;

    if (diff < 0) {
        // If date is in the future
        const absDiff = Math.abs(diff);
        daysEl.innerText = String(Math.floor(absDiff / (1000 * 60 * 60 * 24))).padStart(2, '0');
        hoursEl.innerText = String(Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        minutesEl.innerText = String(Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        secondsEl.innerText = String(Math.floor((absDiff % (1000 * 60)) / 1000)).padStart(2, '0');
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.innerText = String(days).padStart(2, '0');
    hoursEl.innerText = String(hours).padStart(2, '0');
    minutesEl.innerText = String(minutes).padStart(2, '0');
    secondsEl.innerText = String(seconds).padStart(2, '0');
}

updateCounter();
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

const defaultPlaylist = [
    { title: 'Song 1', url: 'song1.mp3' },
    { title: 'Song 2', url: 'song2.mp3' },
    { title: 'Song 3', url: 'song3.mp3' }
];

let playlist = JSON.parse(localStorage.getItem('myCustomPlaylist'));
if (!playlist || playlist.length === 0) {
    playlist = defaultPlaylist;
}

function renderPlaylist() {
    if (!playlistContainer) return;
    playlistContainer.innerHTML = '';
    
    if (playlist.length === 0) {
        if (emptyMsg) {
            playlistContainer.appendChild(emptyMsg);
            emptyMsg.style.display = 'block';
        }
        if (currentTrackTitle) currentTrackTitle.innerText = "No Song Selected";
        if (currentTrackArtist) currentTrackArtist.innerText = "Select a song to start";
        return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';

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
    if (!playlist[index] || !audioPlayer) return;
    audioPlayer.src = playlist[index].url;
    if (currentTrackTitle) currentTrackTitle.innerText = playlist[index].title;
    if (currentTrackArtist) currentTrackArtist.innerText = "Playing for Nitisha ❤️";
    
    document.querySelectorAll('.playlist-item').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });

    audioPlayer.play().catch(err => console.log("Audio play deferred:", err));
}

function deleteSong(index) {
    playlist.splice(index, 1);
    localStorage.setItem('myCustomPlaylist', JSON.stringify(playlist));
    renderPlaylist();
}

const audioUpload = document.getElementById('audioFileUpload');
if (audioUpload) {
    audioUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const songName = file.name.replace(/\.[^/.]+$/, "");
            const reader = new FileReader();
            reader.onload = function(event) {
                playlist.push({ title: songName, url: event.target.result });
                localStorage.setItem('myCustomPlaylist', JSON.stringify(playlist));
                renderPlaylist();
                playTrack(playlist.length - 1);
            };
            reader.readAsDataURL(file);
        }
    });
}

if (audioPlayer) {
    audioPlayer.addEventListener('play', () => {
        if (vinyl) vinyl.classList.add('playing');
        if (vinylWrapper) vinylWrapper.classList.add('playing');
        if (equalizer) equalizer.classList.add('playing');
    });

    audioPlayer.addEventListener('pause', () => {
        if (vinyl) vinyl.classList.remove('playing');
        if (vinylWrapper) vinylWrapper.classList.remove('playing');
        if (equalizer) equalizer.classList.remove('playing');
    });
}

renderPlaylist();

// --- Interactive Photo Scrapbook Gallery ---
const galleryGrid = document.getElementById('galleryGrid');

const defaultPhotos = [
    { url: 'photo1.jpg', caption: 'Memory 1' },
    { url: 'photo2.jpg', caption: 'Memory 2' },
    { url: 'photo3.jpg', caption: 'Memory 3' },
    { url: 'photo4.jpg', caption: 'Memory 4' },
    { url: 'photo5.jpg', caption: 'Memory 5' },
    { url: 'photo6.jpg', caption: 'Memory 6' },
    { url: 'photo7.jpg', caption: 'Memory 7' }
];

let photos = JSON.parse(localStorage.getItem('nitishaPhotos'));
if (!photos || photos.length === 0) {
    photos = defaultPhotos;
}

function renderGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'polaroid';
        const captionHTML = photo.caption ? `<p>${photo.caption}</p>` : '';
        item.innerHTML = `
            <button class="delete-photo-btn" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>
            <img src="${photo.url}" alt="Memory" onerror="this.src='https://via.placeholder.com/200x160?text=Add+Photo'">
            ${captionHTML}
        `;
        
        item.querySelector('.delete-photo-btn').addEventListener('click', () => deletePhoto(index));
        galleryGrid.appendChild(item);
    });
}

function deletePhoto(index) {
    photos.splice(index, 1);
    localStorage.setItem('nitishaPhotos', JSON.stringify(photos));
    renderGallery();
}

const imageUpload = document.getElementById('imageUpload');
if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const captionInput = document.getElementById('captionInput');
        const caption = captionInput ? captionInput.value.trim() : '';
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                photos.unshift({ url: event.target.result, caption: caption });
                localStorage.setItem('nitishaPhotos', JSON.stringify(photos));
                renderGallery();
                if (captionInput) captionInput.value = '';
            };
            reader.readAsDataURL(file);
        }
    });
}
renderGallery();

// --- Secret Vault Passcode (PIN: 1429) ---
const VAULT_PASSCODE = '1429';
const vaultLocked = document.getElementById('vaultLocked');
const vaultUnlocked = document.getElementById('vaultUnlocked');

const unlockBtn = document.getElementById('unlockVaultBtn');
if (unlockBtn) {
    unlockBtn.addEventListener('click', () => {
        const pinInput = document.getElementById('vaultPasscode');
        if (pinInput && pinInput.value === VAULT_PASSCODE) {
            vaultLocked.classList.add('hidden');
            vaultUnlocked.classList.remove('hidden');
            renderNotes();
        } else {
            alert('Incorrect passcode!');
            if (pinInput) pinInput.value = '';
        }
    });
}

const lockBtn = document.getElementById('lockVaultBtn');
if (lockBtn) {
    lockBtn.addEventListener('click', () => {
        vaultUnlocked.classList.add('hidden');
        vaultLocked.classList.remove('hidden');
        const pinInput = document.getElementById('vaultPasscode');
        if (pinInput) pinInput.value = '';
    });
}

let secretNotes = JSON.parse(localStorage.getItem('vaultNotes')) || [
    "August 15, 2026 - The day our story officially began. I promise to love and cherish you every single day, Nitisha ❤️"
];

function renderNotes() {
    const notesList = document.getElementById('notesList');
    if (!notesList) return;
    notesList.innerHTML = '';
    secretNotes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerText = note;
        notesList.appendChild(card);
    });
}

const saveNoteBtn = document.getElementById('saveNoteBtn');
if (saveNoteBtn) {
    saveNoteBtn.addEventListener('click', () => {
        const input = document.getElementById('secretNoteInput');
        if (input && input.value.trim()) {
            secretNotes.unshift(input.value.trim());
            localStorage.setItem('vaultNotes', JSON.stringify(secretNotes));
            renderNotes();
            input.value = '';
        }
    });
}
// --- Fullscreen Lock Screen Overlay with Blooming Flowers ---
document.body.classList.add('locked');

const bloomingCanvas = document.getElementById('bloomingCanvas');
const bCtx = bloomingCanvas ? bloomingCanvas.getContext('2d') : null;
let bloomFlowers = [];
let bloomAnimFrame = null;
let isUnlocked = false;

function resizeBloomCanvas() {
    if (!bloomingCanvas) return;
    bloomingCanvas.width = window.innerWidth;
    bloomingCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBloomCanvas, { passive: true });
resizeBloomCanvas();

// Blooming Flower Particle Class
class BloomingFlower {
    constructor(x, y) {
        this.x = x || Math.random() * bloomingCanvas.width;
        this.y = y || Math.random() * bloomingCanvas.height;
        this.maxSize = Math.random() * 25 + 15;
        this.currentSize = 0;
        this.growthRate = Math.random() * 0.3 + 0.2;
        this.petals = Math.floor(Math.random() * 3) + 5;
        this.petalColor = ['#ff4081', '#ff79b0', '#ff80ab', '#e91e63', '#f48fb1'][Math.floor(Math.random() * 5)];
        this.centerColor = '#ffd54f';
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.7 + 0.3;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
    }

    update() {
        if (this.currentSize < this.maxSize) {
            this.currentSize += this.growthRate;
            if (this.opacity < this.maxOpacity) {
                this.opacity += 0.02;
            }
        } else {
            this.opacity -= 0.002;
        }

        this.angle += this.rotationSpeed;

        if (this.opacity <= 0) {
            this.reset();
        }
    }

    reset() {
        this.x = Math.random() * bloomingCanvas.width;
        this.y = Math.random() * bloomingCanvas.height;
        this.currentSize = 0;
        this.opacity = 0;
        this.maxSize = Math.random() * 25 + 15;
    }

    draw() {
        if (!bCtx || this.opacity <= 0) return;

        bCtx.save();
        bCtx.translate(this.x, this.y);
        bCtx.rotate(this.angle);
        bCtx.globalAlpha = Math.max(0, this.opacity);

        // Draw Petals
        bCtx.fillStyle = this.petalColor;
        for (let i = 0; i < this.petals; i++) {
            const petalAngle = (i * 2 * Math.PI) / this.petals;
            bCtx.save();
            bCtx.rotate(petalAngle);
            bCtx.beginPath();
            bCtx.ellipse(0, this.currentSize / 1.8, this.currentSize / 3.5, this.currentSize / 1.8, 0, 0, Math.PI * 2);
            bCtx.fill();
            bCtx.restore();
        }

        // Draw Flower Center
        bCtx.fillStyle = this.centerColor;
        bCtx.beginPath();
        bCtx.arc(0, 0, this.currentSize / 4, 0, Math.PI * 2);
        bCtx.fill();

        bCtx.restore();
    }
}

// Generate Blooming Flowers
if (bloomingCanvas) {
    for (let i = 0; i < 25; i++) {
        bloomFlowers.push(new BloomingFlower());
    }
}

let lastTime = 0;
function animateBloom(timestamp) {
    if (isUnlocked) return;

    // Capped frame updates to keep CPU low
    if (timestamp - lastTime > 25) {
        bCtx.clearRect(0, 0, bloomingCanvas.width, bloomingCanvas.height);
        for (let i = 0; i < bloomFlowers.length; i++) {
            bloomFlowers[i].update();
            bloomFlowers[i].draw();
        }
        lastTime = timestamp;
    }
    bloomAnimFrame = requestAnimationFrame(animateBloom);
}

if (bloomingCanvas) {
    bloomAnimFrame = requestAnimationFrame(animateBloom);
}

// Password Unlock Logic
const siteLockScreen = document.getElementById('siteLockScreen');
const sitePasswordInput = document.getElementById('sitePasswordInput');
const unlockSiteBtn = document.getElementById('unlockSiteBtn');
const lockErrorMsg = document.getElementById('lockErrorMsg');

function handleSiteUnlock() {
    const entered = sitePasswordInput.value.trim().toLowerCase();
    if (entered === 'iloveyounitisha' || entered === 'iloveyoushrijan') {
        isUnlocked = true;
        if (bloomAnimFrame) cancelAnimationFrame(bloomAnimFrame); // Instantly stop animation loop to free memory

        siteLockScreen.classList.add('unlocked');
        document.body.classList.remove('locked');

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.5 },
                colors: ['#ff4081', '#ff79b0', '#ffffff', '#ffd54f']
            });
        }
    } else {
        lockErrorMsg.innerText = "Incorrect password! Hint: iloveyou...";
        sitePasswordInput.value = '';
    }
}

if (unlockSiteBtn) unlockSiteBtn.addEventListener('click', handleSiteUnlock);
if (sitePasswordInput) {
    sitePasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSiteUnlock();
    });
}

// --- Background Floating Hearts Canvas ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 20;
        this.size = Math.random() * 10 + 6;
        this.speedY = Math.random() * 0.8 + 0.3;
        this.opacity = Math.random() * 0.4 + 0.2;
    }
    update() {
        this.y -= this.speedY;
        if (this.y < -20) this.reset();
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ff79b0';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

if (canvas) {
    for (let i = 0; i < 15; i++) particles.push(new Particle());
}

let bgLastTime = 0;
function animateParticles(timestamp) {
    if (timestamp - bgLastTime > 33) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        bgLastTime = timestamp;
    }
    requestAnimationFrame(animateParticles);
}
if (canvas) requestAnimationFrame(animateParticles);

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
const loveBurstBtn = document.getElementById('loveBurstBtn');
if (loveBurstBtn) {
    loveBurstBtn.addEventListener('click', () => {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#ff4081', '#ff79b0', '#ffffff']
            });
        }
    });
}

// --- Relationship Counter ---
const startDateInput = document.getElementById('startDateInput');
let startDate = localStorage.getItem('anniversaryDate') || '2026-08-15';
if (startDateInput) {
    startDateInput.value = startDate;
    startDateInput.addEventListener('change', (e) => {
        startDate = e.target.value;
        localStorage.setItem('anniversaryDate', startDate);
    });
}

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

    const dEl = document.getElementById('days');
    if (dEl) {
        dEl.innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    }
}
setInterval(updateCounter, 1000);

// --- Audio Player Jukebox ---
const audioPlayer = document.getElementById('audioPlayer');
const vinyl = document.getElementById('vinyl');
const vinylWrapper = document.getElementById('vinylWrapper');
const equalizer = document.getElementById('equalizer');
const currentTrackTitle = document.getElementById('currentTrackTitle');
const currentTrackArtist = document.getElementById('currentTrackArtist');
const playlistContainer = document.getElementById('playlist');
const emptyMsg = document.getElementById('emptyMsg');

const defaultPlaylist = [
    { title: 'My Love Mine All Mine', url: 'song1.mp3' },
    { title: 'Tum Se Hi', url: 'song2.mp3' },
    { title: 'Treat You Better', url: 'song3.mp3' }
];

let playlist = JSON.parse(localStorage.getItem('myCustomPlaylist')) || defaultPlaylist;

function renderPlaylist() {
    if (!playlistContainer) return;
    playlistContainer.innerHTML = '';
    
    if (playlist.length === 0) {
        if (emptyMsg) playlistContainer.appendChild(emptyMsg);
        return;
    }

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
    audioPlayer.play();
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
            const fileURL = URL.createObjectURL(file);
            playlist.push({ title: songName, url: fileURL });
            localStorage.setItem('myCustomPlaylist', JSON.stringify(playlist));
            renderPlaylist();
            playTrack(playlist.length - 1);
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

// --- Scrapbook Gallery ---
const galleryGrid = document.getElementById('galleryGrid');
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
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'polaroid';
        item.innerHTML = `
            <button class="delete-photo-btn" onclick="deletePhoto(event, ${index})"><i class="fa-solid fa-xmark"></i></button>
            <img src="${photo.url}" alt="Memory" loading="lazy">
            ${photo.caption ? `<p>${photo.caption}</p>` : ''}
        `;
        item.addEventListener('click', () => openPhotoModal(photo.url, photo.caption));
        galleryGrid.appendChild(item);
    });
}

function deletePhoto(event, index) {
    event.stopPropagation();
    photos.splice(index, 1);
    localStorage.setItem('nitishaPhotos', JSON.stringify(photos));
    renderGallery();
}

const imageUpload = document.getElementById('imageUpload');
if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
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
}
renderGallery();

// --- Photo Lightbox Modal ---
const photoModal = document.getElementById('photoModal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.getElementById('modalClose');

function openPhotoModal(url, caption) {
    if (!photoModal) return;
    photoModal.style.display = 'block';
    modalImg.src = url;
    modalCaption.innerText = caption || 'Nitisha & Me ❤️';
}

if (modalClose) {
    modalClose.addEventListener('click', () => { photoModal.style.display = 'none'; });
}
if (photoModal) {
    photoModal.addEventListener('click', (e) => {
        if (e.target === photoModal) photoModal.style.display = 'none';
    });
}

// --- Vault PIN (1429) ---
const VAULT_PASSCODE = '1429';
const vaultLocked = document.getElementById('vaultLocked');
const vaultUnlocked = document.getElementById('vaultUnlocked');
const unlockVaultBtn = document.getElementById('unlockVaultBtn');

if (unlockVaultBtn) {
    unlockVaultBtn.addEventListener('click', () => {
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
}

const lockVaultBtn = document.getElementById('lockVaultBtn');
if (lockVaultBtn) {
    lockVaultBtn.addEventListener('click', () => {
        vaultUnlocked.classList.add('hidden');
        vaultLocked.classList.remove('hidden');
        document.getElementById('vaultPasscode').value = '';
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
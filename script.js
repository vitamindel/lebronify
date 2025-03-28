// Sample song data
const songs = [
    {
        id: 1,
        title: "That's Bron",
        artist: "ilyaugust",
        duration: "3:45",
        cover: "aadit.jpg",
        audio: "thatsbron.mp3"
    },
    {
        id: 2,
        title: "Lebron Hour",
        artist: "ilyaugust",
        duration: "3:30",
        cover: "pannu.png",
        audio: "lebronhour.mp3"
    },
    {
        id: 3,
        title: "LeRansom",
        artist: "fnb.gang8",
        duration: "3:15",
        cover: "panaov.png",
        audio: "leransom.mp3"
    },
    {
        id: 4,
        title: "thinking 'bout lebron",
        artist: "ilyaugust",
        duration: "3:20",
        cover: "soham.png",
        audio: "thinkingaboutlebron.mp3"
    },
    {
        id: 5,
        title: "The Lebron I Used to Know",
        artist: "ilyaugust",
        duration: "3:25",
        cover: "pinnu.png",
        audio: "thatslebronusedtk.mp3"
    },
    {
        id: 6,
        title: "Toward the Bron",
        artist: "ilyaugust",
        duration: "3:30",
        cover: "aishu.jpg",
        audio: "towardthelebron.mp3"
    },
    {
        id: 7,
        title: "Le-Upside Down",
        artist: "atp200520",
        duration: "3:45",
        cover: "pinnu.png",
        audio: "leupsidedown.mp3"
    },
    {
        id: 8,
        title: "No Bron",
        artist: "ilyaugust",
        duration: "0:31",
        cover: "pinnu.png",
        audio: "nobron.mp3"
    },
    {
        id: 9,
        title: "Lebron in 5",
        artist: "ramon angelo",
        duration: "1:03",
        cover: "pinnu.png",
        audio: "lebronin5.mp3"
    },
    {
        id: 10,
        title: "Brontastic",
        artist: "ilyaugust",
        duration: "0:45",
        cover: "pinnu.png",
        audio: "brontastic.mp4"
    },
    {
        id: 11,
        title: "I'd Catch a LeNade for You",
        artist: "ilyaugust",
        duration: "1:00",
        cover: "pinnu.png",
        audio: "lenade.mp3"
    },
    // Add more songs as needed
];

// Audio player functionality
let currentSong = null;
const audioPlayer = new Audio();
let isPlaying = false;

// DOM Elements
const searchInput = document.querySelector('input[type="search"]');
const songCards = document.querySelectorAll('.song-card');
const playButtons = document.querySelectorAll('.play-button');
const playlistCards = document.querySelectorAll('.playlist-card');

// Bottom player elements
const bottomPlayerImage = document.querySelector('.fixed.bottom-0 img');
const bottomPlayerTitle = document.querySelector('.fixed.bottom-0 h4');
const bottomPlayerArtist = document.querySelector('.fixed.bottom-0 p');
const bottomPlayerPlayButton = document.querySelector('.fixed.bottom-0 .bg-lebron-gold');
const bottomPlayerProgress = document.querySelector('.fixed.bottom-0 input[type="range"]');
const bottomPlayerTime = document.querySelector('.fixed.bottom-0 span');

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to elements
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        element.classList.add('opacity-0', 'translate-y-4');
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-4');
                entry.target.classList.add('opacity-100', 'translate-y-0');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // Add hover effect to song cards
    songCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.play-button').classList.remove('opacity-0');
        });
        card.addEventListener('mouseleave', () => {
            card.querySelector('.play-button').classList.add('opacity-0');
        });
    });

    // Initialize search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Initialize audio player events
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', () => {
        isPlaying = false;
        if (currentSong) {
            updatePlayButton(currentSong, false);
        }
        updateBottomPlayer();
    });

    // Initialize play buttons
    songCards.forEach(card => {
        const playButton = card.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const songId = parseInt(card.dataset.songId);
                togglePlay(songId);
            });
        }
    });

    // Initialize bottom player controls
    if (bottomPlayerPlayButton) {
        bottomPlayerPlayButton.addEventListener('click', () => {
            if (currentSong) {
                togglePlay(currentSong);
            }
        });
    }

    // Initialize progress bar
    if (bottomPlayerProgress) {
        bottomPlayerProgress.addEventListener('input', (e) => {
            const time = (e.target.value / 100) * audioPlayer.duration;
            audioPlayer.currentTime = time;
        });
    }

    // Initialize next/previous buttons
    const prevButton = document.querySelector('.fixed.bottom-0 button:first-child');
    const nextButton = document.querySelector('.fixed.bottom-0 button:last-child');
    
    if (prevButton) {
        prevButton.addEventListener('click', playPrevious);
    }
    if (nextButton) {
        nextButton.addEventListener('click', playNext);
    }

    // Initialize mobile menu
    const mobileMenuButton = document.querySelector('button.md\\:hidden');
    const mobileMenu = document.querySelector('.fixed.inset-0.bg-gray-900');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Initialize smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    songCards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const artist = card.querySelector('p').textContent.toLowerCase();
        if (title.includes(searchTerm) || artist.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Play button functionality
function togglePlay(songId) {
    const song = songs.find(s => s.id === songId);
    if (!song) return;

    if (currentSong === songId) {
        if (isPlaying) {
            audioPlayer.pause();
            updatePlayButton(songId, false);
        } else {
            audioPlayer.play().catch(error => {
                console.error('Error playing audio:', error);
            });
            updatePlayButton(songId, true);
        }
        isPlaying = !isPlaying;
    } else {
        if (currentSong) {
            updatePlayButton(currentSong, false);
        }
        currentSong = songId;
        audioPlayer.src = song.audio;
        audioPlayer.play().catch(error => {
            console.error('Error playing audio:', error);
        });
        updatePlayButton(songId, true);
        isPlaying = true;
    }
    updateBottomPlayer();
}

function updatePlayButton(songId, isPlaying) {
    const button = document.querySelector(`[data-song-id="${songId}"] .play-button`);
    if (button) {
        button.innerHTML = isPlaying ? '⏸️' : '▶️';
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add updateBottomPlayer function
function updateBottomPlayer() {
    if (!currentSong) {
        bottomPlayerImage.src = "https://i.scdn.co/image/ab67616d0000b273c5716278a6f2d1d0c877c52";
        bottomPlayerTitle.textContent = "No song playing";
        bottomPlayerArtist.textContent = "Select a song to play";
        bottomPlayerPlayButton.innerHTML = "▶️";
        bottomPlayerProgress.value = 0;
        bottomPlayerTime.textContent = "0:00 / 0:00";
        return;
    }

    const song = songs.find(s => s.id === currentSong);
    if (song) {
        bottomPlayerImage.src = song.cover;
        bottomPlayerTitle.textContent = song.title;
        bottomPlayerArtist.textContent = song.artist;
        bottomPlayerPlayButton.innerHTML = isPlaying ? "⏸️" : "▶️";
    }
}

// Add progress update function
function updateProgress() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    bottomPlayerProgress.value = progress;
    
    const currentTime = formatTime(audioPlayer.currentTime);
    const duration = formatTime(audioPlayer.duration);
    bottomPlayerTime.textContent = `${currentTime} / ${duration}`;
}

// Add time formatting function
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Add next/previous functionality
function playNext() {
    if (currentSong && currentSong < songs.length) {
        togglePlay(currentSong + 1);
    }
}

function playPrevious() {
    if (currentSong && currentSong > 1) {
        togglePlay(currentSong - 1);
    }
}

// Active link highlighting
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`a[href*=${sectionId}]`).classList.add('text-lebron-gold');
        } else {
            document.querySelector(`a[href*=${sectionId}]`).classList.remove('text-lebron-gold');
        }
    });
}); 

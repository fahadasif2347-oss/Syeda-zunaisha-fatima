// ===================================================
// ENVELOPE OPENING ANIMATION
// ===================================================
const inviteScreen = document.getElementById("inviteScreen");
const openInviteButton = document.getElementById("openInvite");

document.body.classList.add("invite-locked");

if (openInviteButton && inviteScreen) {
    openInviteButton.addEventListener("click", function () {
        if (inviteScreen.classList.contains("opening")) return;

        // Opens flap, lifts card and triggers celebratory golden light burst
        inviteScreen.classList.add("opening");

        window.setTimeout(function () {
            inviteScreen.classList.add("opened");
            document.body.classList.remove("invite-locked");

            // Play celebratory background music upon user opening the envelope
            startMusic();

            window.setTimeout(function () {
                inviteScreen.remove();
            }, 1000);
        }, 1700);
    });
}

// ===================================================
// BIRTHDAY COUNTDOWN
// Target: Sunday, 30 October 2026 at 5:00 PM (17:00)
// ===================================================
const birthdayDate = new Date("2026-10-30T17:00:00");

function updateCountdown() {
    const now = new Date().getTime();
    const difference = birthdayDate.getTime() - now;

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");
    const countdownMessage = document.getElementById("countdownMessage");

    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;

    if (difference <= 0) {
        daysElement.textContent = "0";
        hoursElement.textContent = "0";
        minutesElement.textContent = "0";
        secondsElement.textContent = "0";
        if (countdownMessage) {
            countdownMessage.textContent = "🎉 Today is the Grand Birthday Celebration! Welcome to Saqlain House! 🎂";
        }
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    daysElement.textContent = days;
    hoursElement.textContent = hours.toString().padStart(2, "0");
    minutesElement.textContent = minutes.toString().padStart(2, "0");
    secondsElement.textContent = seconds.toString().padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===================================================
// GALLERY LIGHTBOX PREVIEW
// ===================================================
const lightbox = document.getElementById("imageLightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const galleryItems = document.querySelectorAll(".gallery-item");

galleryItems.forEach(function (item) {
    item.addEventListener("click", function () {
        const img = item.querySelector("img");
        if (img && lightbox && lightboxImg) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || "Birthday Photo";
            lightbox.classList.add("active");
            lightbox.setAttribute("aria-hidden", "false");
        }
    });
});

function closeLightbox() {
    if (lightbox) {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        if (lightboxImg) lightboxImg.src = "";
    }
}

if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && lightbox && lightbox.classList.contains("active")) {
        closeLightbox();
    }
});

// ===================================================
// SWEET MUSIC BOX CHIME SYNTHESIZER & AUDIO PLAYER
// Plays sweet, gentle "Happy Birthday" chime melody
// (Works 100% offline, no broken links or external blocks!)
// ===================================================
const music = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicBtn");
let isAudioPlaying = false;
let audioCtx = null;
let melodyInterval = null;

// Note frequencies in Hz
const NOTES = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
    G4: 392.00, A4: 440.00, Bb4: 466.16, C5: 523.25
};

// "Happy Birthday" melody (pitch, duration in ms)
const BIRTHDAY_MELODY = [
    { note: "C4", dur: 350 }, { note: "C4", dur: 250 }, { note: "D4", dur: 600 }, { note: "C4", dur: 600 },
    { note: "F4", dur: 600 }, { note: "E4", dur: 1100 },
    { note: "C4", dur: 350 }, { note: "C4", dur: 250 }, { note: "D4", dur: 600 }, { note: "C4", dur: 600 },
    { note: "G4", dur: 600 }, { note: "F4", dur: 1100 },
    { note: "C4", dur: 350 }, { note: "C4", dur: 250 }, { note: "C5", dur: 600 }, { note: "A4", dur: 600 },
    { note: "F4", dur: 600 }, { note: "E4", dur: 600 }, { note: "D4", dur: 1000 },
    { note: "Bb4", dur: 350 }, { note: "Bb4", dur: 250 }, { note: "A4", dur: 600 }, { note: "F4", dur: 600 },
    { note: "G4", dur: 600 }, { note: "F4", dur: 1300 }
];

function playChime(freq, durationMs) {
    if (!audioCtx || !isAudioPlaying) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Music box / celesta tone combination
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        const now = audioCtx.currentTime;
        const durSec = durationMs / 1000;

        // Soft bell attack and exponential decay
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.2, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + durSec * 1.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + durSec * 1.6);
    } catch (e) {
        // audio context handling
    }
}

let melodyStep = 0;
function playMelodyLoop() {
    if (!isAudioPlaying) return;
    if (melodyStep >= BIRTHDAY_MELODY.length) {
        melodyStep = 0;
        // Pause between loops
        melodyInterval = setTimeout(playMelodyLoop, 2000);
        return;
    }

    const currentNote = BIRTHDAY_MELODY[melodyStep];
    const freq = NOTES[currentNote.note];
    playChime(freq, currentNote.dur);
    melodyStep++;

    melodyInterval = setTimeout(playMelodyLoop, currentNote.dur + 60);
}

function startMusic() {
    // Try HTML5 audio if provided and working
    if (music && music.src && !music.error) {
        const promise = music.play();
        if (promise !== undefined) {
            promise.then(function () {
                isAudioPlaying = true;
                updateMusicBtnState(true);
                return;
            }).catch(function () {
                // If external audio fails (e.g. 403 or offline), fallback seamlessly to music box synth
                startSynthMusic();
            });
            return;
        }
    }
    startSynthMusic();
}

function startSynthMusic() {
    try {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        isAudioPlaying = true;
        updateMusicBtnState(true);
        if (melodyInterval) clearTimeout(melodyInterval);
        melodyStep = 0;
        playMelodyLoop();
    } catch (e) {
        console.log("Audio not supported:", e);
    }
}

function stopMusic() {
    isAudioPlaying = false;
    updateMusicBtnState(false);
    if (melodyInterval) {
        clearTimeout(melodyInterval);
        melodyInterval = null;
    }
    if (music && !music.paused) {
        try { music.pause(); } catch (e) {}
    }
}

function updateMusicBtnState(playing) {
    if (!musicButton) return;
    if (playing) {
        musicButton.textContent = "Ⅱ";
        musicButton.classList.add("playing");
        musicButton.setAttribute("title", "Pause Birthday Melody");
    } else {
        musicButton.textContent = "♫";
        musicButton.classList.remove("playing");
        musicButton.setAttribute("title", "Play Birthday Melody");
    }
}

if (musicButton) {
    musicButton.addEventListener("click", function () {
        if (isAudioPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    });
}

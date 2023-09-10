const image = document.getElementById('cover')
const toppanel = document.getElementById('top-panel');
const playpauseBtn = document.getElementById('play')
const nextbtn = document.getElementById('next')
const prevbtn = document.getElementById('prev')

const title = document.getElementById('song-title')
const artist = document.getElementById('song-artist')

var progress = document.getElementById('progress'); 
const currentTimeElement = document.getElementById('current-time');
const durationElement = document.getElementById('song-duration');

const music = new Audio();

//create audio context
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();

const audioSrc = audioContext.createMediaElementSource(music);
audioSrc.connect(analyser);
analyser.connect(audioContext.destination);

const frequencyData = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(frequencyData);
console.log("frequency data", frequencyData);

const visualiserContainer = document.querySelector(".visualiser-container");
const containerWidth = visualiserContainer.offsetWidth;

const barwidth = 5;
const numofBars = Math.floor(containerWidth/barwidth);

for (let i = 0 ; i < 139; i++) {

    const bar = document.createElement("DIV");
    bar.setAttribute("id", "bar" + i)
    bar.setAttribute("class", "visualiserbar")
    visualiserContainer.appendChild(bar);
}

//adjust bar height according to frequency data
function renderFrame() {
    //update freq data array 
    analyser.getByteFrequencyData(frequencyData);

    for (let i = 0 ; i < 139; i++) {

        const fd = frequencyData[i];

        //fetch bar
        const bar = document.querySelector("#bar" + i)
        if (!bar) {
            continue 
        }

        const barHeight = Math.max(0, fd || 0);
        bar.style.height = barHeight + "px" 
    }
    window.requestAnimationFrame(renderFrame)
}

renderFrame();

// setInterval(function() {
//     console.log("tick");
//     renderFrame();
// }, 1000)

const songs = [
    {
        path: 'media/gurenge.mp3',
        displayName: 'Gurenge', 
        cover: 'media/nezuko.jpg',
        artist: 'Lisa',
        bckground: 'url(media/nezuko.jpg)'
    },

    {
        path: 'media/bluebird.mp3',
        displayName: 'Blue Bird', 
        cover: 'media/naruto.jpg',
        artist: 'Naruto',
        bckground: 'url(media/bluebird.mp3)'
    } 
];

let musicIndex = 0;
let isPlaying = false; 

function togglePlay() {
    if(isPlaying){
        pauseMusic();
    }else {
        playMusic();
    }
}

function playMusic() {
   isPlaying = true;
    playpauseBtn.classList.replace('fa-play', 'fa-pause');
    music.play();
}

function pauseMusic() {
    isPlaying = false;
    playpauseBtn.classList.replace('fa-pause', 'fa-play');
    music.pause();
}

music.addEventListener('timeupdate', function() {
    var position = music.currentTime / music.duration;
    progress.value = position * 100;
    
})


function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    toppanel.style.backgroundImage = song.bckground;
    console.log("frequency data", frequencyData);
}

function updateProgress() {
    const {duration, currentTime} = music;
    const progresspercent = (currentTime/duration) * 100;
    progresspercent.style.width = `${progresspercent}%`
    const formatTime = (time) => String 
}

function updateTime() {
    const duration = formatTime(music.duration);
    const currentTime = formatTime(music.currentTime);
  
    // Update the text content of the elements
    durationElement.textContent = duration;
    currentTimeElement.textContent = currentTime;
  }

function formatTime(timeInSecs) {
    const mins = Math.floor(timeInSecs / 60);
    const seconds = Math.floor(timeInSecs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

music.addEventListener('timeupdate', updateTime);

nextbtn.addEventListener('click', function() {
    musicIndex = (musicIndex + 1) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
})

prevbtn.addEventListener('click', function() {
    musicIndex = (musicIndex - 1) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
})

playpauseBtn.addEventListener('click', togglePlay);

loadMusic(songs[musicIndex]);



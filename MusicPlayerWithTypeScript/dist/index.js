"use strict";
let songImage = document.querySelector("#songImage");
let songName = document.querySelector(".songName");
let artistName = document.querySelector(".artistName");
let songField = document.querySelector("#songField");
let current = 0;
let totalSongs = 0;
let playPaused = document.querySelector("#playPaused");
let startTime = document.getElementById("currentTime");
let endTime = document.getElementById("endTime");
let startMinute;
let startSecond;
let endMinute;
let endSecond;
let volumeSlider = document.getElementById("audioSlider");
let songList = document.querySelector(".songDiv");
let audioSlider = document.getElementById("myRange");
console.log(audioSlider);
function checkSongStatus() {
    let songPaused = songField.paused;
    if (songPaused == true) {
        playPaused.src = "../images/pause-button.png";
    }
    else {
        playPaused.src = "../images/play-button-arrowhead.png";
    }
}
function playPause() {
    let songPaused = songField.paused;
    if (songPaused == true) {
        songField.play();
        playPaused.src = "../images/pause-button.png";
    }
    else {
        songField.pause();
        playPaused.src = "../images/play-button-arrowhead.png";
    }
}
function nextSong() {
    checkSongStatus();
    current += 1;
    if (current > totalSongs - 1) {
        current %= totalSongs;
    }
    allSongs(current);
}
function previousSong() {
    checkSongStatus();
    current -= 1;
    if (current < 0) {
        current = totalSongs - 1;
    }
    allSongs(current);
}
function onEnded() {
    songField.addEventListener("ended", function () {
        console.log("Ended");
        nextSong();
    });
}
function playingSong(current, data) {
    songImage.src = data[current].songBgImage;
    songName.innerHTML = data[current].songName;
    artistName.innerHTML = data[current].artistName;
    songField.src = data[current].songSrc;
    songField.autoplay = true;
    checkSongStatus();
}
function allSongsList(data) {
    var lengthOfArr = data.length;
    totalSongs = lengthOfArr;
    for (const key in data) {
        var newSongs = document.createElement("div");
        var newImageDiv = document.createElement("div");
        var newSongInfoDiv = document.createElement("div");
        var newImage = document.createElement("img");
        var newSongName = document.createElement("div");
        var newSongArtistName = document.createElement("div");
        newSongs.className = "songList";
        newSongInfoDiv.className = "songListInfo";
        newSongs.onclick = function () {
            playSelectedSong(data[key].id, data);
        };
        newImage.src = `${data[key].songBgImage}`;
        newSongName.innerHTML = `${data[key].songName}`;
        newSongArtistName.innerHTML = `${data[key].artistName}`;
        newImageDiv.appendChild(newImage);
        newSongInfoDiv.appendChild(newSongName);
        newSongInfoDiv.appendChild(newSongArtistName);
        newSongs.appendChild(newImageDiv);
        newSongs.appendChild(newSongInfoDiv);
        songList.appendChild(newSongs);
    }
}
function playSelectedSong(id, data) {
    current = id - 1;
    playingSong(current, data);
}
function updateSongSlider() {
    var c = Math.round(songField.currentTime);
    audioSlider.value = c;
    var d = songField.duration;
    audioSlider.setAttribute("max", d);
    startMinute = Math.floor(songField.currentTime / 60);
    startSecond = Math.floor(songField.currentTime - startMinute * 60);
    startTime.innerHTML = `${startMinute}:${startSecond}`;
    endMinute = Math.floor(songField.duration / 60);
    endSecond = Math.floor(songField.duration - endMinute * 60);
    endTime.innerHTML = `${endMinute}:${endSecond}`;
}
function seek() {
    songField.currentTime = audioSlider.value;
}
volumeSlider.oninput = function () {
    songField.volume = +volumeSlider.value / 100;
};
let volumeDown = () => {
    let volumeSlider = document.getElementById("audioSlider");
    console.log("VolumeDown");
    volumeSlider.value -= 10;
    songField.volume = +volumeSlider.value / 100;
};
let volumeUp = () => {
    let volumeSlider = document.getElementById("audioSlider");
    console.log("VolumeUp");
    volumeSlider.value = (Number(volumeSlider.value) + Number(10));
    songField.volume = +volumeSlider.value / 100;
    console.log(songField.volume);
};
let allSongs = (current) => fetch("./musicFiles.json")
    .then((res) => {
    return res.json();
})
    .then((data) => {
    playingSong(current, data);
});
fetch("./musicFiles.json")
    .then((res) => {
    return res.json();
})
    .then((data) => {
    console.log(data);
    playingSong(current, data);
    allSongsList(data);
    setInterval(updateSongSlider, 1000);
    checkSongStatus();
    onEnded();
});

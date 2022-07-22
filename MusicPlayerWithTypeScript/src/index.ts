let songImage = document.querySelector("#songImage") as HTMLImageElement;
let songName = document.querySelector(".songName") as HTMLDivElement;
let artistName = document.querySelector(".artistName") as HTMLDivElement;
let songField = document.querySelector("#songField") as HTMLAudioElement;
let current = 0;
let totalSongs: number = 0;
let playPaused = document.querySelector("#playPaused") as HTMLImageElement;
// console.log(typeof(playPaused));
let startTime = document.getElementById("currentTime") as HTMLParagraphElement;
let endTime = document.getElementById("endTime") as HTMLParagraphElement;
let startMinute;
let startSecond;
let endMinute;
let endSecond;
let volumeSlider = document.getElementById("audioSlider") as HTMLInputElement;

let songList = document.querySelector(".songDiv") as HTMLDivElement;

let audioSlider = document.getElementById("myRange") as HTMLInputElement as any;
console.log(audioSlider);

function checkSongStatus(): void {
    let songPaused = songField.paused;
    if (songPaused == true) {
        playPaused.src = "../images/pause-button.png";
    } else {
        playPaused.src = "../images/play-button-arrowhead.png";
    }
}

function playPause(): void {
    let songPaused = songField.paused;

    if (songPaused == true) {
        songField.play();
        playPaused.src = "../images/pause-button.png";
    } else {
        songField.pause();
        playPaused.src = "../images/play-button-arrowhead.png";
    }
}

function nextSong(): void {
    checkSongStatus();
    current += 1;

    if (current > totalSongs - 1) {
        current %= totalSongs;
    }
    allSongs(current);
}

function previousSong(): void {
    checkSongStatus();
    current -= 1;

    if (current < 0) {
        current = totalSongs - 1;
    }
    allSongs(current);
}

function onEnded(): void {
    songField.addEventListener("ended", function () {
        console.log("Ended");
        nextSong();
    });
}

function playingSong(current: number, data: any): void {
    // let songPaused = songField.paused;
    songImage.src = data[current].songBgImage;
    songName.innerHTML = data[current].songName;
    artistName.innerHTML = data[current].artistName;
    songField.src = data[current].songSrc;
    songField.autoplay = true;

    checkSongStatus();
}

function allSongsList(data: any): void {
    var lengthOfArr = data.length;
    totalSongs = lengthOfArr;
    for (const key in data) {
        var newSongs = document.createElement("div") as HTMLDivElement;
        var newImageDiv = document.createElement("div") as HTMLDivElement;
        var newSongInfoDiv = document.createElement("div") as HTMLDivElement;
        var newImage = document.createElement("img") as HTMLImageElement;
        var newSongName = document.createElement("div") as HTMLDivElement;
        var newSongArtistName = document.createElement("div") as HTMLDivElement;
        newSongs.className = "songList";
        newSongInfoDiv.className = "songListInfo";

        newSongs.onclick = function () {
            // console.log(data[key]);
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

function playSelectedSong(id: number, data: any): void {
    // console.log(id);
    current = id - 1;
    // console.log(current);
    playingSong(current, data);
}

function updateSongSlider(): void {
    var c: number = Math.round(songField.currentTime);
    audioSlider.value = c;

    var d: any = songField.duration;
    // console.log(d);
    audioSlider.setAttribute("max", d);
    // startTime.innerHTML = Math.round(songField.currentTime);
    startMinute = Math.floor(songField.currentTime / 60);
    startSecond = Math.floor(songField.currentTime - startMinute * 60);
    startTime.innerHTML = `${startMinute}:${startSecond}`;
    endMinute = Math.floor(songField.duration / 60);
    endSecond = Math.floor(songField.duration - endMinute * 60);
    endTime.innerHTML = `${endMinute}:${endSecond}`;
}

function seek(): void {
    songField.currentTime = audioSlider.value;
    // songField.play();
}

// volumeSlider.min = 0;
// volumeSlider.max = 100
volumeSlider.oninput = function (): void {
    songField.volume = +volumeSlider.value / 100;
};

let volumeDown = (): void => {
    let volumeSlider = document.getElementById(
        "audioSlider"
    ) as HTMLInputElement as any;
    console.log("VolumeDown");
    volumeSlider.value -= 10;
    songField.volume = +volumeSlider.value / 100;
};

let volumeUp = (): void => {
    // debugger;
    let volumeSlider = document.getElementById(
        "audioSlider"
    ) as HTMLInputElement;
    console.log("VolumeUp");
    volumeSlider.value = (Number(volumeSlider.value) + Number(10)) as any;
    songField.volume = +volumeSlider.value / 100;

    console.log(songField.volume);
};

let allSongs = (current: number) =>
    fetch("./musicFiles.json")
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
        // updateSongSlider()
    });

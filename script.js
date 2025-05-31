let currentSong = new Audio();
let songs;
let currentfolder;

const artistMappings = {
  "/songs/thai": {
    "%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89%E0%B8%84%E0%B8%B7%E0%B8%AD%E0%B8%9E%E0%B8%A3%E0%B8%B8%E0%B9%88%E0%B8%87%E0%B8%99%E0%B8%B5%E0%B9%89%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%A7%E0%B8%B2%E0%B8%99%20(Loop).mp3":
      "Jeff Satur",
    "%E0%B8%95%E0%B8%81%E0%B8%A5%E0%B8%87%E0%B8%89%E0%B8%B1%E0%B8%99%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B9%84%E0%B8%9B%E0%B9%80%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%8A%E0%B9%88%E0%B9%84%E0%B8%AB%E0%B8%A1.mp3":
      "Bright Vachirawit",
  },
  "/songs/punjabi": {
    "Bijlee%20Bijlee.mp3": "Harrdy Sandhu",
    "Love%20Ya.mp3": "Diljit Dosanjh",
    "Sheesha.mp3": "Karan Aujla",
    "Wavy.mp3": "Karan Aujla",
  },
  "/songs/japanese": {
    "Shinunoga%20E-Wa.mp3": "Fuji Kaze",
    "Workin'%20Hard.mp3": "Fuji Kaze",
    "%E7%8C%BF%E8%8A%9D%E5%B1%85.mp3": "natori",
    "Like%20an%20Idiot.mp3": "kakizaki yuta",
  },
  "/songs/hindi": {
    "Jaadugari.mp3": "Maahi",
    "Aaj%20Ki%20Raat.mp3":
      "Sachin-Jigar, Madhubanti Bagchi, Divya Kumar, Amitabh Bhattacharya",
  },
  "/songs/english": {
    "Sugarcrash.mp3": "ElyOtto",
    "Until%20i%20found%20you.mp3": "Stephen Sanchez",
  },
};

async function getSongs(folder) {
  currentfolder = folder;
  let res = await fetch(`${folder}/info.json`);
  let data = await res.json();
  return data.songs.map((s) => s.name);
}

const playMusic = (track, pause = false) => {
  currentSong.src = `${currentfolder}/` + track; // Remove the leading slash
  if (!pause) {
    currentSong.play();
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  //display albums dynamically
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchor = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");

  let array = Array.from(anchor);

  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs") && !e.href.endsWith("/songs")) {
      let folder = e.href.split("/").slice(-1);
      //Get the metadata of the folder

      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML += `<div data-folder="${folder}" class="card padding">
                            <img class="one" src="/songs/${folder}/cover.jpeg"
                                alt="Love ya by Diljit dosanjh">
                            <h3>${response.title}</h3>
                            <p>${response.description}</p>
                            <div class="play-button play-button-one">
                                <svg id='Play_24' width='24' height='24' viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
                                    <rect width='24' height='24' stroke='none' fill='#000000' opacity='0' />
                                    <g transform="matrix(0.83 0 0 0.83 12 12)">
                                        <path
                                            style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                            transform="translate(-16, -15)"
                                            d="M 6 3 C 5.447715250169207 3 5 3.4477152501692068 5 4 C 4.999997456931168 4.001302065424949 4.999997456931168 4.002604134575051 5 4.0039062 L 5 15 L 5 25.996094 C 4.999997457191576 25.99739599875847 4.999997457191576 25.99869800124153 5 26 C 5 26.552284749830793 5.447715250169207 27 6 27 C 6.208161653190648 26.99939863788814 6.41094691965285 26.933851882267366 6.5800781 26.8125 L 6.5820312 26.814453 L 26.416016 15.908203 C 26.77143390778624 15.745605470016656 26.99954873081957 15.390844780300261 27 15 C 27.000200642803566 14.597717889238558 26.759325224181982 14.234480761965193 26.388672 14.078125 L 6.5820312 3.1855469 L 6.5800781 3.1855469 C 6.4107140540402305 3.0648892444540654 6.207948188055822 3.0000314643392456 5.999999999999999 3 z"
                                            stroke-linecap="round" />
                                    </g>
                                </svg>
                            </div>

                        </div>`;
    }
  }

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      // Get the folder from the clicked card
      const folder = `/songs/${item.currentTarget.dataset.folder}`;

      // Fetch the new songs
      songs = await getSongs(folder);

      // Update the song list UI
      let songUL = document
        .querySelector(".songList")
        .getElementsByTagName("ul")[0];
      songUL.innerHTML = "";
      const currentArtistMapping = artistMappings[folder] || {};
      for (const song of songs) {
        const artistName = currentArtistMapping[song] || "Unknown Artist";
        songUL.innerHTML += ` <li>
                    <img class="invert" src="music.svg" alt="">
                    <div class="info">
                        <div style="font-size: 18px;">${decodeURI(song)}</div>
                        <div style="font-size: 12px; margin-top: 5px;">${artistName}</div>
                    </div>
                    <div class="playnow flex justify-content items-center" 
                        style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <span style="display: grid; place-items: center;">Play Now</span>
                        <img class="invert" src="playbutton2.svg" alt="">
                    </div></li>`;
      }

      // Rebind event listeners for each song
      Array.from(
        document.querySelector(".songList").getElementsByTagName("li")
      ).forEach((li, index) => {
        li.addEventListener("click", () => {
          playMusic(songs[index].trim());
          now.src = "pause.svg";
        });
      });
    });
  });
}

async function main() {
  songs = await getSongs(`/songs/punjabi`);
  console.log(songs);

  displayAlbums();

  //Attach an event listener to play, next and previous
  now.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();

      now.src = "pause.svg";
    } else {
      currentSong.pause();
      now.src = "playbutton.svg";
    }
  });

  //listen for timupdate event
  let previousFormattedTime = "0:00 / 0:00";

  currentSong.addEventListener("timeupdate", () => {
    const currentTime = Math.floor(currentSong.currentTime);
    const duration = Math.floor(currentSong.duration);

    if (isNaN(duration)) {
      document.querySelector(".songtime").innerHTML = previousFormattedTime;
      return;
    }

    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = currentTime % 60;

    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = duration % 60;

    const formattedCurrentTime = `${currentMinutes}:${currentSeconds
      .toString()
      .padStart(2, "0")}`;
    const formattedDuration = `${durationMinutes}:${durationSeconds
      .toString()
      .padStart(2, "0")}`;

    previousFormattedTime = `${formattedCurrentTime} / ${formattedDuration}`;
    document.querySelector(".songtime").innerHTML = previousFormattedTime;

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an event listener to seekbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percentage + "%";
    currentSong.currentTime = (currentSong.duration * percentage) / 100;
  });

  //add event listener to hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".hamburger").style.opacity = "0";
  });

  //add event listener for close button
  document.querySelector(".back").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-1000px";
    document.querySelector(".hamburger").style.opacity = "1";
  });

  //event listener to prev
  prev.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  //event listener to next
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //event listener to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  //Load the playlist whenever card is clicked

  //to mute the song
  document.querySelector(".volume > img").addEventListener("click", (e) => {
    if (e.target.src.includes("vol.svg")) {
      e.target.src = e.target.src.replace("vol.svg", "mute.svg");
      currentSong.volume = 0;
      let bar = (document.querySelector(".range > #soundbar").value = 0);
    } else {
      e.target.src = e.target.src.replace("mute.svg", "vol.svg");
      currentSong.volume = 0.1;
      let bar = (document.querySelector(".range > #soundbar").value = 10);
    }
  });
}

main();

//Elements
let fillbar = document.querySelector('.fill');
let audios = ['Modeling - AShamaluevMusic.mp3','Motion - AShamaluevMusic.mp3','Summer Trip - AShamaluevMusic.mp3'];
let covers = ['Album_Art.jpg','Album_Art2.jpg','Album_Art3.jpg'];
let currentTime = document.querySelector(".time .CurrTime");
let totalTime = document.querySelector(".time .FullTime");
let audioplayer = document.getElementById("musicplayer");
let volumeUp = document.querySelector(".volumeup");
let img = document.querySelector('.img img');
let slider = document.getElementById("volume1");
let volumeUpIcon = document.querySelector(".volumeup i");
let repeatIcon = document.querySelector(".repeatbtn i");
let shuffleIcon = document.querySelector(".randombtn i");
let songtitle = document.querySelector(".title h1");
let artist = document.querySelector(".title p");
let menu = document.querySelector(".menu");
let sidemenu = document.getElementById("mySidenav");

//Audio Object
let audio = new Audio();

//Audio level when window loads
audio.volume = 0.5;

//Audio Variables
let currentSong = 0;
let time = 0;
let repeatSong = 0;
let shuffleSong = 0;
let totalTiming = 0;
let soundlevel = 0;

//Fill menu
audios.forEach((element,i) => {
    var newListItem = document.createElement('li');
    newListItem.setAttribute("class", "songs");
    newListItem.innerHTML = element.substr(0,element.indexOf(" -"));
    //Play the selected song
    newListItem.addEventListener("click", function() {
        audio.src = element;
        audio.play();
        //Close Menu after selection
        sidemenu.style.width = "0";
        //Change Artist and Song Name
        let ArtistStartName = element.indexOf(".")-element.indexOf("-") - 2
        songtitle.innerHTML = element.substr(0,element.indexOf(" -"));
        artist.innerHTML = (element.substr(element.indexOf("-") + 2
        ,ArtistStartName));
        let playBtn = document.querySelector('.play-pause');
        playBtn.innerHTML = '<i class="fa fa-pause"></i>';
        audio.currentTime = 0;
        //Change covers
        img.setAttribute('src', covers[i]);
    });
    menu.appendChild(newListItem);
});

//Load Song Title and Artist on Page Load
let ArtistStartName = audios[currentSong].indexOf(".")-audios[currentSong].indexOf("-") - 2
songtitle.innerHTML = audios[currentSong].substr(0,audios[currentSong].indexOf("-"));
artist.innerHTML = (audios[currentSong].substr(audios[currentSong].indexOf("-") + 2
,ArtistStartName));

//Get Random Track Number
function getRandomTrackNumber() {
    return Math.floor(Math.random() * (2 - 0 + 1)) + 0;
}

//Repeat song
function repeatAudio(){
    if(repeatSong === 0){
        audio.loop = true;
        repeatIcon.classList.add("repeatShuffle_btnactive");
        repeatSong = 1;
    }
    else{
        audio.loop = false;
        repeatIcon.classList.remove("repeatShuffle_btnactive");
        repeatSong = 0;
    }
}

//Shuffle through songs
function shuffleSongs(){
    if(shuffleSong === 0){
        shuffleIcon.classList.add("repeatShuffle_btnactive");
        shuffleSong = 1;
    }
    else{
        shuffleIcon.classList.remove("repeatShuffle_btnactive");
        shuffleSong = 0;
    }
}

//Change Album Cover and Artist
function ChangeAlbumAndArtists(){
    let ArtistStartName = (audios[currentSong].indexOf(".") - audios[currentSong].indexOf("-") - 2);
    songtitle.innerHTML = audios[currentSong].substr(0,audios[currentSong].indexOf("-"));
    artist.innerHTML = (audios[currentSong].substr(audios[currentSong].indexOf("-") + 2,ArtistStartName));
}

//Set the song and play it
function playSong(time){
    if(audio.src === "" || audio.src === audios[currentSong]){
        audio.src = audios[currentSong];
        audio.play();
    }
    //Reset Time Line Aka Fillbar
    else if(time !== undefined){ 
        audio.currentTime = time;
        fillbar.value = 0;
        audio.src = audios[currentSong];
        audio.play();
    }
    else{
        audio.play();
    }
}

//On Play/Pause Button toggle
function togglePlayPause(){
    if(audio.paused){
        playSong();
        let playBtn = document.querySelector('.play-pause');
        playBtn.innerHTML = '<i class="fa fa-pause"></i>';
        audio.currentTime = time;
    }
    else{
        audio.pause();
        let playBtn = document.querySelector('.play-pause');
        playBtn.innerHTML = '<i class="fa fa-play"></i>';
        time = audio.currentTime;
    }
}

function TotalTime(seconds){
    //Calculate total time only on Song change
    if(totalTiming !== seconds && isNaN(seconds) === false)
    {
        let min = Math.floor(seconds / 60);
        sec = seconds % 60;

        //Single digits formatting
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        totalTime.textContent = min + ":" + sec;
        totalTiming = seconds;
    }
}
 
function convertTime(seconds){
    let min = Math.floor(seconds/60);
    let sec = seconds % 60;

    //Single digits formatting
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    currentTime.textContent = min + ":" + sec;

    //Calulate total Time as well
    TotalTime(Math.round(audio.duration));
};

//Dynamic Fillbar
audio.addEventListener('timeupdate',function(){
    let position = (audio.currentTime / audio.duration) * 100;
    if(isNaN(position) === false)
    {
        position = Math.round(position);
        fillbar.style.background = 'linear-gradient(90deg, #289cff ' + position + '%, #fff ' + position + '%)';
        fillbar.value = position;

        //Duration
        convertTime(Math.round(audio.currentTime));
    }
    //Get Next song when the Current song has ended with or without shuffle
    if(audio.ended){
        nextAudio();
    }
    else if(audio.ended && shuffleSong === 1){
        let random_num = getRandomTrackNumber();
        audio.src = audios[random_num];
        audio.play();
    }
});

//OnChange Dynamic Fillbar
fillbar.addEventListener("mouseup",function(){
    //Size of an element and its position relative to the viewport
    var szAndpos = fillbar.getBoundingClientRect();
    let currPosition = ((event.clientX - szAndpos.left) / szAndpos.width) * 10;

    //Calculate and set intended Track Time
    let newPosition = ((currPosition * audio.duration) / 10).toFixed(6);

    audio.currentTime = newPosition;
    
    //Calculate gradient change
    let gradientCalc = (newPosition/audio.duration) * 100;
    fillbar.style.background = 'linear-gradient(90deg, #289cff ' + gradientCalc + '%, #fff ' + gradientCalc + '%)';
    fillbar.value = gradientCalc;
});


//OnInput Dynamic Fillbar
fillbar.addEventListener("mousedown",function(event){
    if(audio.paused === true)
    {
        playSong();
        let playBtn = document.querySelector('.play-pause');
        playBtn.innerHTML = '<i class="fa fa-pause"></i>';
    }
    //Size of an element and its position relative to the viewport
    var szAndpos = fillbar.getBoundingClientRect();
    let currPosition = ((event.clientX - szAndpos.left) / szAndpos.width) * 10;

    //Calculate and set intended Track Time
    let newPosition = ((currPosition * audio.duration) / 10).toFixed(6);
    if(isNaN(newPosition) === false){
        audio.currentTime = newPosition;
    }
    
    //Calculate gradient change
    let gradientCalc = (newPosition/audio.duration) * 100;
    fillbar.style.background = 'linear-gradient(90deg, #289cff ' + gradientCalc + '%, #fff ' + gradientCalc + '%)';
    fillbar.value = gradientCalc;
})

//Previous and Next Buttons
function nextAudio(){
    if(shuffleSong === 1){
        let random_num = getRandomTrackNumber();
        currentSong = random_num;
    }
    else{
        currentSong++;
        if(currentSong > 2){
            currentSong = 0;
        }
    }

    //Play new Song
    playSong(0);
    playBtn = document.querySelector('.play-pause');
    playBtn.innerHTML = '<i class="fa fa-pause"></i>';
    
    //Change Artist and SongTitle
    ChangeAlbumAndArtists();
    
    //Change covers
    img.setAttribute('src', covers[currentSong]);
}

function prevAudio(){
    //Reset Track Time (Alternative to Stop button)
    if(Math.round(audio.currentTime) !== 0){
        audio.currentTime = 0;
        fillbar.value = 0;
    } 
    //Play new Song
    else{
        currentSong--;
        if(currentSong < 0){
            currentSong = 2;
        } 

        playSong(0);
        playBtn = document.querySelector('.play-pause');
        playBtn.innerHTML = '<i class="fa fa-pause"></i>';
    
        //Change Artist and SongTitle
        ChangeAlbumAndArtists();

        //Change covers
        img.setAttribute('src', covers[currentSong]);
    }
}

//Volume up or down
slider.addEventListener("input",function(){
    let newVal = slider.value;
    let position = newVal * 100;

    slider.style.background = 'linear-gradient(90deg, #289cff ' + position + '%, #fff ' + position + '%)';
    
    slider.innerHTML = newVal;
    audio.volume = newVal;

    if(newVal == 0){
        document.querySelector(".volumeup i").className = "fa fa-volume-off";
    }
    else{
        document.querySelector(".volumeup i").className = "fa fa-volume-up";
    }
})

//(Un)Mute Function
volumeUp.addEventListener("click",function(){
    if(audio.volume !== 0){
        soundlevel = audio.volume;
        audio.volume = 0;
        volumeUpIcon.className = "fa fa-volume-off";
        slider.style.background = 'linear-gradient(90deg, #289cff 0%, #fff 0%)';
        slider.value = 0;
    }
    else{
        audio.volume = soundlevel;
        volumeUpIcon.className = "fa fa-volume-up";
        slider.value = audio.volume;
        slider.style.background = 'linear-gradient(90deg, #289cff ' + (audio.volume * 100) + '%, #fff ' + (audio.volume * 100) + '%)';

    }
})

//Side Menu functions
function openNav() {
    sidemenu.style.width = "200px";
  }
  
function closeNav() {
    sidemenu.style.width = "0";
  }
function setThemeMode(theme) {
    documentElem.className = theme
    toggleThemeMode(theme)
}

function toggleThemeMode(theme) {
    documentElem.className = theme
    if (theme === "dark") {
        themeBtnElem.classList.remove("fa-moon")
        themeBtnElem.classList.add("fa-sun")
        themeStatus = "light"
    } else {
        themeBtnElem.classList.remove("fa-sun")
        themeBtnElem.classList.add("fa-moon")
        themeStatus = "dark"
    }
}

function themeBtnClickHandler(event) {
    toggleThemeMode(themeStatus)
}

function menuBtnClickHandler(event) {
    toggleMenuMode()
}

function toggleMenuMode() {
    if (menuStatus) {
        menuBtnElem.classList.remove("fa-xmark")
        menuBtnElem.classList.add("fa-bars")
        searchBoxElem.classList.remove("navigation__search-box--show")
        playListElem.classList.remove("menu__list--show")
        menuStatus = false
    } else {
        menuBtnElem.classList.remove("fa-bars")
        menuBtnElem.classList.add("fa-xmark")
        searchBoxElem.classList.add("navigation__search-box--show")
        playListElem.classList.add("menu__list--show")
        menuStatus = true
    }
}

function windowResizeHandler(event) {
    if (window.innerWidth > 767 && menuStatus) {
        toggleMenuMode()
    }
}

function windowLoadHandler() {
    soundElemGenerator(sounds)
    verseGenerator(0)
    setNavigationElem(playListElem.children[0].children[2])
    setTimeout(() => {
        setFlameEventResizer()
    }, 500);
}

function setFlameEventResizer(music = null, percent = 0) {
    clearInterval(navigation)
    if (music && music !== currentMusic) {
        flameContainerElem.style.cssText = `--width-right: 0%; --width-before: auto;`
        if (music !== playListElem.children[0].children[2]) {
            flameContainerElem.innerHTML = ""
            flameCountProcesser()
        }
    }
    if (!flameContainerElem.innerHTML) {
        flameCountProcesser()
        flameContainerElem.addEventListener("mousemove", flameContainerElemHoverMoveElem)
        flameContainerElem.addEventListener("click", flameContainerElemClickHandler)
    }
    if (percent) {
        flameContainerElem.removeEventListener("mouseleave", flameContainerElemleaveHandler)
        flameContainerElem.style.cssText = `--width-right: ${percent}%; --width-before: auto;`
    }
    navigationFlameElem(music)
    flameContainerElem.addEventListener("mouseleave", flameContainerElemleaveHandler)
}

function navigationFlameElem(music) {
    if (music) {
        navigation = setInterval(() => {
            const musicCurrentTime = Math.round(music.currentTime)
            percent = Math.ceil(musicCurrentTime / music.duration * 100)
            flameContainerElem.style.cssText = `--width-right: ${percent}%; --width-before: auto;`

            if (!isPlaying(music) && music.currentTime) {
                playStopBtnElem.classList.remove("fa-pause")
                playStopBtnElem.classList.add("fa-play");
                clearInterval(navigation)
                if ((music.duration === music.currentTime) && isRepeat) {
                    playStopBtnElem.classList.remove("fa-play");
                    playStopBtnElem.classList.add("fa-pause")
                    music.currentTime = 0
                    playItem(currentMusic)
                }
            }
        }, 1000);
    }
}

function isPlaying(audioElement) {
    if (audioElement) {
        return !audioElement.paused && !audioElement.ended && audioElement.readyState > 2;
    }

}

function playItem(music, percent = 0) {
    let musicCurrentTime, musicDuration;

    verseGenerator(music.parentElement.dataset.index)
    setNavigationElem(music)
    setFlameEventResizer(music, percent)

    if (percent) {
        musicDuration = +music.parentElement.dataset.audioTime
        musicCurrentTime = musicDuration / 100 * percent
        music.currentTime = Math.floor(musicCurrentTime)
    }

    if (Math.round(musicCurrentTime) !== musicDuration) {
        music.play();
    }

    currentMusic = music

    changeVolumeBtnIcon(currentMusic.volume)
}

function flameCountProcesser() {
    const width = flameContainerElem.offsetWidth
    flameGenerator(Math.floor(width / 5))
}

function flameGenerator(count) {
    const flameElems = []

    for (let i = 0; i < count; i++) {
        const randomeHeight = Math.ceil(Math.random(0) * 6)
        const flameElem = `<div class="flame__item" style="--i: ${randomeHeight}"></div>`

        flameElems.push(flameElem)
    }

    flameContainerElem.innerHTML += flameElems.join("")
}

function flameContainerElemHoverMoveElem(event) {
    clearInterval(navigation)
    flameContainerElem.style.cssText = `--width-right: ${Math.ceil(event.currentTarget.clientWidth - event.offsetX)}px; --width-before: auto;`
}

function flameContainerElemClickHandler(event) {
    percentClicked = Math.ceil((event.offsetX / event.currentTarget.clientWidth * -100) + 100)

    if (isPlaying(currentMusic)) {
        playItem(currentMusic, percentClicked)
    }
}

function flameContainerElemleaveHandler(event) {
    flameContainerElem.style.cssText = `--width: ${Math.ceil(percent)}%; --width-before: auto;`
    navigationFlameElem(currentMusicItem)
}

function soundElemGenerator(array) {
    playListElem.innerHTML = ""
    array.forEach((sound, index) => {
        const randomNumber = Math.ceil(Math.random() * 10)
        const soundBoxElem = `<div class="list__item" data-index="${index}" onclick="listItemClickHandler(event)">
                        <img src="pictures/${randomNumber}.jpg" alt="" class="item__picture">
                        <div class="item__content-wrapper">
                            <h3 class="item__title">${sound.name}</h3>
                            <h2 class="item__time">${sound.time}</h2>
                        </div>
                        <audio class="item__audio" preload="none">
                            <source src="${sound.source}" type="audio/mp3">
                        </audio>
                    </div>`;

        playListElem.innerHTML += soundBoxElem
    });

    itemTimeElemGenerator([...playListElem.children])
}

function removeClassElement(className) {
    document.querySelectorAll(`.${className}`).forEach(element => element.classList.remove(`${className}`))
}

function itemTimeElemGenerator(audioElems) {

    for (let i = 0; i < audioElems.length; i++) {
        const timeArray = audioElems[i].children[1].children[1].innerHTML.split(":").reverse()

        let hour = 0
        let minute = 0
        let second = 0

        if (timeArray.length > 2) {
            hour = +timeArray[2] * 60 * 60
        }
        if (timeArray.length > 1) {
            minute = +timeArray[1] * 60
        }
        if (timeArray.length > 0) {
            second = +timeArray[0]
        }

        const secondTime = hour + minute + second

        audioElems[i].dataset.audioTime = secondTime
    }
}

function listItemClickHandler(event) {
    [...playListElem.children].forEach(itemElem => {
        if (isPlaying(itemElem.children[2])) {
            itemElem.children[2].pause()
        }
    })

    if (playPauseFlag === undefined || !playPauseFlag) {
        currentMusicItem = event.currentTarget.children[2]
        musicPlayStopHandler()
    }

    if (playPauseFlag === undefined || playPauseFlag) {
        event.currentTarget.children[2].currentTime = 0
        playItem(event.currentTarget.children[2])
        currentMusicItem = event.currentTarget.children[2]
        playPauseFlag = true
    } else {
        playPauseFlag = false
    }
}

function volumeBtnClickHandler(event) {
    if (currentMusicItem) {
        const volume = currentMusicItem.volume
        if (volume === 1) {
            currentMusicItem.volume = 0
            changeVolumeBtnIcon(0)
        } else {
            currentMusicItem.volume = 1
            changeVolumeBtnIcon(1)
        }
    }
}

function changeVolumeBtnIcon(volume) {
    if (volume) {
        volumeBtnElem.classList.remove("fa-volume-xmark")
        volumeBtnElem.classList.add("fa-volume-high")
    } else {
        volumeBtnElem.classList.remove("fa-volume-high")
        volumeBtnElem.classList.add("fa-volume-xmark")
    }
}
function nextBtnClickHandler(event) {
    if (!currentMusicItem) {
        currentMusicItem = playListElem.children[0].children[2]
    }

    [...playListElem.children].forEach(itemElem => {
        if (isPlaying(itemElem.children[2])) {
            itemElem.children[2].pause()
            itemElem.children[2].currentTime = 0
        }
    })

    if (currentMusicItem === playListElem.children[playListElem.children.length - 1].children[2]) {
        currentMusicItem = playListElem.children[0].children[2]
    } else {
        currentMusicItem = currentMusicItem.parentElement.nextElementSibling.children[2]
    }

    musicPlayStopHandler()
}
function playStopBtnClickHandler(event) {
    musicPlayStopHandler()
}

function musicPlayStopHandler() {
    if (currentMusicItem) {
        changePlayPauseIcon()

        if (isPlaying(currentMusicItem)) {
            currentMusicItem.pause()
        } else {
            playItem(currentMusicItem)
        }

    } else {
        currentMusicItem = playListElem.children[0].children[2]
        musicPlayStopHandler()
    }
}

function changePlayPauseIcon() {
    if (isPlaying(currentMusicItem)) {
        playStopBtnElem.classList.remove("fa-pause")
        playStopBtnElem.classList.add("fa-play");
    } else {
        playStopBtnElem.classList.add("fa-pause")
        playStopBtnElem.classList.remove("fa-play");
    }
}
function previousBtnClickHandler(event) {
    if (!currentMusicItem) {
        currentMusicItem = playListElem.children[0].children[2]
    }

    [...playListElem.children].forEach(itemElem => {
        if (isPlaying(itemElem.children[2])) {
            itemElem.children[2].pause()
            itemElem.children[2].currentTime = 0
        }
    })

    if (currentMusicItem.parentElement === playListElem.children[0]) {
        currentMusicItem = playListElem.children[playListElem.children.length - 1].children[2]
    } else {
        currentMusicItem = currentMusicItem.parentElement.previousElementSibling.children[2]
    }

    musicPlayStopHandler()
}
function repeatBtnClickHandler(event) {
    if (isRepeat) {
        repeatBtnElem.classList.remove("fa-registered")
        repeatBtnElem.classList.add("fa-repeat")
        isRepeat = false
    } else {
        repeatBtnElem.classList.remove("fa-repeat")
        repeatBtnElem.classList.add("fa-registered")
        isRepeat = true
    }
}

function setNavigationElem(music) {
    const imgMusic = music.parentElement.children[0].getAttribute("src")
    const titleMusic = music.parentElement.children[1].children[0].innerHTML
    const timeMusic = music.parentElement.children[1].children[1].innerHTML

    informationPictureElem.setAttribute("src", imgMusic)
    informationTitleElem.innerHTML = titleMusic
    informationTimeElem.innerHTML = timeMusic
}

function verseGenerator(versIndex) {
    const verses = sounds[versIndex].verses

    verseContainerElem.innerHTML = ""
    verseContainerElem.scrollTop = 0

    verses.forEach(item => {
        const verseWrapper = document.createElement("div")
        verseWrapper.classList.add("verse__wrapper")

        const arabicVerse = document.createElement("h2")
        arabicVerse.classList.add("verse__arabic")
        arabicVerse.innerHTML = item.verse

        const pershinVerse = document.createElement("h3")
        pershinVerse.classList.add("verse__pershin")
        pershinVerse.innerHTML = item.translate

        verseWrapper.append(arabicVerse, pershinVerse)

        verseContainerElem.append(verseWrapper)
    })
}

function searchBoxKeyUpHandler(event) {
    if (event.target.value !== "") {
        sounds.forEach(sound => {
            if (sound.name.indexOf(event.target.value) !== -1) {
                soundsName.push(sound)
            }
        })
        soundElemGenerator(soundsName)
        soundsName = []
    } else {
        soundElemGenerator(sounds)
    }
}
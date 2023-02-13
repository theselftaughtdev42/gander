var songData
var filterData
var filtersSelected = []
var songsToDisplay = []

function downloadSong(uid) {
    let song = songData[uid-1]

}

function playSong(uid) {
    let audio = document.getElementById("music-player")
    audio.pause()
    let song = songData[uid-1]
    let filepath = "./music/" + song["filepath"]
    audio.src = filepath
    audio.play()
}

function updateSongList() {
    songsToDisplay = []

    songData.forEach((song) => {
        filtersSelected.forEach((filter) => {
            filterArray = filter.split("-")
            let filterType = filterArray[0]
            let filterID = filterArray[1]
            filterBy = filterData[filterType][filterID]

            if (song["genres"].includes(filterBy) && songsToDisplay.indexOf(song["uid"]) < 0) {
                songsToDisplay.push(song)
            }
        })
    })
    displaySongs()
}

function displaySongs() {
    let songsContainer = document.getElementById("songs-tbody")
    songsContainer.innerText = ""

    songsToDisplay.forEach((song) => {
        let tableRow = document.createElement("tr")

        let play = document.createElement("td")
        let playicon = document.createElement("i")
        playicon.classList.add("fa-solid", "fa-play", "fa-xl", "text-primary")
        playicon.setAttribute("data-uid", song["uid"])
        playicon.addEventListener("click", (event) => {
            playSong(event.srcElement.dataset.uid)
        })
        play.appendChild(playicon)

        let title = document.createElement("td")
        title.appendChild(document.createTextNode(song["title"]))

        let album = document.createElement("td")
        album.appendChild(document.createTextNode(song["album"]))

        let artist = document.createElement("td")
        artist.appendChild(document.createTextNode(song["artist"]))

        let downloadCell = document.createElement("td")
        let downloadAnchor = document.createElement("a")
        downloadAnchor.setAttribute("href", "./music/"+song["filepath"])
        downloadAnchor.setAttribute("download", "")
        let downloadIcon = document.createElement("i")
        downloadIcon.classList.add("fa-solid", "fa-download", "fa-xl", "text-success")
        downloadAnchor.appendChild(downloadIcon)
        downloadCell.appendChild(downloadAnchor)

        tableRow.appendChild(play)
        tableRow.appendChild(title)
        tableRow.appendChild(album)
        tableRow.appendChild(artist)
        tableRow.appendChild(downloadCell)

        songsContainer.appendChild(tableRow)
    })
}

function addFilter(elementID) {
    let index = filtersSelected.indexOf(elementID)
    if (index < 0) {
        filtersSelected.push(elementID)
        updateSongList()
    }
}

function removeFilter(elementID) {
    let index = filtersSelected.indexOf(elementID)
    if (index >= 0) {
        filtersSelected.splice(index, 1)
        updateSongList()
    }
}

// get all song data
fetch("./song_data.json")
.then((response) => response.json())
.then((data) => {
    songData = data
})

// get song filter data and generate accordions
fetch('./genre_data.json')
.then((response) => response.json())
.then((data) => {
    filterData = data
    for (const property in data) {
        // create a button inside the accordion "header"
        let accordionButtonText = document.createTextNode(property)

        let accordionButton = document.createElement("button")
        accordionButton.classList.add("accordion-button", "collapsed")
        accordionButton.setAttribute("type", "button")
        accordionButton.setAttribute("data-bs-toggle", "collapse")
        accordionButton.setAttribute("data-bs-target", `#collapse-${property}`)
        accordionButton.appendChild(accordionButtonText)

        let accordionHeader = document.createElement("h2")
        accordionHeader.classList.add("accordion-header")
        accordionHeader.setAttribute("id", `heading-${property}`)
        accordionHeader.appendChild(accordionButton)

        // generate the content of the accordion
        let accordionBodyContent = document.createElement("div")
        accordionBodyContent.classList.add("accordion-body")
        accordionBodyContent.setAttribute("id", `accordion-${property}`)

        for (const index in data[property]) {
            // generate each checkbox and event listener
            value = data[property][index]
            let input = document.createElement("input")
            input.setAttribute("type", "checkbox")
            input.setAttribute("id", `${property}-${index}`)
            input.setAttribute("name", `${property}-${index}`)
            input.setAttribute("value", value)
            input.classList.add("form-check-input")

            input.addEventListener("click", (event) => {
                if (event.srcElement.checked) {
                    addFilter(event.srcElement.id)
                }
                if (!event.srcElement.checked) {
                    removeFilter(event.srcElement.id)
                }
            })

            let label = document.createElement("label")
            label.setAttribute("for", `${property}-${index}`)
            label.classList.add("form-check-label")

            let labelText = document.createTextNode(value)
            label.appendChild(labelText)
            
            let checkBoxContainer = document.createElement("div")
            checkBoxContainer.classList.add("form-check")
            checkBoxContainer.appendChild(input)
            checkBoxContainer.appendChild(label)

            accordionBodyContent.appendChild(checkBoxContainer)
        }

        let accordionBody = document.createElement("div")
        accordionBody.classList.add("accordion-collapse", "collapse")
        accordionBody.setAttribute("id", `collapse-${property}`)
        accordionBody.setAttribute("data-bs-parent", "#accordionFilter")
        accordionBody.appendChild(accordionBodyContent)
        
        let accordionItem = document.createElement("div")
        accordionItem.classList.add("accordion-item")
        accordionItem.appendChild(accordionHeader)
        accordionItem.appendChild(accordionBody)

        let accordionElement = document.querySelector("#accordionFilter")
        accordionElement.appendChild(accordionItem)
    }
});
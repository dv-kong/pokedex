let previousButton = document.querySelector(".left-button")
let nextButton = document.querySelector(".right-button")
previousButton.addEventListener('click', switchPokemonListOnClick)
nextButton.addEventListener('click', switchPokemonListOnClick)

let selectedPokemonDisplayDiv = document.querySelector("main-section__black")
let pokemonName = document.querySelector(".poke-name")
let pokemonId = document.querySelector(".poke-id")
let pokemonFrontImage = document.querySelector(".poke-front-image")
let pokemonBackImage = document.querySelector(".poke-back-image")
let pokemonTypeOne = document.querySelector(".poke-type-one")
let pokemonTypeTwo = document.querySelector(".poke-type-two")
let pokemonWeight = document.querySelector(".poke-weight")
let pokemonHeight = document.querySelector(".poke-height")
let pokemonBackground = document.querySelector("div.main-screen")
let pokemonDisplayDivsArray = document.querySelectorAll(".list-item")

var global_pokedexArray;
var global_pokemonIdData;
let nextUrl;
let prevUrl;
// let url;
let selectedPokemon_id;
let konamiCodeStatus = false
var i;

function fetchPokemonList(url) {

    let fetch_config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch(url, fetch_config)
        .then(function(response) {
            response.json()
                .then(function(data) {
                    if (response.status == 400) {
                        console.log(data);
                    } else if (response.status == 403) {
                        console.log(data);
                    } else {
                        global_pokedexArray = data;
                        nextUrl = data["next"]
                        prevUrl = data["previous"]
                    }
                    generatePokemonDisplayList(data)
                })


        })

}

function addEventListenerToListElements(pokemonArray) {
    let clickedElementIndexInArray;
    pokemonArray.forEach(element => {
        element.addEventListener('click', () => {
            pokemonBackground.classList.remove('hide')
            clickedElementIndexInArray = Array.from(element.parentNode.children).indexOf(element)
                // fetchPokemonURL(pokedexArray.results[clickedElementIndexInArray].url)
            fetchPokemonURL(global_pokedexArray.results[clickedElementIndexInArray].url)
        })
    });
}
let eventListenerCount = 0

function generatePokemonDisplayList(pokedexArray) {
    i = 0;
    pokemonDisplayDivsArray.forEach(element => { // For each list element, add evList // click = display clicked div ID (url parse)

        let full_url = pokedexArray.results[i].url.split('pokemon/')[1]
        let pokemon_id = full_url.split('/')[0];
        element.textContent = `${pokemon_id}. ${capitalize(pokedexArray.results[i].name)}`
        i++;

    });
    if (eventListenerCount == 0) { // prevent eventListener from getting added multiple times

        addEventListenerToListElements(pokemonDisplayDivsArray)
        eventListenerCount++;
    }
}

function switchPokemonListOnClick(event) {
    if (event.target.classList == "left-button") {
        fetchPokemonList(prevUrl)
    } else if (event.target.classList == "right-button") {
        fetchPokemonList(nextUrl)
    }
}

function fetchPokemonURL(url) {

    let fetch_config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch(url, fetch_config)
        .then(function(response) {
            response.json()
                .then(function(data) {
                    global_pokemonIdData = data;
                    updateCurrentPokemonDisplay(data)
                });
        })
}

function capitalize(str) {
    return str && str[0].toUpperCase() + str.slice(1);
}

function addZeros(str) {
    str = str.toString(10)
    if (str.length == 1) {
        return "#00" + str

    } else if (str.length == 2) {
        return "#0" + str
    } else {
        return '#' + str
    }
}
let typeOne;

function updateCurrentPokemonDisplay(pokemonIdData) {
    if (konamiCodeStatus) {
        pokemonFrontImage.src = pokemonIdData.sprites.front_shiny
        pokemonBackImage.src = pokemonIdData.sprites.back_shiny
    } else {
        pokemonFrontImage.src = pokemonIdData.sprites.front_default
        pokemonBackImage.src = pokemonIdData.sprites.back_default
    }
    pokemonId.textContent = addZeros(pokemonIdData.id)
    pokemonName.textContent = capitalize(pokemonIdData.name)
    pokemonTypeOne.textContent = capitalize(pokemonIdData.types[0].type.name)
    typeOne = pokemonIdData["types"][0]["type"]["name"];
    if (pokemonIdData["types"][1] == 0 || pokemonIdData["types"][1] == undefined) {
        pokemonTypeTwo.style.display = "none"
    } else {
        pokemonTypeTwo.style.display = "block"
        pokemonTypeTwo.textContent = capitalize(pokemonIdData["types"][1]["type"]["name"])
    }
    pokemonBackground.className = 'main-screen'
    pokemonBackground.classList.add(typeOne)
    pokemonWeight.textContent = pokemonIdData.weight
    pokemonHeight.textContent = pokemonIdData.height
}
// Konami code

let A_button = document.querySelector('.a-button')
let B_button = document.querySelector('.b-button')
let top_button = document.querySelector('.top')
let left_button = document.querySelector('.left')
let right_button = document.querySelector('.right')
let bottom_button = document.querySelector('.bottom')
let middle_button = document.querySelector('.middle')
let pageBody = document.querySelector('body')

A_button.addEventListener("click", konamiCodeCheck)
B_button.addEventListener("click", konamiCodeCheck)
top_button.addEventListener("click", konamiCodeCheck)
left_button.addEventListener("click", konamiCodeCheck)
right_button.addEventListener("click", konamiCodeCheck)
bottom_button.addEventListener("click", konamiCodeCheck)
middle_button.addEventListener("click", konamiCodeCheck)

let keyDownPress = []
let buttonsClicked = []
var buttonsClickedCopy = ''
var keydownPressCopy = ''

function konamiCodeCheck(event) {
    if (event.type == 'click') {
        buttonsClicked.push(event.target.getAttribute("value"));
        buttonsClickedCopy = buttonsClicked.join('')
    }
    keydownPressCopy = keyDownPress.join('')
    if (keydownPressCopy.includes('ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba') ||
        keydownPressCopy.includes('ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightBA') ||
        buttonsClickedCopy.includes('toptopbottombottomleftleftrightrightBA')) {

        if (konamiCodeStatus) {
            konamiCodeStatus = false
            console.log('konami code off');
            updateCurrentPokemonDisplay(global_pokemonIdData)

        } else {
            konamiCodeStatus = true
            console.log('konami code on');

            updateCurrentPokemonDisplay(global_pokemonIdData)

        }
        console.log(konamiCodeStatus);
        keyDownPress = []
        buttonsClicked = []
    }
}
document.addEventListener("keydown", (event) => {
    keyDownPress.push(event.key)
    konamiCodeCheck(event)
})


fetchPokemonList(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20`)
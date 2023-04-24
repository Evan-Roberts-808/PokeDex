document.addEventListener('DOMContentLoaded', () => {

    let pokemon
    let currentPokemon
    let pokemonList = document.querySelector('#pokemon-list')
    let search = document.querySelector('#search')

    fetch('https://pokeapi.co/api/v2/pokemon?limit=100000') //fetch the pokemon data (this returns a list of objects with pokemon name and url)
    .then (response => response.json())
    .then (allPokemon => {
        allPokemon.results.forEach(pokemon => fetchPokemonData(pokemon)) // for each pokemon in the list, run fetchPokemonData()
            
    })
        
    function fetchPokemonData(pokemon) { // fetch the url of the requested pokemon object
        let url = pokemon.url
        fetch(url)
        .then (response => response.json())
        .then (function (pokeData) {
            console.log(pokeData)
            renderPokemonCards(pokeData)
        })
    }

    function renderPokemonCards(pokemon) {
        let newCard = document.createElement('div')
        newCard.classList.add('card', 'col-sm-3')
        let pokeImg = document.createElement('img')
        pokeImg.src = pokemon.sprites.front_default
        pokeImg.classList.add('poke-img')
        //pokeImg.id('poke-img')
        let pokeName = document.createElement('p')
        pokeName.textContent = pokemon.name
        pokeName.classList.add('poke-name')       
        let pokeDexNum = document.createElement('p')
        pokeDexNum.classList.add('dex-num')       
        pokeDexNum.textContent = pokemon.id
        newCard.append(pokeDexNum, pokeImg, pokeName)
        pokemonList.append(newCard)
    }
})
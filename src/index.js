document.addEventListener('DOMContentLoaded', () => {

    let pokemon
    let currentPokemon
    let pokemonList = document.querySelector('#pokemon-list')
    let search = document.querySelector('#search')
    //let card

    function fetchPokemonData(pokemon) {
        return fetch(pokemon.url)
          .then(response => response.json())
          .then(pokeData => {
            console.log(pokeData);
            return pokeData;
          });
      }
      fetch('https://pokeapi.co/api/v2/pokemon?limit=1008')
        .then(response => response.json())
        .then(allPokemon => {
          const pokemonPromises = allPokemon.results.map(pokemon => fetchPokemonData(pokemon));
          return Promise.all(pokemonPromises);
        })
        .then(pokemonData => {
          pokemonData.sort((a, b) => a.id - b.id); // Sort the data by ID
          pokemonData.forEach(pokemon => renderPokemonCards(pokemon));
        });

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

        newCard.addEventListener('mouseover', (e) => {
            newCard.style.cursor = 'pointer';
        })
    }

     search.addEventListener('keyup', (e) => { //this function checks search bar
      let searchTerm = search.value.toLowerCase().trim() //toLowerCase lowercases string, .trim removes excess yt space//
      let allDaCards = document.querySelectorAll('.card')
      allDaCards.forEach(card => {
        let cardName = card.querySelector('.poke-name').textContent.toLowerCase()
        let cardId = card.querySelector('.dex-num').textContent //calling the dex id
        if (cardName.includes(searchTerm) || cardId.includes(searchTerm)){
          card.style.display=''
        } else{
          card.style.display='none'
        }
      })
     }
     )







}) //end of the page, do not delete
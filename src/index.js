document.addEventListener('DOMContentLoaded', () => {

  ///////////// Global Variables & State 
  let pokemon
  let currentPokemon
  let pokemonList = document.querySelector('#pokemon-list')
  let search = document.querySelector('#search')
  let modal = document.querySelector('.modal')

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

  ///////// Event Listeners //////////

  search.addEventListener('keyup', searchFunctionality)

  //////////// Functions //////////////

  function fetchPokemonData(pokemon) {
     return fetch(pokemon.url)
        .then(response => response.json())
        .then(pokeData => {
           console.log(pokeData);
           return pokeData;
        });
  }

  function renderPokemonCards(pokemon) {
     let newCard = document.createElement('div')
     newCard.classList.add('card', 'col-sm-3')
     let pokeImg = document.createElement('img')
     pokeImg.src = pokemon.sprites.front_default
     pokeImg.classList.add('poke-img')
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

     //Modal event
     newCard.addEventListener('click', () => {
        currentPokemon = pokemon
        displayModal(currentPokemon)
     })
  }

  function displayModal(currentPokemon) {
    modal.style.display = "block";
    let modalDexNum = document.querySelector("#modal-dex-num");
    let modalImg = document.querySelector("#modal-img");
    let modalName = document.querySelector("#modal-poke-name");
    let modalHeight = document.querySelector("#modal-height");
    let modalWeight = document.querySelector("#modal-weight");
    let modalTypes = document.querySelector("#modal-types");
    let heightInM = currentPokemon.height / 10;
    let weightInKg = currentPokemon.weight / 10;
  
    let type1 = "";
    let type2 = "";
    let dualType = false;
    currentPokemon.types.forEach((type) => {
      if (!dualType) {
        type1 = type.type.name;
        dualType = true;
      } else {
        type2 = type.type.name;
      }
    });
  
    modalDexNum.textContent = currentPokemon.id;
    modalImg.src = currentPokemon.sprites.front_default;
    modalName.textContent = currentPokemon.name;
    modalHeight.textContent = `height: ${heightInM} m`;
    modalWeight.textContent = `weight: ${weightInKg} kg`;
    modalTypes.textContent = type2
      ? `type: ${type1} / ${type2}`
      : `type: ${type1}`;
  }
  
 

  function searchFunctionality() { //this function checks search bar
     let searchTerm = search.value.toLowerCase().trim() //toLowerCase lowercases string, .trim removes excess yt space//
     let allCards = document.querySelectorAll('.card')
     allCards.forEach(card => {
        let cardName = card.querySelector('.poke-name').textContent.toLowerCase()
        let cardId = card.querySelector('.dex-num').textContent //calling the dex id
        if (cardName.includes(searchTerm) || cardId.includes(searchTerm)) {
           card.style.display = ''
        } else {
           card.style.display = 'none'
        }
     })
  }
}) //end of the page, do not delete
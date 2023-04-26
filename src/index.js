document.addEventListener('DOMContentLoaded', () => {

  ///////////// Global Variables & State 
  let pokemon
  let currentPokemon
  let currentTeamMember
  let pokemonList = document.querySelector('#pokemon-list')
  let search = document.querySelector('#search')
  let modal = document.querySelector('.modal')
  let showTeamBtn = document.querySelector('#show-team')
  let sideBar = document.querySelector('.sidebar')
  let sideCloseBtn = document.querySelector('.closebtn')
  let body = document.querySelector('#slideAnimation')
  // let header = document.querySelector('#header')

  //fetching from localhost//
  fetch('http://localhost:3000/team')
  .then(resp => resp.json())
  .then(imgData => {
    teamImg = imgData;
    addToTeamBar(teamImg);
  })

  //fetching from poke api//
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

  showTeamBtn.addEventListener('click', () => {
    sideBar.style.width = "20%"
    body.style.marginRight = "20%"
  })

  sideCloseBtn.addEventListener('click', () => {
    sideBar.style.width = '0%'
    body.style.marginRight = '0%'
  })



  //////////// Functions //////////////

  //fetching pokemon urls from pokeAPI to use in first GET fetch
  function fetchPokemonData(pokemon) {
     return fetch(pokemon.url)
        .then(response => response.json())
        .then(pokeData => {
           console.log(pokeData);
           return pokeData;
        });
  }

  //parses pokeData and renders to DOM
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

//Populates content to modal
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
  
    //iterating through objects to grab pokemon type values to populate textContent
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

    //close button
    document.querySelector('.close').addEventListener('click', () => {
      modal.style.display = "none";
    })

    //add to team
    let addToTeamBtn = document.querySelector("#add-to-team")
    addToTeamBtn.addEventListener('click', () => {
      const imgUrl = currentPokemon.sprites.front_default
     
    //POST fetch to sidebar
    fetch('http://localhost:3000/team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        img_url: imgUrl
      })
    })
    })
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

  //appends imgs from db.json to sidebar
  function addToTeamBar(imgData) {
    imgData.forEach(img => {
      let anchor = document.createElement('a')
      let sideBarImage = document.createElement('img')
      sideBarImage.src = img.img_url
      anchor.className = "team"
      anchor.appendChild(sideBarImage)
      sideBar.appendChild(anchor)

      //Deletes img on click 'DELETE fetch'
      sideBarImage.addEventListener('click', () => {
        currentTeamMember = img
          fetch(`http://localhost:3000/team/${currentTeamMember.id}`, {
          method: 'DELETE'
        })
      })
    })
  } 






}) //end of the page, do not delete
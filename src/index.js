document.addEventListener('DOMContentLoaded', () => {

  ///////////// Global Variables & State 
  let pokemon
  let currentPokemon
  let currentTeamMember
  let pokemonList = document.querySelector('#pokemon-list')
  let search = document.querySelector('#search')
  let modal = document.querySelector('.modal')
  let modalContent = document.querySelector('#modal-content')
  let showTeamBtn = document.querySelector('#show-team')
  let sideBar = document.querySelector('.sidebar')
  let sideCloseBtn = document.querySelector('.closebtn')
  let body = document.querySelector('#slideAnimation')
  const header = document.getElementById("header");
  let allCards = [document.querySelectorAll('.card')]
  let typeSelector = document.getElementById('type-filter')
  let genSelector = document.getElementById('gen-filter')
  //fetching from localhost//
  fetch('http://localhost:3000/team')
  .then(resp => resp.json())
  .then(imgData => {
    teamImg = imgData;
    addToTeamBar(teamImg);
  })

  //fetching from poke api//
  fetch('https://pokeapi.co/api/v2/pokemon?limit=1008')  // This required us to parse through the link to get the pokemon's name and url
     .then(response => response.json())
     .then(allPokemon => {
        const pokemonPromises = allPokemon.results.map(pokemon => fetchPokemonData(pokemon)); // fetch pokemon data function loops through the urls and return pokemons objects
        return Promise.all(pokemonPromises); //data returns out of order
     })
     .then(pokemonData => {
        pokemonData.sort((a, b) => a.id - b.id); // Sort the data by ID
        pokemonData.forEach(pokemon => renderPokemonCards(pokemon)); 
     });

  ///////// Event Listeners //////////

  search.addEventListener('keyup', searchFunctionality) // listens for keypresses and invokes the search function

  showTeamBtn.addEventListener('click', () => { // displays the Favorites bar
    sideBar.style.width = "20%"
    body.style.marginRight = "20%"
  })

  sideCloseBtn.addEventListener('click', () => { // closes the Favorites bar
    sideBar.style.width = '0%'
    body.style.marginRight = '0%'
  })

  window.addEventListener("scroll", () => { // adds bg color to the header if scrolled passed the header height
    if (window.pageYOffset > header.offsetHeight) {
      header.classList.add("active");
    } else {
      header.classList.remove("active");
    }
  });

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
  function renderPokemonCards(pokemon) { // creates and displays the pokemon cards in the body 
     let newCard = document.createElement('div')
     let pokeImg = document.createElement('img')
     pokeImg.src = pokemon.sprites.front_default
     pokeImg.classList.add('poke-img')
     let pokeName = document.createElement('p')
     pokeName.textContent = pokemon.name
     pokeName.classList.add('poke-name')
     let pokeDexNum = document.createElement('p')
     pokeDexNum.classList.add('dex-num')
     pokeDexNum.textContent = pokemon.id
     const genP = document.createElement('p')
     genP.classList.add('gen-num')
     // types on the card, test/
     let pokeTypes = document.createElement('p')
     pokeTypes.classList.add('poke-type')
     pokeTypes.style.display = 'none'
     let generation
     
     
     if (pokemon.id <= 151) {  // checks the dex num of each pokemon to assign a gen
        generation = 'gen-1'
        genP.textContent = generation
        genP.style.display = 'none'
        newCard.append(genP)       
     } else if (pokemon.id > 151 && pokemon.id <= 251) {
      generation = 'gen-2'
      genP.textContent = generation
      genP.style.display = 'none'
      newCard.append(genP)       
    } else if (pokemon.id > 251 && pokemon.id <= 386) {
      generation = 'gen-3'
      genP.textContent = generation
      genP.style.display = 'none'
      newCard.append(genP)       
    } else if (pokemon.id > 386 && pokemon.id <= 493) {
      generation = 'gen-4'
      genP.textContent = generation
      genP.style.display = 'none'
      newCard.append(genP)       
    } else if (pokemon.id > 493 && pokemon.id <= 649) {
      generation = 'gen-5'
      genP.textContent = generation
      genP.style.display = 'none'
      newCard.append(genP)       
    } else if (pokemon.id > 649 && pokemon.id <= 721) {
      generation = 'gen-6'
      genP.textContent = generation
      genP.style.display = 'none'
      newCard.append(genP)       
    } else if (pokemon.id > 721 && pokemon.id <= 809) {
      generation = 'gen-7'
      genP.textContent = generation
      genP.style.display = 'none'
      newCard.append(genP)       
    } else if (pokemon.id > 809 && pokemon.id <= 905) {
      generation = 'gen-8'
      genP.textContent = generation
      genP.style.display = 'none'
      newCard.append(genP)       
    } else if (pokemon.id > 905 && pokemon.id <= 1008) {
      generation = 'gen-9'
      genP.textContent = generation
      genP.style.display = 'none'
      newCard.append(genP)       
    }

    

     let type1 = ""; 
     let type2 = "";
     let dualType = false;
     pokemon.types.forEach((type) => { // assigns type to each card
       if (!dualType) {
         type1 = type.type.name;
         dualType = true;
       } else {
         type2 = type.type.name;
       }})

       pokeTypes.textContent = type2 // if type 2 exists, set to type1/type2 else, just set to type1
       ? `type: ${type1} / ${type2}`
       : `type: ${type1}`;

       newCard.classList.add('card', 'col-sm-3', `${type1}-bg`) //passing in type1 variable with -bg to make a classname that matches the css selector

     newCard.append(pokeDexNum, pokeImg, pokeName, pokeTypes)
     pokemonList.append(newCard)


     newCard.addEventListener('mouseover', () => { // increases scale when hovering over a card
        newCard.classList.add('hover')
     })

     newCard.addEventListener('mouseleave', () => { // reduces scale when mouse leaves the card
      newCard.classList.remove('hover')
   })

     //Modal event
     newCard.addEventListener('click', () => { // displays modal with pokemon info
        currentPokemon = pokemon
        displayModal(currentPokemon)
     })

    //type filter search
     typeSelector.addEventListener('change', () => { // displays all pokemon with the type selected
      let type = typeSelector.value
      console.log(type)
      
      let allCards = document.querySelectorAll('.card')
      allCards.forEach(card => {
        let typeName = card.querySelector('.poke-type').textContent
        if (type === 'all' || typeName.includes(type)) {
          card.style.display = ''
        }
        else {
          card.style.display = 'none'
        }
      })

    }) //end of type filter
   
    genSelector.addEventListener('change', () => { // displays all pokemon with the gen selected
      let gen = genSelector.value
      console.log(gen)
      let allCards = document.querySelectorAll('.card')
      allCards.forEach(card => {
        let genNum = card.querySelector('.gen-num').textContent
        if (gen === 'all-gens' || genNum.includes(gen)) {
          card.style.display = ''
        }
        else {
          card.style.display = 'none'
        }
      })

    })

  } //end of renderPokemon

//Populates content to modal
  function displayModal(currentPokemon) { // displays modal
    modal.style.display = "block";
    let modalImg = document.querySelector("#modal-img");
    let modalName = document.querySelector("#modal-poke-name");
    let modalHeight = document.querySelector("#modal-height");
    let modalWeight = document.querySelector("#modal-weight");
    let modalTypes = document.querySelector("#modal-types");
    let modalNormalBtn = document.querySelector("#normalBtn")
    let modalShinyBtn = document.querySelector('#shinyBtn')

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
  
    modalImg.src = currentPokemon.sprites.front_default;
    modalName.textContent = `No: ${currentPokemon.id} ${currentPokemon.name}`;
    modalHeight.textContent = `height: ${heightInM} m`;
    modalWeight.textContent = `weight: ${weightInKg} kg`;
    modalTypes.textContent = type2
      ? `type: ${type1} / ${type2}`
      : `type: ${type1}`;
    modalContent.classList.remove('normal-bg', 'fire-bg', 'water-bg', 'grass-bg', 'electric-bg', 'ice-bg', 'fighting-bg', 'poison-bg', 'ground-bg', 'flying-bg', 'psychic-bg', 'bug-bg', 'rock-bg', 'ghost-bg', 'dragon-bg', 'dark-bg', 'steel-bg', 'fairy-bg');
    modalContent.classList.add(`${type1}-bg`)

    //close button
//close button
document.querySelector('.close').addEventListener('click', () => {
  modal.style.display = "none";
  modalNormalBtn.removeEventListener('click', switchToNormal);
  modalShinyBtn.removeEventListener('click', switchToShiny);
});

const switchToNormal = () => { // switches the pokemons sprite to the normal image
  modalImg.src = currentPokemon.sprites.front_default;
};

const switchToShiny = () => { // switches the pokemons sprite to the shiny image
  modalImg.src = currentPokemon.sprites.front_shiny;
};

modalNormalBtn.addEventListener('click', switchToNormal);

modalShinyBtn.addEventListener('click', switchToShiny);

    //add to Favorites
    let addToTeamBtn = document.querySelector("#add-to-team")
    addToTeamBtn.addEventListener('click', () => {
      const imgUrl = currentPokemon.sprites.front_default
      const name = currentPokemon.name
     
    //POST fetch to sidebar
    fetch('http://localhost:3000/team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        img_url: imgUrl,
        name: name
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
      let sideBarText = document.createElement('p')
      let sideBarImage = document.createElement('img')
      sideBarText.classList.add('sideBarName')
      sideBarImage.src = img.img_url
      anchor.className = "team"
      sideBarText.textContent = img.name
      anchor.append(sideBarImage, sideBarText)
      sideBar.appendChild(anchor)
      
      sideBarText.addEventListener('click', () => {
        const inputElement = document.createElement('input')
        inputElement.value = sideBarText.textContent
        sideBarText.replaceWith(inputElement)
        
        inputElement.addEventListener('blur', () => { // blur event for setting the nickname
          currentTeamMember = img
          fetch(`http://localhost:3000/team/${currentTeamMember.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: inputElement.value
            })
          })
          .then(resp => resp.json())
          .then(data => {
            sideBarText.textContent = data.name
            inputElement.replaceWith(sideBarText)
          })
          inputElement.focus()
        })
      })

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
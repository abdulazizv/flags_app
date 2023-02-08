"use strict";

let them = document.querySelector("#them");
let header = document.querySelector("header");
let wrapperCards = document.querySelector(".card__wrapper");
let select = document.querySelector('#region')
let searchInput = document.querySelector('#search')
/// theme script started: dark and light mode ///
them.addEventListener("input", (e) => {
  localStorage.setItem("them", e.target.checked);

  changeMode();
});

function changeMode() {
  let mode = localStorage.getItem("them");
  if (mode == "true") {
    document.body.style.cssText = "background-color:#202C36; color:#fff;";
    header.style.cssText = "background-color:#2B3844; color:#fff;";
  } else {
    document.body.style.cssText = "background-color:#F2F2F2; color:#000;";
    header.style.cssText = "background-color:#ffff; color:#000;";
  }
}

changeMode();

//  -------  --------- - -- dark and light mode finished ---- ///

// =--- --------------------------- Dynamic mode     --- -/

let baseURL = "https://restcountries.com/v2/all";
let filterURL= "https://restcountries.com/v2/region";
let searchURL = "https://restcountries.com/v2/name";
const getAllCountries = async () => {
  wrapperCards.innerHTML = `<span class="loader"></span>`
  try {
    const response = await fetch(baseURL);
    const result = await response.json();
    filterRegion(result);
    if (response.status === 200) {
        renderCards(result)
    } else {
        alert(response.status)
    }
  } catch (error) {
    console.log(`Error detected : ${error}`);
  }
};
getAllCountries();

// --- render Cards ----- /// -=-==-=-=-==========================================-

function renderCards(cards) {
  wrapperCards.innerHTML = ""
  cards.forEach((element) => {
    const card = createElement(
      "div",
      "rounded-[5px] shadow-lg bg-white max-w-sm w-[236px] h-[336px]",
      `
    <a href="#!">
        <img
          class="rounded-t-lg w-full h-[160px]"
          src="${element.flags.svg}"
          alt="img"
        />
        </a>
        <div class="p-6">
          <h5 class="text-gray-900 text-xl font-medium mb-2">${element.name}</h5>
          <ul class="list-none">
            <li><strong>Population: </strong>${element.population}</li>
            <li><strong>Region: </strong>${element.region}</li>
            <li><strong>Capital: </strong>${element.capital}</li>
          </ul>
        </div>`
    );
    wrapperCards.appendChild(card);
  });
}

/// ---- ---- Dynamic continents ------


function filterRegion(data) {
  const region = []
  data.forEach((item) => {
    if(!region.includes(item.region)) {
      region.push(item.region);  
    }
  })

  region.sort()
  console.log(region)
  region.forEach((item) => {
    const option = createElement('option','item',item); 
    select.append(option);
  })
}


async function filterRegions(region) {
  wrapperCards.innerHTML = `<span class="loader"></span>`
  const response = await fetch(`${filterURL}/${region}`);
  const arr = await response.json();
  console.log(arr)
  
  renderCards(arr);
}
select.addEventListener('change',(e) => {
    wrapperCards.innerHTML = ''
    console.log(e.target.value)
    filterRegions(e.target.value);
  })


  // ------ - --------- Dynamic continents ended =------------------------------//

async function searchCountries(country) {
  try {
    const response = await fetch(`${searchURL}/${country}`)
    const result = await response.json();
    if(response.status == 200){
      renderCards(result)
    } else {
      wrapperCards.innerHTML = `<h1 class ="uppercase text-4xl text-red-600 text-center">Not found such as country</h1>`
    }
  } catch (error) {
    console.log(err);
  }
}

 searchInput.addEventListener('keyup',(e) => {
  wrapperCards.innerHTML = ``
  if(e.target.value.trim().length > 0){
    searchCountries(e.target.value)
  } else {
    searchInput.setAttribute('placeholder','Please select country')
    getAllCountries()
  }
 })
 
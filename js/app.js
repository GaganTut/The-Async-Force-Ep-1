/*jshint esversion: 6*/

function createRequest(apiLink, queryElement, propertyName) {
  let newRequest = new XMLHttpRequest();
  newRequest.addEventListener('load', newReqFunc);
  newRequest.open('GET', apiLink);
  newRequest.send();

  function newReqFunc() {
    let requestData = JSON.parse(this.responseText);
    if (Array.isArray(requestData[propertyName])) {
      for (var i = 0; i < requestData[propertyName].length; i++) {
        createRequest(requestData[propertyName][i], queryElement, propertyName);
      }
    } else if (requestData[propertyName].indexOf('http://') !== -1) {
      createRequest(requestData[propertyName], queryElement, 'name');
    } else {
      document.querySelector(queryElement).innerHTML = requestData[propertyName];
    }
  }
}

createRequest('http://swapi.co/api/people/4', '#person4Name', 'name');
createRequest('http://swapi.co/api/people/4', '#person4HomeWorld', 'homeworld');
createRequest('http://swapi.co/api/people/14', '#person14Name', 'name');
createRequest('http://swapi.co/api/people/14', '#person14Species', 'species');

function filmList(parentID, apiLink, propertyName) {
  let newRequest = new XMLHttpRequest();
  newRequest.addEventListener('load', thisReqFunc);
  newRequest.open('GET', apiLink);
  newRequest.send();

  function thisReqFunc() {
    let parentElem = document.querySelector(parentID);
    let filmData = JSON.parse(this.responseText);
    for (let i = 0; i < filmData.results.length; i++) {
      let newListElem = document.createElement('li');
      newListElem.className = 'film';
      parentElem.appendChild(newListElem);

      let filmTitle = document.createElement('h2');
      filmTitle.className = 'filmTitle';
      filmTitle.innerHTML = filmData.results[i].title;
      newListElem.appendChild(filmTitle);

      let planetsHeader = document.createElement('h3');
      planetsHeader.innerHTML = 'Planets';
      newListElem.appendChild(planetsHeader);

      let filmPlanets = document.createElement('ul');
      filmPlanets.className = 'filmPlanets';
      newListElem.appendChild(filmPlanets);

      for (let j = 0; j < filmData.results[i].planets.length; j++) {
        let planets = document.createElement('li');
        planets.className = 'planet';
        filmPlanets.appendChild(planets);

        let planetName = document.createElement('h4');
        planetName.className = 'planetName';
        planetName.id = `planetOf${filmData.results[i].episode_id}${j}`;
        planets.appendChild(planetName);
        createRequest(filmData.results[i].planets[j], `#${planetName.id}`, 'name');
      }

    }
  }
}

filmList('#filmList', 'http://swapi.co/api/films/');

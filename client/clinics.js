const states = document.querySelectorAll('path, g#DC');

states.forEach((state) => {
  state.addEventListener('click', () => {
    // Get 2-digit state code from click
    const stateCode = state.id;
    console.log(stateCode);
    const stateName = state.getAttribute('name');
    const content = document.getElementById('content');
    document.querySelector('h6').innerText = `Processing your request for ${stateName}...`

    const devURL = `https://cors-anywhere.herokuapp.com/https://api.abortionpolicyapi.com/v1/gestational_limits/states/${stateCode}`;
    const prodURL = `https://api.abortionpolicyapi.com/v1/gestational_limits/states/${stateCode}`;
    fetch(devURL, {
      method: "GET",
      mode: "cors",
      headers: {
        token: "DUVZ8X63Xc7mHEMT"
      },
      json: true
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      const stateData = data[Object.keys(data)[0]];
      console.log(stateData);
      const div = document.createElement('div');
      content.appendChild(div);

      if (stateData) {
        let stateBans = '';
      const ban = stateData.banned_after_weeks_since_LMP;

      if (ban === 0) stateBans = `${stateName} bans abortions after conception.`;
      else if (ban === 28) stateBans = `${stateName} bans abortions in the third trimester.`;
      else if (ban === 99) stateBans = `${stateName} bans abortions after fetal viability (which varies state-to-state).`;
      else stateBans = `${stateName} bans abortions after ${ban} weeks since the last menstrual period.`

      let healthException = '';
      const exceptionType = stateData.exception_health;
      if (exceptionType === 'Physical') healthException = `${stateName} permits abortion if the procedure is medically necessary to preserve the pregnant person's physical health (excluding mental health).`;
      else if (exceptionType === 'Major Bodily Function') healthException = `${stateName} permits abortion in the case where a pregnant person would suffer "substantial and irreversible impairment of a major bodily function" (which may include mental health).`;
      else healthException = `${stateName} permits abortion for any unspecified health reasons, including reasons pertaining to mental health.`;

      const lifeException = stateData.exception_life ? `${stateName} allows for abortion if it is deemed medically necessary to save the pregnant person's life.` : `Abortion is banned in ${stateName}, even if abortion is medically necessary to save the pregnant person's life.`

      div.innerHTML = `
        <h1>${stateName}</h1>
        <p><h3>State Gestation Laws</h3></p>
        <p><strong>Gestational time limit:</strong> ${stateBans}</p>
        <p><strong>Health exceptions:</strong> ${healthException}</p>
        <p><strong>Life exceptions:</strong> ${lifeException}</p>
      `;
      } else {
        div.innerHTML = `
          <h1>${stateName}</h1>
          <p><h3>State Gestation Laws</h3></p>
          <p>Sorry, gestation law data is unavailable for that state.</p>
        `;
      }

    
      // Open modal at top of content div
      document.getElementsByClassName('modal-content')[0].scrollTop = 0;

      // Get the modal
      let modal = document.getElementById("myModal");
      // Get <span> that closes the modal
      let span = document.getElementsByClassName("close")[0];
      // Open modal upon state click
      modal.style.display = "block";

      // Once modal is open, change h6
      document.querySelector('h6').innerText = 'Click on a state to begin';

      // Close the modal on span click
      span.onclick = () => {
        modal.style.display = "none"
        content.innerHTML = ''
      }
      // Close modal if anywhere outside is clicked
      window.onclick = (event) => {
        if (event.target == modal) {
          modal.style.display = "none"
          content.innerHTML = ''
        }
      } 

    })
    .catch((error) => {
      console.error("Error:", error);
    })

  })
})







      // data.data.map((park) => {

      //   const name = document.createElement('h3')
      //   name.innerHTML = park.fullName

      //   const description = document.createElement('div')
      //   description.innerHTML = `<p>Park Information: [<a href=${park.url} target="_blank">Website</a>] | [<a href=${park.directionsUrl} target="_blank">Directions</a>]</p><p>${park.description}</p>`

      //   const weather = document.createTextNode(park.weatherInfo)

      //   const divider = document.createElement('hr')

      //   // Add data and elements to the page

      //   content.appendChild(name)
      //   content.appendChild(description)
      //   content.appendChild(weather)
      //   content.appendChild(divider)

    


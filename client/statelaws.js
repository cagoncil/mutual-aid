const states = document.querySelectorAll('path, g#DC');


const openModal = () => {
    // Open modal at top of content div
    document.getElementsByClassName('modal-content')[0].scrollTop = 0;

    // Get the modal
    const modal = document.getElementById("myModal");
    // Get <span> that closes the modal
    const span = document.getElementsByClassName("close")[0];
    // Open modal upon state click
    modal.style.display = "block";
  
    // Close the modal on span click
    span.onclick = () => {
      modal.style.display = "none";
      content.innerHTML = '';
    }
    // Close modal if anywhere outside is clicked
    window.onclick = (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
        content.innerHTML = '';
      }
    } 
}


states.forEach((state) => {
  state.addEventListener('click', () => {
    // Get 2-digit state code from click
    const stateCode = state.id;
    const stateName = state.getAttribute('name');
    const content = document.getElementById('content');
  
    document.querySelector('h6').innerText = `Processing your request for ${stateName}...`;

    Promise.all([
      fetch(
        `https://fast-falls-79139.herokuapp.com/https://api.abortionpolicyapi.com/v1/gestational_limits/states/${stateCode}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            token: "DUVZ8X63Xc7mHEMT"
          },
          json: true
        }
      ).then((resp) => resp.json()),
      fetch(
        `https://fast-falls-79139.herokuapp.com/https://api.abortionpolicyapi.com/v1/insurance_coverage/states/${stateCode}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            token: "DUVZ8X63Xc7mHEMT"
          },
          json: true
        }
      ).then((resp) => resp.json()),
      fetch(
        `https://fast-falls-79139.herokuapp.com/https://api.abortionpolicyapi.com/v1/minors/states/${stateCode}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            token: "DUVZ8X63Xc7mHEMT"
          },
          json: true
        }
      ).then((resp) => resp.json()),
      fetch(
        `https://fast-falls-79139.herokuapp.com/https://api.abortionpolicyapi.com/v1/waiting_periods/states/${stateCode}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            token: "DUVZ8X63Xc7mHEMT"
          },
          json: true
        }
      ).then((resp) => resp.json())
    ]).then((data) => {

      const gestationalLaws = data[Object.keys(data)[0]];
      const gestationDiv = document.createElement('div');

      if (stateName in gestationalLaws) {
        let stateBans = '';
        const ban = gestationalLaws[stateName].banned_after_weeks_since_LMP;
        if (ban === 0) stateBans = `${stateName} bans abortions after conception.`;
        else if (ban === 28) stateBans = `${stateName} bans abortions in the third trimester.`;
        else if (ban === 99) stateBans = `${stateName} bans abortions after fetal viability (which varies state-to-state).`;
        else stateBans = `${stateName} bans abortions after ${ban} weeks since the last menstrual period.`

        let healthException = '';
        const exceptionType = gestationalLaws[stateName].exception_health;
        if (exceptionType === 'Physical') healthException = `${stateName} permits abortion if the procedure is medically necessary to preserve the pregnant person's physical health (excluding mental health).`;
        else if (exceptionType === 'Major Bodily Function') healthException = `${stateName} permits abortion in the case where a pregnant person would suffer "substantial and irreversible impairment of a major bodily function" (which may include mental health).`;
        else healthException = `${stateName} permits abortion for any unspecified health reasons, including reasons pertaining to mental health.`;
        
        const lifeException = gestationalLaws[stateName].exception_life ? `${stateName} allows for abortion if it is deemed medically necessary to save the pregnant person's life.` : `Abortion is banned in ${stateName}, even if abortion is medically necessary to save the pregnant person's life.`

        gestationDiv.innerHTML = `
          <h1>${stateName}</h1>
          <p><h3>State Gestation Laws</h3></p>
          <p><strong>Gestational time limit:</strong> ${stateBans}</p>
          <p><strong>Health exceptions:</strong> ${healthException}</p>
          <p><strong>Life exceptions:</strong> ${lifeException}</p>
        `;
      } else {
        gestationDiv.innerHTML = `
          <h1>${stateName}</h1>
          <p><h3>State Gestation Laws</h3></p>
          <p>Sorry, gestation law data is unavailable for that state.</p>
          <p>Please enjoy this lovely video instead!</p>
          <iframe width="560" height="315" style="margin: auto" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" 
            title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
          </iframe>
        `;
      }
      content.appendChild(gestationDiv);

      const insurance = data[Object.keys(data)[1]];
      const insuranceDiv = document.createElement('div');

      if (stateName in insurance) { 
        // console.log(insurance, insurance[stateName]);

        const requiresCoverage = insurance[stateName].requires_coverage ? `${stateName} requires that state-regulated private health plans cover abortion. These requirements do not apply to self-insured plans (in which the employer takes on all the risk, instead of contracting with a health insurer) as self-insured plans are regulated at the federal, not state, level.` : `${stateName} does not require state-regulated private health plans to cover abortion.`;
        const exchangeCoverage = insurance[stateName].exchange_coverage_no_restrictions ? `${stateName} has not restricted abortion coverage in ACA plans.` : `${stateName} has restricted abortion coverage in ACA plans.`;
        const medicaidCoverage = insurance[stateName].medicaid_coverage_provider_patient_decision ? `${stateName} has a policy in place to use Medicaid funds to pay for abortion.` : `${stateName} does not have a policy in place to use Medicaid funds to pay for abortion.`;

        insuranceDiv.innerHTML = `<br>
          <p><h3>State Insurance Laws</h3></p>
          <p><strong>Private coverage laws</strong>: ${requiresCoverage}</p>
          <p><strong>Medicaid coverage laws</strong>: ${medicaidCoverage}</p>
          <p><strong>ACA Health Care Exchange laws</strong>: ${exchangeCoverage}</p>
        `;
      } else {
        insuranceDiv.innerHTML = `<br>
          <p><h3>State Insurance Laws</h3></p>
          <p>Sorry, insurance data is unavailable for that state.</p>
        `;
      }
      content.append(insuranceDiv);


      const waitingPeriods = data[Object.keys(data)[3]];
      const waitingPeriodsDiv = document.createElement('div');

      if (stateName in waitingPeriods) { 
        // console.log(waitingPeriods[stateName]);

        const counseling = waitingPeriods[stateName].counseling_visits === 1 ? `Counseling visits are required by ${stateName} law.` : `${stateName} requires the pregnant person make two clinic visits to obtain abortion counseling and/or an ultrasound before their waiting period begins.`;
        const hours = waitingPeriods[stateName].waiting_period_hours ? `${stateName} has a mandatory waiting period requirement of ${waitingPeriods[stateName].waiting_period_hours} hours. (All states waive mandatory waiting period requirements in the case of a medical emergency or when the pregnant person's life or health is threatened).` : `${stateName} does not have a waiting period law in effect.`;
        const notes = waitingPeriods[stateName].waiting_period_notes ? `<p><strong>Additional notes</strong>: ${waitingPeriods[stateName].waiting_period_notes}</p>` : '';

        waitingPeriodsDiv.innerHTML = `<br>
          <p><h3>State Waiting Period Laws</h3></p>
          <p><strong>Abortion counseling laws</strong>: ${counseling}</p>
          <p><strong>Waiting period</strong>: ${hours}</p>
          ${notes}
        `;
      } else {
        waitingPeriodsDiv.innerHTML = `<br>
          <p><h3>State Waiting Period Laws</h3></p>
          <p>Sorry, waiting period law data is unavailable for that state.</p>
        `;
      }
      content.append(waitingPeriodsDiv);


      const minors = data[Object.keys(data)[2]];
      const minorsDiv = document.createElement('div');

      if (stateName in minors) { 
        // console.log(minors[stateName]);

        const belowAge = minors[stateName].below_age ? `<p>Pregnant persons below the age of ${minors[stateName].below_age} are considered to be minors in the state of ${stateName}.</p>` : '';
        const judicialBypass = minors[stateName].judicial_bypass_available ? `<p>In ${stateName}, a judge can excuse a minor seeking abortion from the required parental consent and/or notification.</p>` : '';
        let parentsRequired = '';
        if (minors[stateName].parents_required === 1) {
          parentsRequired = `<p>In ${stateName}, in order for a minor to get an abortion, one of their parents must first be notified.</p>`;
        } else if (minors[stateName].parents_required === 2) {
          parentsRequired = `<p>In ${stateName}, in order for a minor to get an abortion, both of their parents must first be notified.</p>`;
        } else {
          parentsRequired = `<p>There are no parental notification requirements for minors' abortions currently being enforced in the state of ${stateName}.</p>`;
        }
        const parentalConsent = minors[stateName].parental_consent_required ? `<p>Minors living in ${stateName} cannot get an abortion without parental consent. (Some states require both consent and notification through separate laws.)</p>` : `<p>Minors living in ${stateName} can get an abortion without parental consent.</p>`;

        minorsDiv.innerHTML = `<br>
          <p><h3>State Minor Laws</h3></p>
          ${belowAge}
          ${judicialBypass}
          ${parentsRequired}
          ${parentalConsent}
        `;
      } else {
        minorsDiv.innerHTML = `<br>
          <p><h3>State Minor Laws</h3></p>
          <p>Sorry, minor data is unavailable for that state.</p>
        `;
      }
      content.append(minorsDiv);











    
      document.querySelector('h6').innerText = `Successfully fetched data for ${stateName}`;
      openModal();

    })
    .catch((error) => {
      console.log("Error:", error);
      document.querySelector('h6').innerText = `Sorry, API data for ${stateName} was unavailable`;
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = `
        <h1>Error</h1>
        <p>Sorry! The following error occurred:<br><p>${error}. Please try again later.</p></p>
      `;
      content.appendChild(errorDiv);
      openModal();
      document.querySelector('h6').innerText = error;


    })

  });
});







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

    


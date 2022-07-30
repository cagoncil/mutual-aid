let map;
const clinicContent = document.getElementById("clinicContent");
clinicContent.innerText = 'Please enable your location so we can find you the nearest abortion clinic.';

navigator.geolocation.getCurrentPosition((data) => { 
  const lat = data.coords.latitude; 
  const lng = data.coords.longitude;

  clinicContent.innerText = 'Fetching the nearest abortion clinic...';

  fetch(
    `https://fast-falls-79139.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=abortion%20clinics&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=AIzaSyB448M7Y8Qj_OOvLL1bOsSCl0r42UHLYZ0&locationbias=point:${lat},${lng}`
  )
  .then((response) => response.json())
  .then((data) => {
    data.candidates.forEach(clinic => {
      const openNowStatus = clinic.opening_hours.open_now ? `${clinic.name} is currently <strong>open</strong>.` : `${clinic.name} is currently closed.`;
      const clinicDiv = document.createElement('div');
      clinicDiv.innerHTML = `
        <p><h4>${clinic.name}</h4></p>
        <p><strong>Address</strong><br> ${clinic.formatted_address}</p>
        <p><strong>Open Status</strong>: ${openNowStatus}</p>
        <p><strong>Community Rating</strong>: ${clinic.rating} / 5</p>
      `;
      clinicContent.innerHTML = '';
      clinicContent.appendChild(clinicDiv);
    })
    
    // function initMap() {
    //   map = new google.maps.Map(document.getElementById("map"), {
    //     center: { lat, lng },
    //     zoom: 20
    //   });
    //   new google.maps.Marker({
    //     position: { lat, lng },
    //     map,
    //     title: data.candidates[0].name
    //   });
    // }
    // initMap();
    
  })
  .catch((error) => {
    console.error("Error:", error);
  })
});
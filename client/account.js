const showInput = (e) => {
    const id = e.target.id;
    
    if (id === 'Name') {
      document.querySelector('.input-group').innerHTML = `
        <form method='POST' action='/profile?_method=PATCH' spellcheck=false>
          <input type="text" name="${id.toLowerCase()}" class="form-control" placeholder="${id}" aria-label="${id}" aria-describedby="button-addon2">
          <button class="btn btn-outline-secondary" type="submit" id="button${id}">Update ${id}</button>
        </form>
      `;
    } else if (id === 'Email') {
      document.querySelector('.input-group').innerHTML = `
        <form method='POST' class='emailForm' action='/profile?_method=PATCH' spellcheck=false>
          <input type="text" name="${id.toLowerCase()}" class="form-control" placeholder="New ${id} Address" aria-label="${id}" aria-describedby="button-addon2">
          <input type="password" name="password" class="form-control" placeholder="Current Password" aria-label="currentPassword" aria-describedby="button-addon2" autocomplete="off">
          <button class="btn btn-outline-secondary" type="submit" id="button${id}">Update</button>
        </form>
      `;
    } else if (id === 'Password') {
      document.querySelector('.input-group').innerHTML = `
        <form method='POST' class='passForm' action='/profile?_method=PATCH' spellcheck=false>
          <input type="password" name="old${id}" class="form-control" placeholder="Current Password" aria-label="currentPassword" aria-describedby="button-addon2" autocomplete="off">
          <input type="password" name="${id.toLowerCase()}" class="form-control" placeholder="New ${id}" aria-label="${id}" aria-describedby="button-addon2" autocomplete="off">
          <input type="password" name="${id.toLowerCase()}" class="form-control" placeholder="Confirm New ${id}" aria-label="re-enter${id}" aria-describedby="button-addon2" autocomplete="off">
          <button class="btn btn-outline-secondary" type="submit" id="button${id}">Update</button>
        </form>
      `;
    } else if (id === 'Delete') {
      document.querySelector('.input-group').innerHTML = `
        <form method='POST' class='emailForm' action='/profile?_method=DELETE' spellcheck=false>
          <input type="password" name="password" class="form-control" placeholder="Enter Your Password" aria-label="enterPassword" aria-describedby="button-addon2" autocomplete="off">
          <button class="btn btn-outline-secondary" type="submit" id="button${id}">Confirm Account Deletion</button>
        </form>
      `;
    }
    
  }

  const accountDiv = document.getElementById('account');
  // Retrieve user data to display on account settings page
  fetch('/profile')
    .then((response) => {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const { name, email, password } = data.user;
      const dataArr = ['Name', 'Email', 'Password', 'Delete'];

      const accountData = document.createElement('div');
      accountData.setAttribute('id', 'userData');
      accountData.innerHTML = `
        <p><strong>${dataArr[0]}</strong>: ${name}</p>
        <p><strong>${dataArr[1]}</strong>: ${email}</p>
        <p><strong>${dataArr[2]}</strong>: ********</p>
        <p><button id='${dataArr[3]}' class='edit'>Delete Account</button></p>
      `;
      accountDiv.appendChild(accountData);

      const editLinks = document.createElement('div');
      editLinks.setAttribute('id', 'editLinks');
      editLinks.innerHTML = `
        <p><button id='${dataArr[0]}' class='edit'>Edit</button></p>
        <p><button id='${dataArr[1]}' class='edit'>Edit</button></p>
        <p><button id='${dataArr[2]}' class='edit'>Edit</button></p>
      `;
      accountDiv.appendChild(editLinks);

      dataArr.forEach((el, i) => document.getElementById(`${dataArr[i]}`).onclick = (e) => showInput(e));
      
    })
    .catch(err => console.log(err));
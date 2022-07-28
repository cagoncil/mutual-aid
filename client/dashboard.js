fetch('/profile')
.then((response) => {
  if (!response.ok) throw Error(response.statusText);
  return response.json();
})
.then((data) => {
  const { name } = data.user;
  document.querySelector('h4').innerText = `Welcome, ${name}`;
})
.catch(err => {
  console.log(err);
  document.querySelector('h4').innerText = `Welcome!`;
});

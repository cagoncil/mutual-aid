const toggleBtn = document.getElementById('toggleBtn');
const containerDiv = document.querySelector('.glass');
if (window.matchMedia("(max-width: 600px)").matches) {
    toggleBtn.addEventListener('click', (e) => {
    if (!toggleBtn.classList.contains('collapsed')) containerDiv.style.background = 'rgba(255,255,255,0.25)';
    else containerDiv.style.background = 'transparent';
    });
};
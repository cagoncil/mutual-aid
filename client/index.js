const toggleBtn = document.getElementById('toggleBtn');
const containerDiv = document.querySelector('.glass');
if (window.matchMedia("(max-width: 600px)").matches) {
    toggleBtn.addEventListener('click', (e) => {
        if (!toggleBtn.classList.contains('collapsed')) containerDiv.style.background = 'rgba(243,201,146, 0.35)';
        else containerDiv.style.background = 'transparent';
    });
};
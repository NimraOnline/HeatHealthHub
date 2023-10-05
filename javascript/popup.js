
const openButton = document.getElementById('openPopup');

const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');

const popup = document.getElementById('popup');
const closeButton = document.getElementById('closePopup');

// Function to open the popup
function openPopup() {
    popup.style.display = 'block';
}

// Function to close the popup
function closePopup() {
    popup.style.display = 'none';
}


function goToLebanon() {
    window.location.href = 'Lebanon.html';
}

// Function to redirect to Page 2
function goToSyria() {
    window.location.href = 'Syria.html';
}

// Event listeners
openButton.addEventListener('click', openPopup);
closeButton.addEventListener('click', closePopup);
button1.addEventListener('click', goToLebanon);
button2.addEventListener('click', goToSyria);

let currentPage = 1;
const totalPages = 4;
let speech = null;
let isSpeaking = false;

if ('speechSynthesis' in window) {
    speech = new SpeechSynthesisUtterance();
    speech.lang = 'zh-CN';
} else {
    console.error('This browser does not support speech synthesis.');
}

function changePage(direction) {
    stopSpeech();
    const oldPage = document.getElementById(`page${currentPage}`);
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const newPage = document.getElementById(`page${currentPage}`);
    
    oldPage.classList.remove('active');
    newPage.classList.add('active');

    updateButtons();
}

function updateButtons() {
    const pages = document.querySelectorAll('.page');
    pages.forEach((page, index) => {
        const pageNumber = index + 1;
        const prevButton = page.querySelector('.navigation button:first-child');
        const nextButton = page.querySelector('.navigation button:last-child');

        if (prevButton) prevButton.disabled = (pageNumber === 1);
        if (nextButton) nextButton.disabled = (pageNumber === totalPages);
    });
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('current-time').textContent = timeString;
}

function toggleSpeech(pageNum) {
    if (!speech) {
        console.error('Speech synthesis is not supported.');
        return;
    }

    const page = document.getElementById(`page${pageNum}`);
    const playButton = page.querySelector('.play-button');

    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        playButton.classList.remove('paused');
    } else {
        const title = page.querySelector('h1').textContent;
        const content = page.querySelector('p').textContent;
        speech.text = title + '. ' + content;
        window.speechSynthesis.speak(speech);
        isSpeaking = true;
        playButton.classList.add('paused');
    }
}

function stopSpeech() {
    if (speech) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        const playButtons = document.querySelectorAll('.play-button');
        playButtons.forEach(button => button.classList.remove('paused'));
    }
}

if (speech) {
    speech.onend = function() {
        isSpeaking = false;
        const playButton = document.querySelector(`#page${currentPage} .play-button`);
        if (playButton) playButton.classList.remove('paused');
    }
}

updateTime();
setInterval(updateTime, 60000);
updateButtons();
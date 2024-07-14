let currentPage = 1;
const totalPages = 4;
let speech = null;
let isSpeaking = false;
let isPaused = false;
let utterance = null;

if ('speechSynthesis' in window) {
    speech = window.speechSynthesis;
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
        if (isPaused) {
            speech.resume();
            isPaused = false;
            playButton.classList.add('paused');
        } else {
            speech.pause();
            isPaused = true;
            playButton.classList.remove('paused');
        }
    } else {
        stopSpeech(); // 确保之前的语音被停止
        const title = page.querySelector('h1').textContent;
        const content = page.querySelector('p').textContent;
        utterance = new SpeechSynthesisUtterance(title + '. ' + content);
        utterance.lang = 'zh-CN';
        
        utterance.onend = function() {
            isSpeaking = false;
            isPaused = false;
            playButton.classList.remove('paused');
        };

        utterance.onerror = function(event) {
            console.error('SpeechSynthesisUtterance error', event);
        };

        speech.speak(utterance);
        isSpeaking = true;
        isPaused = false;
        playButton.classList.add('paused');
    }
}

function stopSpeech() {
    if (speech) {
        speech.cancel();
        isSpeaking = false;
        isPaused = false;
        const playButtons = document.querySelectorAll('.play-button');
        playButtons.forEach(button => button.classList.remove('paused'));
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 60000);
    updateButtons();
});
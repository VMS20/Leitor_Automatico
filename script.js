let synth = window.speechSynthesis;
let utterance;
let paused = false;
let currentWordIndex = 0;
let words = [];

function startReading() {
  const text = document.getElementById("textInput").value;
  if (!text.trim()) return alert("Por favor, insira um texto para ler!");

  stopReading();
  
  words = text.split(/(\s+)/).filter(word => word.trim().length > 0 || word.match(/\s/));
  renderText();
  
  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = parseFloat(document.getElementById("speedControl").value);
  
  utterance.onboundary = function(event) {
    if (event.name === 'word') {
      highlightWord(event.charIndex);
    }
  };
  
  synth.speak(utterance);
}

function renderText() {
  const textDisplay = document.getElementById("textDisplay");
  textDisplay.innerHTML = '';
  
  if (words.length === 0) {
    textDisplay.textContent = "Cole aqui o texto do seu livro...";
    textDisplay.style.color = "#999"; 
    return;
  } else {
    textDisplay.style.color = ""; 
  }
  
  words.forEach((word, index) => {
    const wordSpan = document.createElement('span');
    wordSpan.textContent = word;
    wordSpan.className = 'word';
    wordSpan.id = `word-${index}`;
    textDisplay.appendChild(wordSpan);
  });
}

function highlightWord(charIndex) {
  const previousHighlight = document.querySelector('.highlight');
  if (previousHighlight) {
    previousHighlight.classList.remove('highlight');
  }
  
  let count = 0;
  for (let i = 0; i < words.length; i++) {
    count += words[i].length;
    if (count > charIndex) {
      currentWordIndex = i;
      break;
    }
  }
  
  const currentWord = document.getElementById(`word-${currentWordIndex}`);
  if (currentWord) {
    currentWord.classList.add('highlight');
    
    currentWord.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}

function pauseReading() {
  if (synth.speaking && !synth.paused) {
    synth.pause();
    paused = true;
  }
}

function resumeReading() {
  if (paused) {
    synth.resume();
    paused = false;
  }
}

function stopReading() {
  if (synth.speaking) {
    synth.cancel();
  }
  const highlight = document.querySelector('.highlight');
  if (highlight) {
    highlight.classList.remove('highlight');
  }
}

function changeSpeed() {
  const speed = parseFloat(document.getElementById("speedControl").value);
  if (utterance) {
    utterance.rate = speed;
    if (synth.speaking && !synth.paused) {
      const wasPaused = paused;
      synth.cancel();
      if (!wasPaused) {
        synth.speak(utterance);
      }
    }
  }
}

document.getElementById('themeToggle').addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  this.textContent = isDark ? ' Light' : ' Dark';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('themeToggle').textContent = ' Light';
  }
});
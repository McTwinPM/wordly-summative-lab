//Fetching from Dictionary API
async function fetchDictionaryData(word) {
    const api = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error('word not found');
        }
        const data = await response.json();
        displayDefinition(data);
        return data;
    } catch (error) {
        displayError(error.message);
        throw error;
    }
}
//Set up event listeners
function setupEventListeners() {
    const wordSubmit = document.getElementById('word-submit');
    if (wordSubmit) {
        wordSubmit.addEventListener("click", function (event) {
            event.preventDefault();
            const wordInput = document.getElementById('word-box');
            const word = wordInput.value.trim();
            if (!word) {
                displayError('Please enter a word');// Error message for no input
                return;
            }
            displayError(''); // Clear previous error message
            wordInput.value = ''; // Clear the input field
            fetchDictionaryData(word)
        });
    }
}
setupEventListeners();

// function to display the definition of the word
function displayDefinition(data) {
    const definitionDisplay = document.getElementById('definition-display');
    const audiolink = data[0].phonetics.find(p => p.audio)?.audio
    const allSynonyms = data[0].meanings
        .flatMap(meaning => meaning.definitions)
        .flatMap(definition => definition.synonyms)
        .filter(synonym => synonym !== "");
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.classList.add('hidden');
    }
    if (!data || !data.length) {
        console.error('No data found for the word');
        displayError('No data found for the word');
        return;
    }
        
    if (!definitionDisplay) {
        console.error('Definition display element not found');
        return;
    }
    definitionDisplay.innerHTML = `
        <h2>${data[0].word}</h2>
        <p>${data[0].phonetic} ${audiolink ? `<button id="play-audio">🔊 Play Pronunciation</button>` : ''}</p> 
        <p>Definitions: 
        <ol>${data[0].meanings
            .map(meaning =>`<li>${meaning.definitions[0].definition}</li>`)
                .join("")}
        </ol></p>
        <p>Synonyms: ${allSynonyms.length ? allSynonyms.join(", ") : "None"}</p>
        </p>
    `;
    if (audiolink) {
        document.getElementById('play-audio').onclick = () => {
            new Audio(audiolink).play();
        };
    }
}

// Display error message
function displayError(message){
    const errorMessage = document.getElementById('error-message');
    if (!errorMessage) {
        console.error('Error message element not found');
        return;
    }
    errorMessage.classList.remove('hidden');
    errorMessage.textContent = `${message}`;
}
module.exports = {
    fetchDictionaryData,
    displayDefinition,
    displayError,
    setupEventListeners
};
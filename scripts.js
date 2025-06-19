// fetch("https://api.dictionaryapi.dev/api/v2/entries/en/<word>")
// .then(response => {
//     if (!response.ok) {
//         throw new Error("Network response was not ok");
//     }
//     return response.json();
// })
// .then(data => {
//     const word = data[0].word;
//     const phonetic = data[0].phonetic || "No phonetic available";
//     const definitions = data[0].meanings.map(meaning => meaning.definitions[0].definition).join(", ");
    
//     document.getElementById("word").textContent = word;
//     document.getElementById("phonetic").textContent = phonetic;
//     document.getElementById("definitions").textContent = definitions;
// })
// .catch(error => {
//     console.error("There was a problem with the fetch operation:", error);
//     document.getElementById("word").textContent = "Error fetching word";
//     document.getElementById("phonetic").textContent = "";
//     document.getElementById("definitions").textContent = "";
// });
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
        console.error('Error fetching dictionary data:', error);
        displayError(error.message);
        throw error;
    }
}

function displayDefinition(data) {
    const definitionDisplay = document.getElementById('definition-display');
    if (!definitionDisplay) {
        console.error('Definition display element not found');
        return;
    }
    definitionDisplay.innerHTML = `
        <h2>${data[0].word}</h2>
        <p>Phonetic: ${data[0].phonetic}</p>
        <p>Definition: ${data[0].meanings.map(meaning => meaning.definitions[0].definition).join(", ")}</p>
    `;
}

document.getElementById('word-submit').addEventListener("click", function (event) {
    event.preventDefault();
        const wordInput = document.getElementById('word-box');
        const word = wordInput.value.trim();
        if (!word) {
            displayError('Please enter a word');
            return;
        }
        displayError(''); // Clear previous error message
        wordInput.value = ''; // Clear the input field
        fetchDictionaryData(word)
})

function displayError(message){
    const errorMessage = document.getElementById('error-message');
    if (!errorMessage) {
        console.error('Error message element not found');
        return;
    }
    errorMessage.classList.remove('hidden');
    errorMessage.textContent = `${message}`;
}
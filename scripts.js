fetch("https://api.dictionaryapi.dev/api/v2/entries/en/<word>")
.then(response => {
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
})
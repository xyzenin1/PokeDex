const myInput = document.getElementById('userInput');

function getPokemon() {
    const inputValue = myInput.value.trim();

    if (!inputValue) {
        console.error("No input value was read");
        return;
    }

    const isValidInput = /^[a-zA-Z0-9-]+$/.test(inputValue);

    if (!isValidInput) {
        console.error("Please enter a valid Pokemon ID (number) or name (letters only)");
        return;
    }

    try {
        fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}/`)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    }
    catch(error) {
        console.error(error);
    }
}

myInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        getPokemon();
    }

});
const myInput = document.getElementById('userInput');

async function getPokemon() {
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

        const pokemonName = document.getElementById("pokemonName");
        
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}/`)
 
            if (!response.ok) {
                throw new Error("Resource could not be fetched");
            }
            
            const data = await response.json();
            console.log(data);      // data will be shown in console
            
            // for image

            const pokemonSprite = data.sprites.front_default;
            const imageElement = document.getElementById("pokemonSprite");
            const pokeball = document.getElementById("pokeball");
            
            if (pokemonSprite) {
                pokeball.style.display = "none";
                imageElement.src = pokemonSprite;
                imageElement.style.display = "block";
            } 
            else {
                imageElement.style.display = "none";
                pokeball.style.display = "block";
            }

            // for name
            const name = document.getElementById("name");
            name.textContent = `Name: ${data.name}`;

            // for weight
            const weight = document.getElementById("weight");
            const newWeight = (data.weight * 100) * 0.0022;
            weight.textContent = `Weight: ${newWeight.toFixed(2)} lbs`;

            // for height
            const height = document.getElementById("height");
            const heightInMeters = data.height / 10;
            const heightInFeet = heightInMeters * 3.28084;      // total feet

            const feet = Math.floor(heightInFeet);
            const inches = Math.round((heightInFeet - feet) * 12);      // feet to inches conversion
            height.textContent = `Height: ${feet}'${inches}''`;

            const type = document.getElementById("type");
            const typeNames = data.types.map(typeInfo => {
                const typeName = typeInfo.type.name;
                return typeName.charAt(0).toUpperCase() + typeName.slice(1);
            }).join(', ');
            type.textContent = `Type: ${typeNames}`;

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
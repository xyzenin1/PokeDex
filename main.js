const myInput = document.getElementById('userInput');

let twoTimesWeakness = [];
let fourTimesWeakness = [];


const blueLight = document.getElementById('blueCircle');
const lightUpColors = ['#005956', '#00fcf4'];

let colorIndex = 0;

function changeBlueLightColor() {
    blueLight.style.backgroundColor = lightUpColors[colorIndex];
    colorIndex = (colorIndex + 1) % lightUpColors.length;       // cycle through lightUpColors
}

const intervalId = setInterval(changeBlueLightColor, 1000);

async function getPokemon() {
    const inputValue = myInput.value.trim();
    
    // if function is called, unhide pokemonInfo
    const pokemonInfoElements = document.getElementsByClassName('pokemonInfo');
    for (let i = 0; i < pokemonInfoElements.length; i++) {
        pokemonInfoElements[i].style.display = 'block';
    }

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
            });
            type.textContent = `Type: ${typeNames.join(', ')}`;

            // for weaknesses, resistances, and immunities

            await getTypeEffectiveness(data.types);

    }
    catch(error) {
        console.error(error);
    }
}

async function getTypeEffectiveness(pokemonTypes) {

    const weaknessesElement = document.getElementById("weaknesses");
    const resistancesElement = document.getElementById("resistances");
    const immunitiesElement = document.getElementById("immunities");

    try {
        // all weaknesses, resistances, immunities
        let allWeaknesses = new Set();
        let allResistances = new Set();
        let allImmunities = new Set();

        // for specific type effectiveness
        let typeEffectiveness = {};

        const allTypes = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", 
                         "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", 
                         "dragon", "dark", "steel", "fairy"];
        
        // start each type effectiveness at 1
        allTypes.forEach(type => {
            typeEffectiveness[type] = 1;
        });

        for (let i = 0; i < pokemonTypes.length; i++) {
            const typeInfo = pokemonTypes[i];
            console.log(`Fetching data type: ${typeInfo.type.name}`);
            const typeResponse = await fetch(typeInfo.type.url);
            const typeData = await typeResponse.json();

            const weakTo = typeData.damage_relations.double_damage_from;
            weakTo.forEach(weakness => {
                allWeaknesses.add(weakness.name);
                typeEffectiveness[weakness.name] *= 2;
            });

            const resistantTo = typeData.damage_relations.half_damage_from;
            resistantTo.forEach(resistance => {
                allResistances.add(resistance.name);
            });

            const immuneTo = typeData.damage_relations.no_damage_from;
            immuneTo.forEach(immune => {
                allImmunities.add(immune.name);
            });
        }

        // if (allWeaknesses.size > 0) {
        //     const weaknessArray = Array.from(allWeaknesses).map(weakness =>
        //         weakness.charAt(0).toUpperCase() + weakness.slice(1)
        //     );
        //     weaknessesElement.textContent = `Weaknesses: ${weaknessArray.join(', ')}`;
        // }
        // else {
        //     weaknessesElement.textContent = `Weaknesses: none`;
        // }

        twoTimesWeakness = [];
        fourTimesWeakness = [];

        // Seperate weaknesses with multipliers
        Object.keys(typeEffectiveness).forEach(type => {
            if (typeEffectiveness[type] === 4) {
                fourTimesWeakness.push(type.charAt(0).toUpperCase() + type.slice(1));
            }
            else if (typeEffectiveness[type] === 2) {
                twoTimesWeakness.push(type.charAt(0).toUpperCase() + type.slice(1));
            }
        });


        let weaknessText = "Weaknesses: ";
        
        // if fourTimes array is greater than 0, add in to textContent
        // if twoTimes element is detected after fourTimes array, add comma to seperate
        if (fourTimesWeakness.length > 0) {
            weaknessText += fourTimesWeakness.map(type => `${type} (4x)`).join(', ');
            if (twoTimesWeakness.length > 0) {
                weaknessText += ", ";
            }
        }
        
        if (twoTimesWeakness.length > 0) {
            weaknessText += twoTimesWeakness.map(type => `${type} (2x)`).join(', ');
        }
        
        if (fourTimesWeakness.length === 0 && twoTimesWeakness.length === 0) {
            weaknessText += "None";
        }

        weaknessesElement.textContent = weaknessText;


        // For now it will only print out resistances
        if (allResistances.size > 0) {
            const resistanceArray = Array.from(allResistances).map(resistance =>
                resistance.charAt(0).toUpperCase() + resistance.slice(1)
            );
            resistancesElement.textContent = `Resistances: ${resistanceArray.join(', ')}`;
        }
        else {
            resistancesElement.textContent = `Resistances: none`;
        }

        if (allImmunities.size > 0) {
            const immunityArray = Array.from(allImmunities).map(immunity =>
                immunity.charAt(0).toUpperCase() + immunity.slice(1)
            );
            immunitiesElement.textContent = `Immunities: ${immunityArray.join(', ')}`;
        }
        else {
            immunitiesElement.textContent = `Immunities: None`;
        }

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
const youtubeApiKey = 'add_your_own';

async function searchYoutube(pokemonName) {
    const competitive = document.getElementById('competitive').checked;
    const shinyhunt = document.getElementById('shinyhunt').checked;

    const selectedGameType = document.querySelector('input[name="gameType"]:checked');
    const gameType = selectedGameType ? selectedGameType.value : null;


    const terms = []
    if (competitive) {
        terms.push("best competitive build guide");
    }
    if (shinyhunt) {
        terms.push(`where to shiny hunt ${name_global}`)
    }
    


    if (gameType == 'pokemon_go') {
        terms.push("pokemon go");
    }
    if (gameType == 'scarlet_violet') {
        terms.push("pokemon scarlet violet");
    }
    if (gameType == 'champions') {
        terms.push("pokemon champions");
    }
    if (gameType == 'lets_go') {
        terms.push("pokemon lets go pikachu eevee");
    }
    if (gameType == 'lore') {
        terms.push("interesting facts");
    }

    const query = encodeURIComponent(`${pokemonName} ${terms.join(' ')}`);
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&key=${youtubeApiKey}`);
    const data = await response.json();
    const videoId = data.items[0]?.id?.videoId;

    if (videoId) {
        const videoContainer = document.getElementById("videoContainer");
        videoContainer.innerHTML = `
            <iframe
                class="youtubeEmbed"
                src="https://www.youtube.com/embed/${videoId}"
                frameborder="0"
                allowfullscreen>
            </iframe>
        `;

        videoContainer.style.display = "flex";
    }
}
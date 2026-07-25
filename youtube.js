const youtubeApiKey = 'AIzaSyDKuewCRmnZvG9SlcivertZRBZR92QMZFU';

async function searchYoutube(pokemonName) {
    const query = encodeURIComponent(`${pokemonName} best competitive build`);
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
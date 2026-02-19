async function loadAnimes() {
    const container = document.getElementById('anime-list');
    
    try {
        const response = await fetch('animes.json');
        if (!response.ok) throw new Error('Erro ao carregar o arquivo JSON');
        
        const animes = await response.json();

        animes.forEach(anime => {
            const animeDiv = document.createElement('div');
            animeDiv.className = 'anime';

            let linksHtml = '';

            if (anime.linkCrunchyroll) {
                linksHtml += `<li><a href="${anime.linkCrunchyroll}" target="_blank">Crunchyroll</a></li>`;
            }

            if (anime.linkAnimeKai) {
                linksHtml += `<li><a href="${anime.linkAnimeKai}" target="_blank">Anime Kai</a></li>`;
            }

            if (anime.linkOutro && anime.nomeOutro) {
                linksHtml += `<li><a href="${anime.linkOutro}" target="_blank">${anime.nomeOutro}</a></li>`;
            }
            
            animeDiv.innerHTML = `
                <h2>${anime.titulo}</h2>
                <img src="${anime.imagem}" alt="${anime.titulo}" class="anime-image">
                <p>${anime.descricao}</p>
                <ul class="botao_animes">
                    ${linksHtml}
                </ul>
                `;

            container.appendChild(animeDiv);
        });
    } catch (error) {
        console.error('Erro na requisição:', error);
        container.innerHeTML = '<p>Erro ao carregar as recomendações</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadAnimes);
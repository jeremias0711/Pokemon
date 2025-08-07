// Función para obtener datos de un Pokémon específico
async function fetchPokemonData(pokemonName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!response.ok) {
            throw new Error('Pokémon no encontrado');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener datos del Pokémon:', error);
        return null;
    }
}

// Función para obtener el color de un tipo de Pokémon
function getTypeColor(type) {
    const colors = {
        electric: '#F7D02C',
        fire: '#EE8130',
        water: '#6390F0',
        grass: '#7AC74C',
        normal: '#A8A878',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD',
        ice: '#96D9D6'
    };
    return colors[type] || '#68A090';
}

// Función para mostrar los datos del Pokémon en la carta
function displayPokemonData(pokemon) {
    if (!pokemon) return;

    // Información básica
    document.getElementById('pokemonName').textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    document.getElementById('pokemonId').textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
    document.getElementById('pokemonImage').src = pokemon.sprites.other['official-artwork'].front_default;
    document.getElementById('pokemonImage').alt = pokemon.name;

    // Tipos
    const typesContainer = document.getElementById('pokemonTypes');
    typesContainer.innerHTML = '';
    pokemon.types.forEach(typeInfo => {
        const typeElement = document.createElement('span');
        typeElement.className = 'type-badge';
        typeElement.textContent = typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1);
        typeElement.style.backgroundColor = getTypeColor(typeInfo.type.name);
        typesContainer.appendChild(typeElement);
    });

    // Estadísticas
    const statsContainer = document.getElementById('pokemonStats');
    statsContainer.innerHTML = '';
    pokemon.stats.forEach(statInfo => {
        const statElement = document.createElement('div');
        statElement.className = 'stat-item';
        
        const statName = statInfo.stat.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        const statValue = statInfo.base_stat;
        const statPercent = Math.min((statValue / 150) * 100, 100); // Normalizado a 150 como máximo
        
        statElement.innerHTML = `
            <div class="stat-info">
                <span class="stat-name">${statName}</span>
                <span class="stat-value">${statValue}</span>
            </div>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${statPercent}%"></div>
            </div>
        `;
        statsContainer.appendChild(statElement);
    });

    // Habilidades
    const abilitiesContainer = document.getElementById('pokemonAbilities');
    abilitiesContainer.innerHTML = '';
    pokemon.abilities.forEach(abilityInfo => {
        const abilityElement = document.createElement('span');
        abilityElement.className = 'ability-badge';
        if (abilityInfo.is_hidden) {
            abilityElement.classList.add('hidden-ability');
        }
        const abilityName = abilityInfo.ability.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        abilityElement.textContent = abilityName;
        abilitiesContainer.appendChild(abilityElement);
    });

    // Características físicas
    document.getElementById('pokemonHeight').textContent = `${pokemon.height / 10} m`;
    document.getElementById('pokemonWeight').textContent = `${pokemon.weight / 10} kg`;
    document.getElementById('pokemonExperience').textContent = `${pokemon.base_experience} XP`;
}

// Función para determinar qué Pokémon cargar según la página
function getPokemonForPage() {
    const currentPage = window.location.pathname.split('/').pop();
    switch(currentPage) {
        case 'pokemon-uno.html':
            return 'pikachu';
        case 'pokemon-dos.html':
            return 'charizard';
        case 'pokemon-tres.html':
            return 'blastoise';
        default:
            return 'pikachu';
    }
}

// Inicializar la página cuando se carga
document.addEventListener('DOMContentLoaded', async function() {
    const pokemonName = getPokemonForPage();
    const pokemonData = await fetchPokemonData(pokemonName);
    displayPokemonData(pokemonData);
});
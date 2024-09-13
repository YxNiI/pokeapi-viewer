const maybePokeInfos = sessionStorage.getItem("pokeInfos");
const maybePokeCards = sessionStorage.getItem("pokeCards");
const pokeInfos = (maybePokeInfos !== null) ? JSON.parse(maybePokeInfos) : [];
const pokeCards = (maybePokeCards !== null) ? JSON.parse(maybePokeCards) : [];

searchPokeInfo("nihilego").then(createPokeCard);
searchPokeInfo("celesteela").then(createPokeCard);
searchPokeInfo("weezing").then(createPokeCard);

document.getElementById("search-button").addEventListener("click", () =>
{
    searchPokeInfo(document.getElementById("search-bar").value).then(createPokeCard);
});

async function searchPokeInfo(pokeName)
{
    const pokeInfosFiltered = pokeInfos.filter(pokeCard => pokeCard.name === pokeName);
    let result = "pokemon-search-error";

    if (pokeInfosFiltered.length > 0)
    {
        result = pokeInfosFiltered[0].pokeInfo;
    } else
    {
        try
        {
            result = await new Promise((resolve, reject) =>
            {
                const getRequest = new XMLHttpRequest();
                getRequest.open("GET", ("https://pokeapi.co/api/v2/pokemon/" + pokeName));
                getRequest.responseType = "json";
                getRequest.send();
                getRequest.onload = function ()
                {
                    if ((getRequest.readyState === 4) && (getRequest.status === 200))
                    {
                        resolve(getRequest.response);

                    } else
                    {
                        reject(`error-code: ${getRequest.status}, message: ${getRequest.statusText}`);
                    }
                }
            });
        } catch (error)
        {
            console.error(error);
        }
    }

    return result
}

function createPokeCard(pokeInfo)
{
    const card = document.createElement("div");
    card.classList.add("poke-card");

    const sprite = document.createElement("img");
    sprite.classList.add("sprite");
    sprite.style.display = "block";
    sprite.src = pokeInfo.sprites.front_default;
    card.appendChild(sprite);

    const infos = [];
    infos.push(
        "Name: " + pokeInfo.name.charAt(0).toUpperCase() + pokeInfo.species.name.slice(1));
    if (pokeInfo.name !== pokeInfo.species.name)
    {
        infos.push(
            "Species: " + pokeInfo.species.name.charAt(0).toUpperCase() + pokeInfo.species.name.slice(1));
    }
    infos.push(
        "Types: " + pokeInfo.types.map(pokemonType => pokemonType.type.name).join(", "));
    infos.push(
        "Size: " + pokeInfo.height);
    infos.push(
        "Abilities: " + pokeInfo.abilities.map(pokemonAbility => pokemonAbility.ability.name).join(", "));
    if (Array.isArray(pokeInfo.forms) && (pokeInfo.forms.length > 1))
    {
        infos.push("Forms: " + pokeInfo.forms.map(pokemonForm => pokemonForm.name).join(", "));
    }
    infos.push("Stats: " + pokeInfo.stats.map(pokemonStat => pokemonStat.stat.name + ": \"" + pokemonStat.base_stat + "\"").join(", "));
    infos.push("Moves (last-three): " + pokeInfo.moves.slice((pokeInfo.moves.length - 3)).map(pokemonMove => pokemonMove.move.name).join(", "));
    infos.forEach(info =>
    {
        const pokeInfoParagraph = document.createElement(
            "p");
        pokeInfoParagraph.textContent = info;
        card.appendChild(
            pokeInfoParagraph);
    });

    pokeInfos.unshift({name: pokeInfo.name, pokeInfo: pokeInfo});
    pokeCards.unshift({name: pokeInfo.name, pokeCard: card});
    sessionStorage.setItem("pokeInfos", JSON.stringify(pokeInfos));
    sessionStorage.setItem("pokeCards", JSON.stringify(pokeCards));

    document.getElementById("card-viewer").prepend(card);
}
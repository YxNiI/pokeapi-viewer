const maybePokeCards = sessionStorage.getItem("pokeInfos");
const pokeInfos = (maybePokeCards !== null) ? JSON.parse(maybePokeCards) : [];

searchPokeInfo("nihilego").then(createPokeCard);
searchPokeInfo("celesteela").then(createPokeCard);
searchPokeInfo("weezing").then(createPokeCard);

document.getElementById("search-button").addEventListener("click", () =>
{
    searchPokeInfo(document.getElementById("search-bar").value).then(createPokeCard);
});

async function searchPokeInfo(name)
{
    const pokeCardsFiltered = pokeInfos.filter(pokeCard =>
    {
        console.log(pokeCard.name + ' ' + name);
        return pokeCard.name === name
    });
    let result = "pokemon-search-error";

    if (pokeCardsFiltered.length > 0)
    {
        console.log("blub")
        result = pokeCardsFiltered[0].pokeInfo;
    } else
    {
        try
        {
            console.log("blub-blub");
            result = await new Promise((resolve, reject) =>
            {
                const getRequest = new XMLHttpRequest();
                getRequest.open("GET", ("https://pokeapi.co/api/v2/pokemon/" + name));
                getRequest.responseType = "json";
                getRequest.send();
                getRequest.onload = function ()
                {
                    if ((getRequest.readyState === 4) && (getRequest.status === 200))
                    {
                        resolve(getRequest.response);

                    } else
                    {
                        reject(
                            `error-code: ${getRequest.status}, message: ${getRequest.statusText}`);
                    }
                }
            });
        } catch
            (error)
        {
            console.error(error);
        }
    }

    return result
}

function createPokeCard(pokeInfo)
{
    const card = document.createElement("div");
    card.classList.add("poke-card")

    const sprite = document.createElement("img");
    sprite.classList.add("sprite");
    sprite.style.display = "block";
    sprite.src =
        pokeInfo.sprites.front_default;
    card.appendChild(sprite);

    const info = [];
    info.push(
        "Name: " + pokeInfo.name.charAt(0).toUpperCase() + pokeInfo.species.name.slice(1));
    if (pokeInfo.name !== pokeInfo.species.name)
    {
        info.push(
            "Species: " + pokeInfo.species.name.charAt(0).toUpperCase() + pokeInfo.species.name.slice(1));
    }
    info.push(
        "Types: " + pokeInfo.types.map(pokemonType => pokemonType.type.name).join(", "));
    info.push(
        "Size: " + pokeInfo.height);
    info.push(
        "Abilities: " + pokeInfo.abilities.map(pokemonAbility => pokemonAbility.ability.name).join(", "));
    if (Array.isArray(pokeInfo.forms) && (pokeInfo.forms.length > 1))
    {
        info.push("Forms: " + pokeInfo.forms.map(pokemonForm => pokemonForm.name).join(", "));
    }
    info.push("Stats: " + pokeInfo.stats.map(pokemonStat => pokemonStat.stat.name + ": \"" + pokemonStat.base_stat + "\"").join(", "));
    info.push("Moves (last-three): " + pokeInfo.moves.slice((pokeInfo.moves.length - 3)).map(pokemonMove => pokemonMove.move.name).join(", "));
    info.forEach(
        info =>
        {
            const pokeInfoParagraph = document.createElement(
                "p");
            pokeInfoParagraph.textContent = info;
            card.appendChild(
                pokeInfoParagraph);
        });

    document.getElementById("card-viewer").prepend(card);
    pokeInfos.unshift({name: pokeInfo.name, pokeInfo: pokeInfo});
    sessionStorage.setItem("pokeInfos", JSON.stringify(pokeInfos));
}
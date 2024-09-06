async function searchPokeInfo(name)
{
    let result = "pokemon-search-error";

    try
    {
        result = await new Promise((resolve, reject) =>
                                   {
                                       const getRequest = new XMLHttpRequest();
                                       getRequest.open("GET", ("https://pokeapi.co/api/v2/pokemon/" + name));
                                       getRequest.responseType = "json";
                                       getRequest.send();
                                       getRequest.onload = function()
                                       {
                                           if ((getRequest.readyState === 4) && (getRequest.status === 200))
                                           {
                                               resolve(getRequest.response);
                                           }
                                           else
                                           {
                                               reject(
                                                   `error-code: ${getRequest.status}, message: ${getRequest.statusText}`);
                                           }
                                       }
                                   });
    }
    catch
        (error)
    {
        console.error(error);
    }

    return result
}

document.getElementById("search-button").addEventListener("click", () =>
{
    searchPokeInfo(document.getElementById("search-bar").value).then((pokeInfo) =>
                                                                     {
                                                                         const sprite = document.createElement("img");
                                                                         sprite.style.display = "block";
                                                                         sprite.src =
                                                                             pokeInfo.sprites.front_default;
                                                                         document.body.appendChild(sprite);

                                                                         const pokeInfos = [];
                                                                         pokeInfos.push(
                                                                             "Name: " + pokeInfo.name);
                                                                         pokeInfos.push(
                                                                             "Species: " + pokeInfo.species.name);
                                                                         pokeInfos.push(
                                                                             "Types: " + pokeInfo.types.map(
                                                                                           pokemonType => pokemonType.type.name)
                                                                                                 .join(", "));
                                                                         pokeInfos.push(
                                                                             "Size: " + pokeInfo.height);
                                                                         pokeInfos.push(
                                                                             "Abilities: "
                                                                             + pokeInfo.abilities.map(
                                                                                 pokemonAbility => pokemonAbility.ability.name)
                                                                                       .join(", "));
                                                                         pokeInfos.forEach(
                                                                             info =>
                                                                             {
                                                                                 const pokeInfoParagraph = document.createElement(
                                                                                     "p");
                                                                                 pokeInfoParagraph.textContent = info;
                                                                                 document.body.appendChild(
                                                                                     pokeInfoParagraph);
                                                                             });
                                                                     });
});
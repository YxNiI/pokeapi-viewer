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
    searchPokeInfo(document.getElementById("search-bar").value).then((pokeInfoValue) =>
                                                                     {
                                                                         const pokeInfoArr = [];
                                                                         pokeInfoArr.push(
                                                                             "Name: " + pokeInfoValue.name);
                                                                         pokeInfoArr.push(
                                                                             "Species: " + pokeInfoValue.species.name);
                                                                         pokeInfoArr.push(
                                                                             "Types: " + pokeInfoValue.types.map(
                                                                                           pokemonType => pokemonType.type.name)
                                                                                                      .join(", "));
                                                                         pokeInfoArr.push(
                                                                             "Size: " + pokeInfoValue.height);
                                                                         pokeInfoArr.push(
                                                                             "Abilities: "
                                                                             + pokeInfoValue.abilities.map(
                                                                                 pokemonAbility => pokemonAbility.ability.name)
                                                                                            .join(", "));
                                                                         pokeInfoArr.forEach(
                                                                             foo =>
                                                                             {
                                                                                 const pokeInfoParagraph = document.createElement(
                                                                                     "p");
                                                                                 pokeInfoParagraph.textContent = foo;
                                                                                 document.body.appendChild(
                                                                                     pokeInfoParagraph);
                                                                             });
                                                                     });
});
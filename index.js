async function searchPokeInfo(name)
{
    let result = "pokemon-search-error";

    try
    {
        result = await new Promise((resolve, reject) =>
                                   {
                                       const getRequest = new XMLHttpRequest();
                                       getRequest.open("GET", ("https://pokeapi.co/api/v2/pokemon/" + name));
                                       getRequest.send();
                                       getRequest.onload = function()
                                       {
                                           if ((getRequest.readyState === 4) && (getRequest.status === 200))
                                           {
                                               resolve(getRequest.responseText);
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
    const pokeInfo = searchPokeInfo(document.getElementById("search-bar").value);
    const pokeInfoParagraph = document.createElement("p");
    pokeInfo.then((pokeInfoValue) =>
                  {
                      pokeInfoParagraph.textContent = pokeInfoValue
                  });
    document.body.appendChild(pokeInfoParagraph);
});
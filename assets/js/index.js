"use strict";

const lancerRecherche = (data, motCle) =>
{
    APP.motCle = motCle;

    if (motCle.length != 0) 
    {
        APP.resultatRechercheRecette = new Set([]);

        const callback = recette => 
        {
            let recetteTexte = recette.ingredients.map(ingredient => ingredient.ingredient);
            recetteTexte.concat(recette.ustensils);
            recetteTexte.push(recette.name);
            recetteTexte = recetteTexte.join(" ").toLowerCase();
            const recetteExiste = recetteTexte.includes(motCle.toLowerCase());
            if (recetteExiste) APP.resultatRechercheRecette.add(recette);
        }

        data.forEach(callback);
        APP.resultatRechercheRecette = appliquerFiltres(APP.resultatRechercheRecette);
    }
    else
    {
        APP.resultatRechercheRecette = appliquerFiltres(data)
    }

    afficherRecettes(APP.resultatRechercheRecette)
    miseAjourFiltres(APP.resultatRechercheRecette)
    afficherTags()
}

const appliquerFiltres = (data) => 
{
    // Si aucun filtre séléectionné alors ne rien faire
    if (APP.donneesFiltresSelected.ingredients.size === 0 && 
        APP.donneesFiltresSelected.ustensils.size === 0 &&
        APP.donneesFiltresSelected.appareils.size === 0
    ) { return data }

    const resultIngredients = new Set([]);
    const resultUstensils = new Set([]);
    const resultAppareils = new Set([]);
    const result = new Set([]);

    // Filtrage du résultat en fonction des selections
    data.forEach(recipe => 
    {
        if (APP.donneesFiltresSelected.ingredients.size > 0)
        {
            const ings = recipe.ingredients.map(ing => ing.ingredient.toLowerCase());

            if ([...APP.donneesFiltresSelected.ingredients].every(el => ings.includes(el.toLowerCase())))
            {
                resultIngredients.add(recipe)
            }
        }
        
        if (APP.donneesFiltresSelected.ustensils.size > 0)
        {
            const ustens = recipe.ustensils.map(usten => usten.toLowerCase());

            if ([...APP.donneesFiltresSelected.ustensils].every(el => ustens.includes(el.toLowerCase())))
            {
                resultUstensils.add(recipe)
            }

        }
        
        if (APP.donneesFiltresSelected.appareils.size > 0)
        {
            const apps = recipe.appliance.toLowerCase();
            const appsFilter = [...APP.donneesFiltresSelected.appareils].map(app => app.toLowerCase());

            if (appsFilter.includes(apps.toLowerCase()))
            {
                resultAppareils.add(recipe)
            }

        }
        
    })
    
    const list = [...resultIngredients, ...resultUstensils, ...resultAppareils];
    const seen = new Set();

    list.forEach(recipe => 
    {
        if (seen.has(recipe)) result.add(recipe)
        else seen.add(recipe)
    });

    afficherNombreRecette(result)
    return result.size > 0 ? result : seen;
}

const afficherNombreRecette = (recettes) => {
    const recetteCount = document.getElementById("recette-count");
    recetteCount.innerText = String(recettes.size).padStart(2, "0") + " recette(s)";
}

const miseAjourFiltres = (data) => 
{
    if (data.size > 0)
    {
        // Initialisation des filtres
        APP.donnees_filtres.ingredients = new Set([]);
        APP.donnees_filtres.ustensils = new Set([]);
        APP.donnees_filtres.appareils = new Set([]);

        const callback = recette =>
        {
            recette.ingredients.forEach(ingredient => APP.donnees_filtres.ingredients.add(ingredient.ingredient.toLowerCase()));
            recette.ustensils.forEach(ustensil => APP.donnees_filtres.ustensils.add(ustensil.toLowerCase()));
            APP.donnees_filtres.appareils.add(recette.appliance.toLowerCase());
        }

        data.forEach(callback);
    }
    
    afficherDropdownIngredientsData(APP.donnees_filtres.ingredients);
    afficherDropdownUstensilsData(APP.donnees_filtres.ustensils);
    afficherDropdownAppareilsData(APP.donnees_filtres.appareils);
}

const resetTags = () => {
    const tagsRender = document.getElementById("tags-render");
    tagsRender.innerHTML="";
    return tagsRender;
}

const afficherTags = () => 
{
    const tagsRender = resetTags();

    const addTag = tag => 
    {
        const buttonTag = document.createElement("button");
        const labelTag = document.createElement("span");
        labelTag.innerText = tag;
        const iconCloseTag = document.createElement("i");
        iconCloseTag.setAttribute("class", "fa fa-times")

        iconCloseTag.addEventListener("click", ($event) => 
        {
            const ingExist = APP.donneesFiltresSelected.ingredients.delete(tag);
            const ustExist = APP.donneesFiltresSelected.ustensils.delete(tag);
            const appExist = APP.donneesFiltresSelected.appareils.delete(tag);

            if (ingExist) 
            {
                const dropdownIngredientsData = document.getElementById("dropdown-filter-data-ingredients");
                const buttonList = dropdownIngredientsData.querySelectorAll("button");

                buttonList.forEach(button => 
                {
                    const span = button.querySelector("span");
                    const closeIcon = button.querySelector("i");

                    if (span.innerText.toLowerCase() === tag)
                    {
                        closeIcon.classList.add("d-none")
                        button.classList.remove("active")
                        button.classList.remove("fw-bold")
                        button.classList.remove("fst-italic")
                    }
                })
            }

            if (ustExist) 
            {
                const dropdownUstensilsData = document.getElementById("dropdown-filter-data-ustensils");
                const buttonList = dropdownUstensilsData.querySelectorAll("button");

                buttonList.forEach(button => 
                {
                    const span = button.querySelector("span");
                    const closeIcon = button.querySelector("i");
                    
                    if (span.innerText.toLowerCase() === tag)
                    {
                        closeIcon.classList.add("d-none")
                        button.classList.remove("active")
                        button.classList.remove("fw-bold")
                        button.classList.remove("fst-italic")
                    }
                })
            }

            if (appExist) 
            {
                const dropdownAppareilsData = document.getElementById("dropdown-filter-data-appareils");
                const buttonList = dropdownAppareilsData.querySelectorAll("button");

                buttonList.forEach(button => 
                {
                    const span = button.querySelector("span");
                    const closeIcon = button.querySelector("i");
                    
                    if (span.innerText.toLowerCase() === tag)
                    {
                        closeIcon.classList.add("d-none")
                        button.classList.remove("active")
                        button.classList.remove("fw-bold")
                        button.classList.remove("fst-italic")
                    }
                })
            }

            lancerRecherche(APP.recettes, APP.motCle);
        })
        
        buttonTag.appendChild(labelTag)
        buttonTag.appendChild(iconCloseTag)
        tagsRender.appendChild(buttonTag);
    }

    APP.donneesFiltresSelected.ingredients.forEach(addTag);
    APP.donneesFiltresSelected.ustensils.forEach(addTag);
    APP.donneesFiltresSelected.appareils.forEach(addTag);
}

const afficherRecettes = (data) => {
    const recettesRender = document.getElementById("recettes-render");
    recettesRender.innerHTML="";

    afficherNombreRecette(data)

    if ("content" in document.createElement("template")) 
    {
        const templateRecette = document.getElementById("recette-template");
        const templateIngredientItem = document.getElementById("ingredient-item-template");

        const callback = recette => 
        {
            const cloneTemplateRecette = templateRecette.content.querySelector("div.recette-item").cloneNode(true);
            cloneTemplateRecette.innerHTML = cloneTemplateRecette.innerHTML.replaceAll("${time}", recette.time)
            cloneTemplateRecette.innerHTML = cloneTemplateRecette.innerHTML.replaceAll("${image}", recette.image)
            cloneTemplateRecette.innerHTML = cloneTemplateRecette.innerHTML.replaceAll("${name}", recette.name)
            cloneTemplateRecette.innerHTML = cloneTemplateRecette.innerHTML.replaceAll("${description}", recette.description)

            const recettesIngredientsContainer = cloneTemplateRecette.querySelector("#recette-ingredients");

            recette.ingredients.forEach(ing => 
            {
                const cloneTemplateIngredient = templateIngredientItem.content.querySelector("div").cloneNode(true);
                cloneTemplateIngredient.innerHTML = cloneTemplateIngredient.innerHTML.replaceAll("${ingredient}", ing.ingredient)
                cloneTemplateIngredient.innerHTML = cloneTemplateIngredient.innerHTML.replaceAll("${ingredient_quantity}", [ing.quantity, ing.unit].join(' '))
                recettesIngredientsContainer.appendChild(cloneTemplateIngredient)
            })

            recettesRender.appendChild(cloneTemplateRecette)
        }

        [...data].slice(0, 10).forEach(callback);
    }
}

const afficherDropdownIngredientsData = (data) =>
{
    const dropdownIngredientsData = document.getElementById("dropdown-filter-data-ingredients");
    const buttonList = dropdownIngredientsData.querySelectorAll("button");

    buttonList.forEach(button => 
    {
        const span = button.querySelector("span");
        const exist = [...data].map(app => app.toLowerCase()).includes(span.innerText.toLowerCase());
        if (!exist) dropdownIngredientsData.removeChild(button);
    })

    data.forEach(ingredientLabel => 
    {
        let ingredientExist = [...buttonList].map(button => 
        {  
            const span = button.querySelector("span");
            return span.innerText.toLowerCase()
        })
        .includes(ingredientLabel.toLowerCase());

        if (!ingredientExist) 
        {
            const listItemElement = dropdownLink(ingredientLabel.toLowerCase(), "ingredients")
            dropdownIngredientsData.appendChild(listItemElement);
        }
        
    })

}

const afficherDropdownUstensilsData = (data) =>
{
    const dropdownUstensilsData = document.getElementById("dropdown-filter-data-ustensils");
    const buttonList = dropdownUstensilsData.querySelectorAll("button");

    buttonList.forEach(button => 
    {
        const span = button.querySelector("span");
        const exist = [...data].map(app => app.toLowerCase()).includes(span.innerText.toLowerCase());
        if (!exist) dropdownUstensilsData.removeChild(button);
    })

    data.forEach(ustensilLabel => 
    {
        let ustensilExist = [...buttonList].map(button => 
        {  
            const span = button.querySelector("span");
            return span.innerText.toLowerCase()
        })
        .includes(ustensilLabel.toLowerCase());

        if (!ustensilExist) 
        {
            const listItemElement = dropdownLink(ustensilLabel.toLowerCase(), "ustensils")
            dropdownUstensilsData.appendChild(listItemElement);
        }
        
    })

}

const afficherDropdownAppareilsData = (data) =>
{
    const dropdownAppareilsData = document.getElementById("dropdown-filter-data-appareils");
    const buttonList = dropdownAppareilsData.querySelectorAll("button");

    buttonList.forEach(button => 
    {
        const span = button.querySelector("span");
        const exist = [...data].map(app => app.toLowerCase()).includes(span.innerText.toLowerCase());
        if (!exist) dropdownAppareilsData.removeChild(button);
    })

    data.forEach(appareilLabel => 
    {
        let appareilExist = [...buttonList].map(button => 
        {  
            const span = button.querySelector("span");
            return span.innerText.toLowerCase()
        })
        .includes(appareilLabel.toLowerCase());

        if (!appareilExist) 
        {
            const listItemElement = dropdownLink(appareilLabel.toLowerCase(), "appareils")
            dropdownAppareilsData.appendChild(listItemElement);
        }
        
    })

}

const handleOnchangeIngredientsFilterSearch = ($event) => 
{
    const dropdownIngredientsData = document.getElementById("dropdown-filter-data-ingredients");
    dropdownIngredientsData.innerHTML = "";

    const clearInputIngredient = document.querySelector(".dropdown-filter-input-search .ingre-clear")

    if ($event.target.value.trim().length > 0) clearInputIngredient.classList.remove("d-none")
    else clearInputIngredient.classList.add("d-none")

    APP.donnees_filtres.ingredients.forEach(ingredient => 
    {
        if (ingredient.toLowerCase().includes($event.target.value.toLowerCase().trim()))
        {
            dropdownIngredientsData.appendChild(dropdownLink(ingredient, "ingredients"));
        }
    })

}

const handleOnchangeUstensilsFilterSearch = ($event) => 
{
    const dropdownUstensilsData = document.getElementById("dropdown-filter-data-ustensils");
    dropdownUstensilsData.innerHTML = "";

    const clearInputUstensil = document.querySelector(".dropdown-filter-input-search .ustens-clear")

    if ($event.target.value.trim().length > 0) clearInputUstensil.classList.remove("d-none")
    else clearInputUstensil.classList.add("d-none")

    APP.donnees_filtres.ustensils.forEach(ustensil => 
    {
        if (ustensil.toLowerCase().includes($event.target.value.toLowerCase().trim()))
        {
            dropdownUstensilsData.appendChild(dropdownLink(ustensil, "ustensils"));
        }
    })
}

const handleOnchangeAppareilsFilterSearch = ($event) => 
{
    const dropdownAppareilsData = document.getElementById("dropdown-filter-data-appareils");
    dropdownAppareilsData.innerHTML = "";

    const clearInputAppareil = document.querySelector(".dropdown-filter-input-search .app-clear")

    if ($event.target.value.trim().length > 0) clearInputAppareil.classList.remove("d-none")
    else clearInputAppareil.classList.add("d-none")

    APP.donnees_filtres.appareils.forEach(appareil => 
    {
        if (appareil.toLowerCase().includes($event.target.value.toLowerCase().trim()))
        {
            dropdownAppareilsData.appendChild(dropdownLink(appareil, "appareils"));
        }
    })
}

const resetComponents = () => 
{
    resetTags();
    APP.donneesFiltresSelected = { ingredients: new Set([]), ustensils: new Set([]), appareils: new Set([]) }
}

// Afficher les entrées du dropdown en y ajoutant l'évènement au clic
const dropdownLink = (label, type) => 
{
    const textElement = document.createElement("span");
    textElement.innerText = label

    const closeIcon = document.createElement("i")
    closeIcon.setAttribute("class", "fa fa-times-circle d-none")

    const listItemElement = document.createElement("button");
    listItemElement.setAttribute("class", "list-group-item list-group-item-action d-flex justify-content-between align-items-center");
    listItemElement.appendChild(textElement)
    listItemElement.appendChild(closeIcon)

    const eventCall = ($event) => 
    {
        console.log($event.target.tagName.toLowerCase());
        if ($event.target.tagName.toLowerCase() !== "i") {
            closeIcon.classList.remove("d-none")
            listItemElement.classList.add("active")
            listItemElement.classList.add("fw-bold")
            listItemElement.classList.add("fst-italic")
            APP.donneesFiltresSelected[type].add(label)
            lancerRecherche(APP.resultatRechercheRecette, APP.motCle)
        }
    }

    closeIcon.addEventListener("click", ($event) => 
    {
        closeIcon.classList.add("d-none")
        listItemElement.classList.remove("active")
        listItemElement.classList.remove("fw-bold")
        listItemElement.classList.remove("fst-italic")

        APP.donneesFiltresSelected[type].delete(label);
        lancerRecherche(APP.recettes, APP.motCle);
    })

    listItemElement.addEventListener("click", eventCall)
    return listItemElement;
}

// Traiter evenement de la barre de recherche
const handleSubmitSearchForm = ($event) => {
    $event.preventDefault();
    const motCle = document.forms["search-form"]["i-search"].value;

    if (motCle.length > 0 && motCle.length < 3)
        return;

    resetComponents();
    lancerRecherche(APP.recettes, motCle)
}

const handleChangeSearchInputForm = ($event) => {
    $event.preventDefault();
    const motCle = document.forms["search-form"]["i-search"].value;
    const clearMainSearch = document.getElementById("i-clear");

    if (motCle.trim().length > 0) {
        clearMainSearch.classList.remove("d-none")
        return;
    }

    clearMainSearch.classList.add("d-none")
}


// Initalisation de l'application
(function init() {
    lancerRecherche(APP.recettes, "");
    const searchForm = document.getElementById("search-form");
    searchForm.addEventListener("submit", handleSubmitSearchForm)

    const searchInputForm = document.querySelector("input[name='i-search']");
    searchInputForm.addEventListener("keyup", handleChangeSearchInputForm)

    const clearMainSearch = document.getElementById("i-clear");

    clearMainSearch.addEventListener("click", ($event) => 
    { 
        searchInputForm.value = ""; 
        searchInputForm.dispatchEvent(new Event("keyup"))
    })

    const ingredientsISearch = document.getElementById("ingredients-i-search");
    ingredientsISearch.addEventListener("keyup", handleOnchangeIngredientsFilterSearch);
    ingredientsISearch.addEventListener("focusout", handleOnchangeIngredientsFilterSearch);

    const ustensilsISearch = document.getElementById("ustensils-i-search");
    ustensilsISearch.addEventListener("keyup", handleOnchangeUstensilsFilterSearch);
    ustensilsISearch.addEventListener("focusout", handleOnchangeIngredientsFilterSearch);

    const appareilsISearch = document.getElementById("appareils-i-search");
    appareilsISearch.addEventListener("keyup", handleOnchangeAppareilsFilterSearch);
    appareilsISearch.addEventListener("focusout", handleOnchangeIngredientsFilterSearch);

    const clearInputSearchIngredient = document.querySelector("#dropdown-filter-ingredients i.fa-times")

    clearInputSearchIngredient.addEventListener("click", ($event) => {
        ingredientsISearch.value = ""
        ingredientsISearch.dispatchEvent(new Event("keyup"))
        $event.stopPropagation()
    })

    const clearInputSearchUstensil = document.querySelector("#dropdown-filter-ustensils i.fa-times")

    clearInputSearchUstensil.addEventListener("click", ($event) => {
        ustensilsISearch.value = ""
        ustensilsISearch.dispatchEvent(new Event("keyup"))
        $event.stopPropagation()
    })

    const clearInputSearchAppareil = document.querySelector("#dropdown-filter-appareils i.fa-times")

    clearInputSearchAppareil.addEventListener("click", ($event) => {
        appareilsISearch.value = ""
        appareilsISearch.dispatchEvent(new Event("keyup"))
        $event.stopPropagation()
    })

})();
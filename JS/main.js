"use strict"

$(document).ready(() => {
    searchByName("").then(() => {
        $(".loading-screen").fadeOut(500)
        $("body").removeClass("overflow-hidden")

    })
})


// =========== JQuery =============
function showloader() {
    $(".divisions").addClass("hidden")
    $(".innerSpinner").removeClass("hidden")
}
function hideLoader() {
    $(".divisions").removeClass("hidden")
    $(".innerSpinner").addClass("hidden")
}
function closeNav() {
    $(".mainNav").animate({ width: "0" }, 500);
    $(".closeBtn").addClass("!hidden")
    $(".openBtn").removeClass("!hidden")
    $("li a").animate({
        top: 96
    }, 600)
}
$(".closeBtn").on("click", function () {
    closeNav()
})

$(".openBtn").on("click", function () {
    $(".mainNav").animate({ width: "208px" }, 500);
    $(this).addClass("!hidden")
    $(".closeBtn").removeClass("!hidden")
    document.querySelectorAll("a").forEach(function (a, index) {
        let delay = index * 100
        setTimeout(() => {
            $(a).animate({ top: 0 })
        }, delay);
        ;
    })
});





// ======================================================================================================================================================




// =========== Search API =============

document.querySelector(".search").addEventListener("click", function () {
    closeNav()
    $("section").addClass("hidden")
    $(".searchInputs").removeClass("hidden")
})

document.querySelector(".mealNameInput").addEventListener("change", function () {
    $(".displaySearch").removeClass("hidden")
    console.log(this.value);
    searchByName(this.value)
})

document.querySelector(".mealLetterInput").addEventListener("change", function () {
    $(".displaySearch").removeClass("hidden")
    console.log(this.value);
    searchByFirstLetter(this.value)
})

async function searchByName(mealName) {
    try {
        showloader()
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
        let data = await response.json()
        displaySearch(data.meals)
        hideLoader()
    } catch (error) {
        hideLoader()
        console.log(error);
    }
}

async function searchByFirstLetter(letter) {
    try {
        showloader()
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
        let data = await response.json()
        console.log(data.meals);
        displaySearch(data.meals)
        hideLoader()
    } catch (error) {
        hideLoader()
        console.log(error);
    }
}

function displaySearch(data) {
    $("section:not(:first)").addClass("hidden")
    $(".displaySearch").removeClass("hidden")
    let meals = "";
    for (let i = 0; i < data.length; i++) {
        meals += `
            <div onclick="displayMealDetails(${data[i].idMeal})" class="mealCard w-full md:w-[calc(25%-1rem)] mb-4 relative group overflow-hidden rounded-lg cursor-pointer">
                <img src="${data[i].strMealThumb}" class="w-full" alt="">
                <div
                    class="layer w-full flex flex-col justify-center top-0 bottom-0 bg-white group-hover:translate-y-0 translate-y-full duration-500 bg-opacity-75 absolute">
                    <h3 class="ps-4 text-2xl font-semibold">${data[i].strMeal}</h3>
                </div>
            </div>
        `
    }
    document.querySelector(".displaySearch").innerHTML = meals;
}

// =========== Get Meal Details API =============

$(".closeDetails").on("click", function () {
    $("#mealDetails").addClass("hidden")
})

async function displayMealDetails(id) {
    try {
        showloader()
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        let data = await response.json()
        displayDetails(data.meals)
        hideLoader()
    } catch (error) {
        console.log(error);
    }
}

function displayDetails(data) {
    $("#mealDetails").removeClass("hidden")
    let ingredient = '';
    for (let i = 1; i <= 20; i++) {
        if (data[0][`strIngredient${i}`]) {
            ingredient += `<span class="bg-blue-200 rounded-lg px-4 py-2 text-black">${data[0][`strIngredient${i}`]}</span>`;
        }
        document.querySelector(".mainDetails").innerHTML = `
                <div class="w-full md:w-4/12 px-4">
                        <img src="${data[0].strMealThumb}" class="w-full rounded-lg mb-6" alt="">
                        <h3 class="text-blue-100 text-4xl font-bold ms-5">${data[0].strMeal}</h3>
                    </div>
                    <div class="w-full md:w-8/12 text-white px-4">
                        <h1 class="text-4xl font-bold mb-5">Instructions</h1>
                        <p class="mb-5">${data[0].strInstructions}</p>
                        <p class="mb-5 text-2xl"><strong>Area:</strong> ${data[0].strArea}</p>
                        <p class="mb-5 text-2xl"><strong>Category:</strong> ${data[0].strCategory}</p>
                        <div class="mb-5">
                            <p class="mb-4 text-2xl font-bold">Recipes:</p>
                            <div class="recipes flex flex-wrap gap-5 ">
                                ${ingredient}
                            </div>
                        </div>
                        <div class="mb-16">
                            <p class="mb-4 text-2xl font-bold">Tags:</p>
                            <span class="bg-pink-300 rounded-lg px-6 py-2 text-black">${data[0].strTags === null ? "Food" : data[0].strTags}</span>
                        </div>
                        <a href="${data[0].strSource}" target="_blank" class="bg-green-500 rounded-lg px-6 py-3 me-2 text-black">Source</a>
                        <a href="${data[0].strYoutube}" target="_blank" class="bg-red-600 rounded-lg px-6 py-3">Youtube</a>
                </div>
        `
    }
}

// =========== Get Categories API =============

document.querySelector(".cat").addEventListener("click", () => {
    closeNav()
    $("section").addClass("hidden")
    $("#displayCategories").removeClass("hidden")
    getMealCategories()
})

async function getMealCategories() {
    try {
        showloader()
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
        let data = await response.json()
        console.log(data.categories);
        displayCategories(data.categories)
        hideLoader()
    } catch (error) {
        console.log(error);
    }
}

function displayCategories(data) {
    let categories = ''
    for (let i = 0; i < data.length; i++) {
        categories += `
                <div onclick="getMealCategoryRecipes('${data[i].strCategory}')" class="w-full md:w-[calc(25%-1rem)] mb-4 relative group overflow-hidden rounded-lg cursor-pointer">
                    <img src="${data[i].strCategoryThumb}" class="w-full" alt="">
                    <div
                        class="layer px-3 w-full flex flex-col justify-center items-center text-center top-0 bottom-0 bg-white group-hover:translate-y-0 translate-y-full duration-500 bg-opacity-75 absolute rounded-lg">
                        <h3 class="text-2xl font-semibold mb-5">${data[i].strCategory}</h3>
                        <p>${data[i].strCategoryDescription.split(" ").slice(0, 13).join(" ")}</p>
                    </div>
                </div>
        `
    }
    document.querySelector("#displayCategories").innerHTML = categories;
}

async function getMealCategoryRecipes(meal) {
    try {
        showloader()
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${meal}`)
        let data = await response.json()
        console.log(data.meals);
        displaySearch(data.meals)
        hideLoader()
    } catch (error) {
        console.log(error);
    }
}

// =========== Get Area API =============

document.querySelector(".area").addEventListener("click", () => {
    $("section").addClass("hidden")
    $("#displayArea").removeClass("hidden")
    closeNav()
    getAreas()
})

async function getAreas() {
    try {
        showloader()
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
        let data = await response.json()
        console.log(data);
        displayArea(data.meals)
        hideLoader()
    } catch (error) {
        console.log(error);
    }
}

function displayArea(data) {
    let areas = ''
    for (let i = 0; i < data.length; i++) {
        areas += `
            <div onclick="displayAreaMeals('${data[i].strArea}')" class="w-full md:w-[calc(25%-1rem)] mb-4 relative group overflow-hidden rounded-lg cursor-pointer">
                    <img src="./imgs/map.png" class="w-6/12 m-auto" alt="">
                    <p class="text-white text-center text-2xl font-bold">${data[i].strArea}</p>
            </div>
        `
    }
    document.querySelector("#displayArea").innerHTML = areas
}

async function displayAreaMeals(area) {
    try {
        showloader()
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
        let data = await response.json()
        console.log(data.meals);
        displaySearch(data.meals);
        hideLoader()
    } catch (error) {
        console.log(error);
    }
}


// =========== Get Ingredients API =============

document.querySelector(".ing").addEventListener("click", () => {
    $("section").addClass("hidden")
    $("#displayIngredient").removeClass("hidden")
    closeNav()
    getIngredients()
})

async function getIngredients() {
    try {
        showloader()
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
        let data = await response.json()
        console.log(data.meals);
        displayIngredients(data.meals)
        hideLoader()
    } catch (error) {
        console.log(error);
    }
}

function displayIngredients(data) {
    let ingredients = ''
    for (let i = 0; i < 20; i++) {
        ingredients += `
            <div onclick="displayIngredientMeals('${data[i].strIngredient}')" class="w-full md:w-[calc(25%-1rem)] mb-4 relative group overflow-hidden rounded-lg p-5 cursor-pointer">
                    <img src="./imgs/mortar (1).png" class="w-6/12 m-auto mb-2" alt="">
                    <p class="text-white text-center text-2xl font-bold mb-3">${data[i].strIngredient}</p>
                    <p class="text-center text-white">${data[i].strDescription.split(" ").slice(0, 13).join(" ")}</p>
            </div>
        `
    }
    document.querySelector("#displayIngredient").innerHTML = ingredients;
}

async function displayIngredientMeals(ingredient) {
    try {
        showloader()
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        let data = await response.json()
        console.log(data.meals);
        displaySearch(data.meals);
        hideLoader()
    } catch (error) {
        console.log(error);
    }
}

// ======================================================================================================================================================

document.querySelector(".contact").addEventListener("click", () => {
    $("section").addClass("hidden")
    $("#form").removeClass("hidden")
    closeNav()
})


let validationState = {
    isUsernameValid: false,
    isEmailValid: false,
    isUserPhoneValid: false,
    isUserAgeValid: false,
    isUserPasswordValid: false,
    isUserRePasswordValid: false,
};

function validityState() {
    if (
        validationState.isUsernameValid &&
        validationState.isEmailValid &&
        validationState.isUserPhoneValid &&
        validationState.isUserAgeValid &&
        validationState.isUserPasswordValid &&
        validationState.isUserRePasswordValid
    ) {
        document.querySelector(".submitBtn").removeAttribute("disabled");
    } else {
        document.querySelector(".submitBtn").setAttribute("disabled", "disabled");
    }
}

function validateField(inputSelector, errorSelector, regex, stateKey) {
    let input = document.querySelector(inputSelector);
    let value = input.value;
    if (regex.test(value)) {
        document.querySelector(errorSelector).classList.add("hidden");
        validationState[stateKey] = true;
    } else {
        document.querySelector(errorSelector).classList.remove("hidden");
        validationState[stateKey] = false;
    }
    validityState();
}

document.querySelector("#userName").addEventListener("change", function () {
    validateField("#userName", ".userNameError", /^([(a-z) (A-Z)]){3,}[0-9]*$/, "isUsernameValid");
});
document.querySelector("#userEmail").addEventListener("change", function () {
    validateField("#userEmail", ".userEmailError", /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "isEmailValid");
});
document.querySelector("#userPhone").addEventListener("change", function () {
    validateField("#userPhone", ".userPhoneError", /^[0-9]{11}$/, "isUserPhoneValid");
});
document.querySelector("#userAge").addEventListener("change", function () {
    validateField("#userAge", ".userAgeError", /^(1[89]|[2-5][0-9]|60)$/, "isUserAgeValid");
});
document.querySelector("#userPassword").addEventListener("change", function () {
    validateField("#userPassword", ".userPasswordError", /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,12}$/, "isUserPasswordValid");
});
document.querySelector("#userRePassword").addEventListener("change", function () {
    validateField("#userRePassword", ".userRePasswordError", /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,12}$/, "isUserRePasswordValid");
});


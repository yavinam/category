const wrapper = document.querySelector(".wrapper");
const loading = document.querySelector(".loading");
const btn = document.querySelector(".btn");
const allCategories = document.querySelector(".allCategories");
const categoriesButton = document.createElement("button"); // Create a button for categories

const API_URL = "https://dummyjson.com";
let offset = 1;
let perPageCount = 4;
let closeButton = 0;
let total;
let ctg;

// Create and style the "Categories" button
categoriesButton.textContent = "Categories";
categoriesButton.style.margin = "20px";
categoriesButton.style.padding = "10px 20px";
categoriesButton.style.backgroundColor = "#ff5e00"; // Example color
categoriesButton.style.color = "#fff";
categoriesButton.style.border = "none";
categoriesButton.style.borderRadius = "5px";
categoriesButton.style.cursor = "pointer";
categoriesButton.style.transition = "background-color 0.3s";

// Append the "Categories" button to the allCategories container
allCategories.parentElement.insertBefore(categoriesButton, allCategories);

// Fetch data from the API
async function fetchData(api, callback) {
    loading.style.display = "flex";
    try {
        const response = await fetch(api);
        const data = await response.json();
        total = data.total;
        callback(data, total);
    } catch (err) {
        console.error(err);
    } finally {
        loading.style.display = "none";
    }
}

// Show or hide categories
function showCategory() {
    const categoryList = document.getElementById("categoryList");

    // Toggle the visibility of the category list
    if (
        categoryList.style.display === "none" ||
        categoryList.style.display === ""
    ) {
        categoryList.style.display = "block";
    } else {
        categoryList.style.display = "none";
    }
}

// Add event listener to the categories button
categoriesButton.addEventListener("click", showCategory);

// Initial fetch calls
fetchData(`${API_URL}/products?limit=${perPageCount * offset}`, createCard);
fetchData(`${API_URL}/products/categories`, createCategories);
fetchData(`${API_URL}/products?limit=${perPageCount}`, (data) => {
    total = data.total;
    createCard(data, total);
});

// Fetch products by category
function getByCategory(category) {
    ctg = category;
    offset = 1;
    closeButton = 0;
    btn.style.display = "block";
    const apiUrl =
        category === "all"
            ? `${API_URL}/products?limit=${perPageCount}`
            : `${API_URL}/products/category/${category}?limit=${perPageCount}`;
    fetchData(apiUrl, (data) => {
        total = category === "all" ? data.total : data.products.length;
        createCard(data, total);
    });
}

// Create category buttons
function createCategories(categories) {
    while (allCategories.firstChild) {
        allCategories.firstChild.remove();
    }

    const allButton = document.createElement("button");
    allButton.textContent = "All";
    allButton.addEventListener("click", () => getByCategory("all"));
    allCategories.appendChild(allButton);

    // Add buttons for each category
    categories.forEach((category) => {
        const categoryBtn = document.createElement("button");
        categoryBtn.textContent = category.slug; // Adjust if `category.slug` is used
        categoryBtn.addEventListener("click", () =>
            getByCategory(category.slug)
        );
        allCategories.appendChild(categoryBtn);
    });
}

// Create product cards
function createCard(data, total) {
    while (wrapper.firstChild) {
        wrapper.firstChild.remove();
    }
    data.products.forEach((product) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src=${product.images[0]} alt="">
            <h3>${product.title}</h3>
            <strong>${product.price} USD</strong>
            <button>Buy now</button>
        `;
        wrapper.appendChild(card);
    });

    window.scrollTo(0, wrapper.scrollHeight);
}

// Load more products
function seeMore() {
    offset++;
    closeButton += perPageCount;

    const apiUrl =
        ctg === "all" || !ctg
            ? `${API_URL}/products?limit=${perPageCount * offset}`
            : `${API_URL}/products/category/${ctg}?limit=${
                  perPageCount * offset
              }`;

    fetchData(apiUrl, createCard);

    if (closeButton >= total) {
        btn.style.display = "none";
    }
}

btn.addEventListener("click", seeMore);

// Initially hide the category list
const categoryList = document.getElementById("categoryList");
categoryList.style.display = "none";

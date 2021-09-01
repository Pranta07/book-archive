const searchField = document.getElementById("search-field");
const buttonSearch = document.getElementById("button-search");
const gallery = document.getElementById("books-gallery");
const resultsFound = document.getElementById("results-found");
const notFound = document.getElementById("not-found");
const spinner = document.getElementById("spinner");

//display
const display = (el) => {
    el.classList.remove("d-none");
};

//hide
const hide = (el) => {
    el.classList.add("d-none");
};

buttonSearch.addEventListener("click", () => {
    gallery.innerHTML = ""; //clears gallery
    hide(notFound); // hide not found msg
    hide(resultsFound); // hide found msg

    const searchText = searchField.value;
    searchField.value = "";
    if (!searchText) {
        display(notFound); //display not found msg
    } else {
        display(spinner); //show loading spinner
        loadData(searchText);
    }
});

//fetch api data
const loadData = (searchText) => {
    const url = `https://openlibrary.org/search.json?q=${searchText}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => showBooks(data));
};

// display search results
const showBooks = (data) => {
    hide(spinner); //hide loading spinner

    const books = data.docs;
    if (books.length === 0) {
        display(notFound); //display not found msg
    } else {
        books.forEach((book) => {
            //destructuring book object
            let { cover_i, title, author_name, publisher, first_publish_year } =
                book;
            //undefined values are handled
            if (!cover_i) imgURL = `https://covers.openlibrary.org/b/id/-L.jpg`;
            else
                imgURL = `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg`;
            if (!title) title = "...";
            if (!author_name) author_name = "...";
            if (!publisher) publisher = "...";
            if (!first_publish_year) first_publish_year = "...";

            const bookCard = document.createElement("div");
            bookCard.classList.add("col");
            bookCard.innerHTML = `
                        <div class="card h-100 border-0 shadow rounded">
                            <img src="${imgURL}" class="card-img-top bg-secondary" height="300" alt="" />
                            <div class="card-body">
                                <h5 class="card-title text-center">${title}</h5>
                                <p><span class="fw-bold">Authors:</span> ${author_name[0]}</p>
                                <p class="card-text">
                                    <span class="fw-bold">Publisher:</span> ${publisher[0]}
                                    <br>
                                    <span class="fw-bold">First Published:</span> ${first_publish_year}
                                </p>
                            </div>
                        </div>
            `;
            gallery.appendChild(bookCard);
        });
        display(resultsFound); //display number of results found
        resultsFound.innerText = `${data.numFound} results found!`;
    }
};

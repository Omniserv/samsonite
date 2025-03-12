document.addEventListener("DOMContentLoaded", function () {
    // ================= Off-Canvas =================

    // ================= Hide Off-Canvas Panels on Page Load =================
    document.querySelectorAll(".offcanvas").forEach(function (panel) {
        panel.classList.remove("open"); // Ensure panels are hidden at start
    });

    // ================= Off-Canvas Cart =================
    const cartTrigger = document.querySelector(".cart-trigger");
    const cartOffcanvas = document.getElementById("cart-offcanvas");

    if (cartTrigger && cartOffcanvas) {
        cartTrigger.addEventListener("click", function (e) {
            e.preventDefault();
            cartOffcanvas.classList.toggle("open"); // Toggle open/close
        });
    }

    // ================= Off-Canvas User Account =================
    const userAccountTrigger = document.querySelector(".user-account-trigger");
    const accountOffcanvas = document.getElementById("account-offcanvas");

    if (userAccountTrigger && accountOffcanvas) {
        userAccountTrigger.addEventListener("click", function (e) {
            e.preventDefault();
            accountOffcanvas.classList.toggle("open"); // Toggle open/close
        });
    }

    // ================= Close Off-Canvas Panels When Clicking Close Button =================
    document.querySelectorAll(".offcanvas-close").forEach(function (btn) {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".offcanvas").forEach(function (panel) {
                panel.classList.remove("open");
            });
        });
    });

    // ================= Close Off-Canvas When Clicking Outside =================
    document.addEventListener("click", function (event) {
        if (cartOffcanvas && cartOffcanvas.classList.contains("open") &&
            !cartOffcanvas.contains(event.target) &&
            !cartTrigger.contains(event.target)) {
            cartOffcanvas.classList.remove("open");
        }

        if (accountOffcanvas && accountOffcanvas.classList.contains("open") &&
            !accountOffcanvas.contains(event.target) &&
            !userAccountTrigger.contains(event.target)) {
            accountOffcanvas.classList.remove("open");
        }
    });

    // ================= Live Search Dropdown =================
    const searchInput = document.getElementById("search-input");
    const searchDropdown = document.querySelector(".search-dropdown");
    const searchResultsContainer = document.querySelector(".search-results-slider");
    const resultCount = document.getElementById("result-count");

    if (searchInput && searchDropdown && searchResultsContainer && resultCount) {
        searchInput.addEventListener("input", function () {
            const query = this.value.trim();

            if (query.length > 1) {
                fetch(`/search.php?search_query=${encodeURIComponent(query)}&section=results`)
                    .then(response => response.text())
                    .then(html => {
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(html, "text/html");
                        let products = doc.querySelectorAll(".product-grid .card"); // Adjust selector based on theme

                        searchResultsContainer.innerHTML = ""; // Clear previous results

                        // Ensure `num_products` is always a number
                        let numProducts = products.length || 0;
                        resultCount.textContent = numProducts;

                        products.forEach(product => {
                            let img = product.querySelector("img") ? product.querySelector("img").src : "";
                            let title = product.querySelector(".card-title") ? product.querySelector(".card-title").innerText : "No Title";
                            let price = product.querySelector(".price") ? product.querySelector(".price").innerText : "N/A";
                            let link = product.querySelector("a") ? product.querySelector("a").href : "#";

                            searchResultsContainer.innerHTML += `
                                <div class="search-product">
                                    <a href="${link}">
                                        <img src="${img}" alt="${title}" />
                                        <p>${title}</p>
                                        <strong>${price}</strong>
                                    </a>
                                </div>
                            `;
                        });

                        searchDropdown.style.display = "block"; // Show search results dropdown
                    })
                    .catch(error => {
                        console.error("Search error:", error);
                        searchDropdown.style.display = "none"; // Hide dropdown on error
                    });
            } else {
                searchDropdown.style.display = "none"; // Hide dropdown if query is empty
            }
        });

        // ================= Close Search Dropdown When Clicking Outside =================
        document.addEventListener("click", function (event) {
            if (!searchDropdown.contains(event.target) && !searchInput.contains(event.target)) {
                searchDropdown.style.display = "none";
            }
        });
    }
});
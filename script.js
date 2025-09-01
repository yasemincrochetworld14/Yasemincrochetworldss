// Hamburger menü
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", () => {
  menu.classList.toggle("show");
});

// Dark Mode
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

if (localStorage.getItem("dark-mode") === "enabled") {
  body.classList.add("dark-mode");
}

darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("dark-mode", "enabled");
  } else {
    localStorage.setItem("dark-mode", "disabled");
  }
});

// Sepet
const cartToggle = document.getElementById("cartToggle");
const cart = document.getElementById("cart");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

let total = 0;

cartToggle.addEventListener("click", () => {
  cart.classList.add("open");
});

closeCart.addEventListener("click", () => {
  cart.classList.remove("open");
});

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card");
    const title = productCard.querySelector("h3").innerText;
    const price = parseInt(productCard.querySelector("span").innerText.replace("₺",""));

    const li = document.createElement("li");
    li.textContent = `${title} - ₺${price}`;
    cartItems.appendChild(li);

    total += price;
    cartTotal.textContent = total;
  });
});

// Dark mode toggle
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

// Hamburger menu
const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".navigasyon");

hamburger.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// Sepet sistemi
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const cart = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

let total = 0;

cartToggle.addEventListener("click", () => {
  cart.classList.add("open");
});

closeCart.addEventListener("click", () => {
  cart.classList.remove("open");
});

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const li = document.createElement("li");
    li.textContent = `${name} - ₺${price}`;
    cartItems.appendChild(li);
    total += price;
    cartTotal.textContent = `Toplam: ₺${total}`;
  });
});

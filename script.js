// Dark mode
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Hamburger menü
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Sepet
const cartToggle = document.getElementById("cartToggle");
const cart = document.getElementById("cart");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");

cartToggle.addEventListener("click", () => {
  cart.classList.add("active");
});
closeCart.addEventListener("click", () => {
  cart.classList.remove("active");
});

// Sepete ürün ekleme
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const li = document.createElement("li");
    li.textContent = btn.dataset.product;
    cartItems.appendChild(li);
  });
});

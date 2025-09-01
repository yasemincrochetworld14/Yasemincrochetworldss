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
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

let cart = [];
let total = 0;

cartToggle.addEventListener("click", () => {
  cartOverlay.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cartOverlay.classList.remove("active");
});

// Overlay’e tıklayınca kapansın
cartOverlay.addEventListener("click", (e) => {
  if (e.target === cartOverlay) {
    cartOverlay.classList.remove("active");
  }
});

// Sepete Ekle
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card");
    const name = productCard.querySelector("h3").innerText;
    const price = parseFloat(
      productCard.querySelector("span").innerText.replace("₺", "").replace(",", ".")
    );

    cart.push({ name, price });
    total += price;

    const li = document.createElement("li");
    li.textContent = `${name} - ₺${price.toFixed(2)}`;
    cartItems.appendChild(li);

    cartCount.innerText = cart.length;
    cartTotal.innerText = `₺${total.toFixed(2)}`;
  });
});

// Hamburger Menü
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", () => {
  menu.classList.toggle("active");
});

// Back to Top
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Fade-in Animasyon
const fadeElems = document.querySelectorAll(".fade-in");

function checkFadeIn() {
  const triggerBottom = window.innerHeight * 0.9;
  fadeElems.forEach((el) => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", checkFadeIn);
window.addEventListener("load", checkFadeIn);

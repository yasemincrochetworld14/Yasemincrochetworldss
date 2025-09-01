// Hamburger menü
const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector(".navigasyon");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Sepet sistemi
const cart = document.getElementById("cart");
const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cart-items");
const satinAlBtn = document.querySelector(".satin-al");

let sepet = [];

cartBtn.addEventListener("click", () => {
  cart.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cart.classList.remove("active");
});

// Sepete ürün ekleme
const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const productName = button.getAttribute("data-product");
    sepet.push(productName);
    guncelleSepet();
  });
});

function guncelleSepet() {
  cartItems.innerHTML = "";
  sepet.forEach((urun, index) => {
    const item = document.createElement("div");
    item.textContent = urun;
    // Kaldır butonu
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.style.marginLeft = "10px";
    removeBtn.addEventListener("click", () => {
      sepet.splice(index, 1);
      guncelleSepet();
    });
    item.appendChild(removeBtn);
    cartItems.appendChild(item);
  });
}

// Satın al
satinAlBtn.addEventListener("click", () => {
  if (sepet.length === 0) {
    alert("Sepetiniz boş!");
  } else {
    alert("Satın alma işlemi başarılı! 🎉");
    sepet = [];
    guncelleSepet();
    cart.classList.remove("active");
  }
});

// Dark Mode
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

// Sayfa açıldığında kontrol et
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

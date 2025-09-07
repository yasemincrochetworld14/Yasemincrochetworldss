// Firebase SDK importları
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔹 Firebase config (kendi projenin bilgilerini buraya yaz)
const firebaseConfig = {
  apiKey: "SENİN_API_KEY",
  authDomain: "SENİN_AUTH_DOMAIN",
  projectId: "SENİN_PROJECT_ID",
  storageBucket: "SENİN_STORAGE_BUCKET",
  messagingSenderId: "SENİN_MSG_ID",
  appId: "SENİN_APP_ID",
};

// Firebase başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Firestore'dan ürünleri çek
async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((doc) => {
    const product = doc.data();
    renderCard(product); // senin mevcut renderCard fonksiyonun
  });
}

// 🔹 Sayfa yüklenince ürünleri çek
window.addEventListener("DOMContentLoaded", loadProducts);

// ---------------------------------------------------
// Eğer "renderCard" fonksiyonun yoksa, basit bir örnek:

function renderCard(product) {
  const container = document.getElementById("products"); // ürünlerin listelendiği div id'si
  const card = document.createElement("div");
  card.className = "card";

  // slider için resim alanı
  let sliderHtml = "";
  if (product.images && product.images.length > 0) {
    sliderHtml = `
      <div class="slider">
        ${product.images
          .map(
            (img) => `<div class="slide"><img src="${img}" alt="${product.title}" /></div>`
          )
          .join("")}
      </div>
    `;
  }

  card.innerHTML = `
    ${sliderHtml}
    <h3>${product.title}</h3>
    <p>${product.description || ""}</p>
    <p><strong>${product.price} TL</strong></p>
    <button class="detail-btn">Detayları Gör</button>
    <button class="fav-btn">Favorilere Ekle</button>
    <button class="cart-btn">Sepete Ekle</button>
  `;

  // Butonlara event ekle
  card.querySelector(".cart-btn").addEventListener("click", () => {
    addToCart(product);
  });
  card.querySelector(".fav-btn").addEventListener("click", () => {
    toggleFavorite(product);
  });
  card.querySelector(".detail-btn").addEventListener("click", () => {
    showDetails(product);
  });

  container.appendChild(card);
}

// ---------------------------------------------------
// 🔹 Sepet / Favori / Detay örnekleri (localStorage tabanlı):

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Sepete eklendi!");
}

function toggleFavorite(product) {
  let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  const exists = favs.find((p) => p.title === product.title);
  if (exists) {
    favs = favs.filter((p) => p.title !== product.title);
    alert("Favorilerden çıkarıldı!");
  } else {
    favs.push(product);
    alert("Favorilere eklendi!");
  }
  localStorage.setItem("favorites", JSON.stringify(favs));
}

function showDetails(product) {
  alert(`Ürün Detayı:\n${product.title}\n${product.description}`);
            }

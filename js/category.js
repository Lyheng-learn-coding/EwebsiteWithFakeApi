document.addEventListener("DOMContentLoaded", () => {
  const cateContainer = document.getElementById("cateContainer");
  const btnBack = document.getElementById("btnBackCate");
  const category = new URLSearchParams(window.location.search).get("category");

  if (btnBack) {
    btnBack.addEventListener("click", () => {
      history.back();
    });
  }

  if (!category) {
    cateContainer.innerHTML =
      '<p class="text-center text-2xl text-red-500">Category is missing.</p>';
    return;
  }

  // Update title
  const pageTitle = document.querySelector("h2");
  pageTitle.textContent = decodeURIComponent(category);

  cateContainer.innerHTML =
    '<p class="text-center text-2xl">Loading products...</p>';

  fetch(`https://fakestoreapi.com/products/category/${category}`)
    .then((res) => res.json())
    .then((data) => {
      displayCategoryProducts(data);
    })
    .catch((err) => {
      console.error(err);
      cateContainer.innerHTML =
        '<p class="text-center text-2xl text-red-500">Failed to load products.</p>';
    });

  // Add to cart and favorite event listener
  cateContainer.addEventListener("click", (e) => {
    const addToCartButton = e.target.closest(".add-to-cart");
    if (addToCartButton) {
      e.preventDefault();
      const productId = addToCartButton.dataset.cartid;
      fetch(`https://fakestoreapi.com/products/${productId}`)
        .then((res) => res.json())
        .then((product) => {
          addProductToCart(product, 1);
        });
    }

    const favButton = e.target.closest(".favPro");
    if (favButton) {
      e.preventDefault();
      const proId = favButton.dataset.favid;
      fetch(`https://fakestoreapi.com/products/${proId}`)
        .then((res) => res.json())
        .then((data) => {
          checkDuplicateFavPro(data);
          const isFav = getFavProduct().some((fav) => fav.id === data.id);
          favButton.innerHTML = `<i class="fa-${
            isFav ? "solid" : "regular"
          } fa-heart"></i>`;
          favButton.classList.toggle("text-red-500", isFav);
          favButton.classList.toggle("text-white", !isFav);
        });
    }
  });
});

function saveFavProduct(favProduct) {
  localStorage.setItem("favProduct", JSON.stringify(favProduct));
}

function getFavProduct() {
  return JSON.parse(localStorage.getItem("favProduct")) || [];
}

function checkDuplicateFavPro(pro) {
  let favPro = getFavProduct();
  let duplicatePro = favPro.findIndex((item) => item.id === pro.id);

  if (duplicatePro > -1) {
    favPro.splice(duplicatePro, 1);
  } else {
    let favProduct = { ...pro };
    delete favProduct.quantity;
    favPro.push(favProduct);
  }
  saveFavProduct(favPro);
}

console.log(getFavProduct());
function displayCategoryProducts(products) {
  const cateContainer = document.getElementById("cateContainer");
  if (!products || products.length === 0) {
    cateContainer.innerHTML =
      '<p class="text-center text-2xl text-red-500">No products found in this category.</p>';
    return;
  }
  const favProducts = getFavProduct();
  cateContainer.innerHTML = products
    .map((p) => {
      const isFav = favProducts.some((fav) => fav.id === p.id);
      return `
        <div class="shadow-lg rounded-[10px] md:p-[20px] p-[10px] relative">
          <button class="favPro absolute right-[10px] top-[10px] backdrop-blur-[20px] rounded-[50%] bg-gray-200 p-[5px] size-10 cursor-pointer ${
            isFav ? "text-red-500" : "text-white"
          }" data-favid = ${p.id}>
            <i class="fa-${isFav ? "solid" : "regular"} fa-heart"></i>
          </button>
          <a href="./detail.html?id=${p.id}">
            <img
              src="${p.image}"
              alt="${p.title}"
              class="p-[10px] h-48 w-full object-contain rounded-t-[10px]"
            />
            <div class="py-[10px] flex flex-col gap-2.5">
              <h2 class="text-[1rem] md:text-[1.2rem] font-bold truncate">
                ${p.title}
              </h2>
            </div>
          </a>
          <div class="flex justify-between gap-2.5 items-center mt-[10px]">
            <p class="text-[1.2rem] font-bold">$${p.price}</p>
            <button
              data-cartid="${p.id}"
              class="add-to-cart z-10 md:size-10 size-9 flex justify-center items-center p-[10px] text-center text-[0.8rem] text-white bg-[#000] rounded-[50%] cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
    `;
    })
    .join("");
}

// --- Cart Functions ---
function getCartProduct() {
  const cartData = localStorage.getItem("cartProduct");
  if (!cartData || cartData === "undefined") {
    return [];
  }
  return JSON.parse(cartData) || [];
}

function saveCartProduct(cartProduct) {
  localStorage.setItem("cartProduct", JSON.stringify(cartProduct));
}

function addProductToCart(product, quantity) {
  let cart = getCartProduct();
  let existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += quantity;
    Swal.fire({
      title: "Quantity Updated",
      text: "The product quantity has been updated in your cart.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      draggable: true,
    });
  } else {
    let productToAdd = { ...product, quantity: quantity };
    cart.push(productToAdd);
    Swal.fire({
      title: "Added to Cart!",
      text: "Product has been added to your cart.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      draggable: true,
    });
  }
  saveCartProduct(cart);
}

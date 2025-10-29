const menContainer = document.getElementById("menContainer");
const womenContainer = document.getElementById("womenContainer");
const jewelryContainer = document.getElementById("jewelryContainer");
const electronicContainer = document.getElementById("eleContainer");
const favCartContainer = document.getElementById("favCartContainer");
const favItemsContainer = document.getElementById("favItemsContainer");
const btnBackFav = document.getElementById("btnBackFav");
const showFavCart = document.getElementById("showFavCart");

function saveFavProduct(favProduct) {
  localStorage.setItem("favProduct", JSON.stringify(favProduct));
}

function getFavProduct() {
  return JSON.parse(localStorage.getItem("favProduct")) || [];
}

function saveCartProduct(cartProduct) {
  localStorage.setItem("cartProduct", JSON.stringify(cartProduct));
}

function getCartProduct() {
  const cartData = localStorage.getItem("cartProduct");
  if (!cartData || cartData === "undefined") {
    return [];
  }
  return JSON.parse(cartData) || [];
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
  updateFavCount();
}

function checkDuplicateCartPro(pro) {
  let cart = getCartProduct();
  let existingProduct = cart.find((item) => item.id === pro.id);

  if (existingProduct) {
    Swal.fire({
      title: "Already in Cart",
      text: "This product is already in your cart.",
      icon: "warning",
      timer: 2000,
      showConfirmButton: false,
      draggable: true,
    });
  } else {
    let productToAdd = { ...pro, quantity: 1 };
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
  updateCartCount();
}

function updateFavCount() {
  let favSpan = document.querySelectorAll(".favCounter");
  let cart = getFavProduct();
  let countPro = cart.length;

  favSpan.forEach((ele) => {
    if (countPro > 0) {
      ele.textContent = countPro;
      ele.classList.remove("invisible");
    } else {
      ele.classList.add("invisible");
    }
  });
}

function updateCartCount() {
  let cartSpan = document.querySelectorAll(".cartCounter");
  let cart = getCartProduct();
  let countPro = cart.length;

  cartSpan.forEach((ele) => {
    if (countPro > 0) {
      ele.classList.remove("invisible");
    } else {
      ele.classList.add("invisible");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateFavCount();
  updateCartCount();
});

function displayAllPro(products, container) {
  if (!container) return;
  const favProducts = getFavProduct();

  container.innerHTML = products
    .map((p) => {
      const isFav = favProducts.some((fav) => fav.id === p.id);
      return `
        <div class="relative flex-shrink-0 w-45 md:w-full snap-start rounded-[10px] shadow-lg transform hover:translate-y-[-10px] transition all duration-[0.2s]">
            <a href="./detail.html?id=${p.id}" class="block p-[20px]">
                <img
                src="${p.image}"
                alt="${p.title}"
                class="w-full object-contain rounded-t-[10px] h-[200px] p-[10px]"
                />
                <div class = "py-[10px] flex flex-col gap-2.5">
                <h2 class="text-[0.8rem] md:text-[1.2rem] font-bold truncate">${
                  p.title
                }</h2>
                </a>
                <div class="flex justify-between gap-2.5 items-center mt-[10px] px-[20px] pb-[20px]">
                    <p class="text-[1.2rem] font-bold">$${p.price}</p>
                    <button
                    class="add-to-cart z-10 size-10 flex justify-center items-center p-[10px] text-center text-[1rem] text-white bg-[#000] rounded-[50%] cursor-pointer" data-cartid = "${
                      p.id
                    }"
                    >
                    <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                </div>
            <button class="favPro z-10 flex justify-center items-center absolute right-[5px] top-[5px] backdrop-blur-[20px]  cursor-pointer rounded-[50%] size-10 p-[10px] text-[1rem] bg-[#cdcdcd] ${
              isFav ? "text-red-500" : "text-white"
            }" data-favid = ${p.id}>
            <i class="fa-${isFav ? "solid" : "regular"} fa-heart"></i>
            </button>
        </div>
    `;
    })
    .join("");
}

function fetchAndDisplayProducts(url, container) {
  if (container) {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        displayAllPro(data, container);
      });
  }
}

fetchAndDisplayProducts(
  "https://fakestoreapi.com/products/category/men's clothing",
  menContainer
);
fetchAndDisplayProducts(
  "https://fakestoreapi.com/products/category/women's clothing",
  womenContainer
);
fetchAndDisplayProducts(
  "https://fakestoreapi.com/products/category/jewelery",
  jewelryContainer
);
fetchAndDisplayProducts(
  "https://fakestoreapi.com/products/category/electronics",
  electronicContainer
);

document.body.addEventListener("click", (e) => {
  const favButton = e.target.closest(".favPro");
  if (favButton) {
    let proId = favButton.dataset.favid;
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
    return;
  }

  const cartButton = e.target.closest(".add-to-cart");
  if (cartButton) {
    e.preventDefault();
    let proId = cartButton.dataset.cartid;
    fetch(`https://fakestoreapi.com/products/${proId}`)
      .then((res) => res.json())
      .then((data) => {
        checkDuplicateCartPro(data);
      });
  }
});

const overlayDark = document.getElementById("overlayDark");
showFavCart.addEventListener("click", (e) => {
  e.preventDefault();
  displayFavCart();
  favCartContainer.classList.add("right-0");
  favCartContainer.classList.remove("right-[-100%]");
  overlayDark.classList.remove("hidden");
  overlayDark.classList.add("block");
});

btnBackFav.addEventListener("click", (e) => {
  e.preventDefault();
  favCartContainer.classList.remove("right-0");
  favCartContainer.classList.add("right-[-100%]");
  overlayDark.classList.add("hidden");
  overlayDark.classList.remove("block");
});

overlayDark.addEventListener("click", (e) => {
  e.preventDefault();
  favCartContainer.classList.remove("right-0");
  favCartContainer.classList.add("right-[-100%]");
  overlayDark.classList.add("hidden");
  overlayDark.classList.remove("block");
});

function displayFavCart() {
  const favPro = getFavProduct();
  if (!favItemsContainer) return;

  if (favPro.length === 0) {
    favItemsContainer.innerHTML = `<p class="text-center text-2xl text-[red] col-span-full mt-10">No Favorite Products</p>`;
    return;
  }

  favItemsContainer.innerHTML = favPro
    .map(
      (p) =>
        `
          <div
          class="flex justify-between gap-2 items-center p-[10px] w-full rounded-[10px] shadow-[2px_1px_5px_rgba(0,0,0,0.5)] bg-white"
        >
          <a href="./detail.html?id=${p.id}" class="flex items-center gap-1">
            <img
              src="${p.image}"
              alt="${p.title}"
              class="size-20 rounded-[10px] object-contain"
            />
            <p class="text-[0.8rem] text-black font-bold max-w-prose overflow-auto">
            ${p.title}
            </p>
            </a>
          <p class="text-[1rem] text-[green] font-bold">  $${p.price}</p>

          <button class="removeFav p-[10px] bg-red-500 rounded-[5px] text-white" data-favid="${p.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
  `
    )
    .join("");
}

favCartContainer.addEventListener("click", (e) => {
  if (e.target.closest(".removeFav")) {
    const button = e.target.closest(".removeFav");
    const productId = button.dataset.favid;

    let favProducts = getFavProduct();
    favProducts = favProducts.filter((p) => p.id != productId);
    saveFavProduct(favProducts);
    displayFavCart();
    updateFavCount();
    // We also need to update the heart icon on the main page
    const favButton = document.querySelector(
      `.favPro[data-favid="${productId}"]`
    );
    if (favButton) {
      favButton.innerHTML = '<i class="fa-regular fa-heart"></i>';
      favButton.classList.remove("text-red-500");
      favButton.classList.add("text-white", "bg-[#cdcdcd]");
    }
  }
});

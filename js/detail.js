document.addEventListener("DOMContentLoaded", () => {
  const detailContainer = document.getElementById("detailContainer");
  const backButton = document.getElementById("backButton");
  const productId = new URLSearchParams(window.location.search).get("id");
  let quantity = 1;
  let currentProduct = null;

  if (backButton) {
    backButton.addEventListener("click", () => {
      history.back();
    });
  }

  if (!productId) {
    detailContainer.innerHTML =
      '<p class="text-center text-2xl text-red-500">Product ID is missing.</p>';
    return;
  }

  detailContainer.innerHTML =
    '<p class="text-center text-2xl">Loading product...</p>';

  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Product not found");
      }
      return res.json();
    })
    .then((p) => {
      currentProduct = p;
      document.title = p.title;
      renderProductDetail(p);
    })
    .catch((error) => {
      console.error("Error fetching product details:", error);
      detailContainer.innerHTML = `<p class="text-center text-2xl text-red-500">Failed to load product.</p>`;
    });

  // --- Event Delegation for buttons ---
  detailContainer.addEventListener("click", (e) => {
    const increButton = e.target.closest(".incre");
    const decreButton = e.target.closest(".decre");
    const addToCartButton = e.target.closest(".add-to-cart-btn");

    if (increButton) {
      quantity++;
      updateQuantityDisplay();
    }

    if (decreButton) {
      if (quantity > 1) {
        quantity--;
        updateQuantityDisplay();
      }
    }

    if (addToCartButton) {
      if (currentProduct) {
        addProductToCart(currentProduct, quantity);
      }
    }
  });

  function updateQuantityDisplay() {
    const qtyElements = document.querySelectorAll(".itemQty");
    qtyElements.forEach((el) => (el.textContent = quantity));
  }
});

function renderProductDetail(p) {
  const detailContainer = document.getElementById("detailContainer");
  detailContainer.innerHTML = `
        <div>
          <img
            class="md:w-[300px] w-full md:h-auto h-[500px] object-cover"
            src="${p.image}"
            alt="${p.title}"
          />
          <div class="flex justify-end items-center md:hidden w-full mt-2">
            <button
              class="decre p-[10px] bg-gray-200 text-[green] rounded-[5px] text-[1rem]" >
              <i class="fa-solid fa-minus"></i>
            </button>
            <span class="itemQty text-[1rem] font-bold p-[15px]">1</span>
            <button
              class="incre p-[10px] bg-gray-200 text-[green] rounded-[5px] text-[1rem]"
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
        <div>
          <div class="flex gap-2.5 flex-col">
            <h2 class="text-[1.2rem] font-bold">${p.title}</h2>
            
            <div class="flex items-center gap-2">
                <span class="text-yellow-500 text-[1rem] flex gap-1 mb-[-5px]">  ${'<i class="fi fi-ss-star"></i>'.repeat(
                  Math.round(p.rating.rate)
                )}</span>
                <span class="text-gray-500">(${p.rating.rate} from ${
    p.rating.count
  } reviews)</span>
            </div>

            <h2 class="text-[green] font-bold text-[1.2rem] mt-2">Description</h2>
            <p class="text-[1rem] text-black max-w-prose">
              ${p.description}
            </p>
            <p class="text-[green] text-2xl font-bold">$${p.price}</p>
            <button
              class="add-to-cart-btn hover:bg-green-800 hover:transition-[0.2s] md:hidden w-full md:w-auto p-[10px] rounded-[5px] bg-[green] text-white text-[1rem]"
            >
              Add to Cart
            </button>
          </div>
          <div class="items-center gap-2.5 hidden md:flex mt-4">
            <button
              class=" cursor-pointer add-to-cart-btn hover:bg-green-800 hover:transition-[0.2s] w-full md:w-auto p-[10px] rounded-[5px] bg-[green] text-white text-[1rem]"
            >
              Add to Cart
            </button>
            <button
              class="decre  cursor-pointer p-[10px] bg-gray-200 text-[green] rounded-[5px] text-[1rem]" >
              <i class="fa-solid fa-minus"></i>    
            </button>
            <span class="itemQty text-[1rem] font-bold p-[10px]">1</span>
            <button
              class="incre  cursor-pointer p-[10px] bg-gray-200 text-[green] rounded-[5px] text-[1rem]"
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
    `;
}

// --- Cart Functions (copied from script.js for now) ---
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
    // If product exists, update its quantity
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
    // Add new product with the specified quantity
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

document.addEventListener("DOMContentLoaded", () => {
  const cartBody = document.getElementById("cartBody");
  const btnBack = document.getElementById("btnBackCart");
  const checkOutbtn = document.getElementById("checkOutbtn");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      history.back();
    });
  }

  const cart = getCartProduct();
  displayCartProducts(cart);
  updateTotal(cart);

  cartBody.addEventListener("click", (e) => {
    if (e.target.closest(".removeItem")) {
      const button = e.target.closest(".removeItem");
      const productId = button.dataset.cartid;

      let cart = getCartProduct();
      cart = cart.filter((p) => p.id != productId);
      saveCartProduct(cart);

      displayCartProducts(cart);
      updateTotal(cart);
    }
  });

  checkOutbtn.addEventListener("click", (e) => {
    e.preventDefault();

    saveCartProduct([]);
    displayCartProducts([]);
    updateTotal([]);

    Swal.fire({
      title: "Your order has been placed",
      text: "Thank you for shopping with Duka Shop!",
      icon: "success",
      confirmButtonColor: "#008000",
      confirmButtonText: "Return to home page!",
      draggable: true,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "../html/index.html";
      }
    });
  });
});

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

function displayCartProducts(cart) {
  const cartBody = document.getElementById("cartBody");
  if (cart.length === 0) {
    cartBody.innerHTML = `<tr><td colspan="5" class="text-center text-2xl text-red-500 p-4">Your cart is empty.</td></tr>`;
    return;
  }

  cartBody.innerHTML = cart
    .map(
      (p) => `
        <tr>
            <td class="flex items-center p-2">
              <img
                class="w-20 h-20 object-contain"
                src="${p.image}"
                alt="${p.title}"
              />
            </td>
            <td class="text-left text-[0.7rem] md:text-[1.1rem] py-2 min-w-[150px] ">
              ${p.title}
            </td>
            <td class="p-[10px] text-center">$${p.price}</td>
            <td class="text-center text-[1.1rem]">${p.quantity}</td>
            <td
              class="removeItem text-center text-[1.5rem] text-[red] cursor-pointer"
              data-cartid="${p.id}"
            >
              <i class="fi fi-sr-trash-xmark"></i>
            </td>
          </tr>
    `
    )
    .join("");
}

function updateTotal(cart) {
  const totalElement = document.querySelector(".total-price");
  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  if (totalElement) {
    totalElement.textContent = `$${total.toFixed(2)}`;
  }
}

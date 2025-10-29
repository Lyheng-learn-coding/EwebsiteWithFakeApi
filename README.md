# Duka Shop - E-commerce Project

A simple and responsive e-commerce website built with HTML, Tailwind CSS, and vanilla JavaScript. It uses the [Fake Store API](https://fakestoreapi.com/) to fetch and display product data.

## Features

- **Homepage:** Displays product categories and featured products from different categories.
- **Product Listings:** Browse products by selecting a category.
- **Product Details:** View detailed information for each product, including description, price, and ratings.
- **Shopping Cart:** Add products to the cart, view cart items, and remove them.
- **Favorites:** Add products to a personal favorites list for easy access.
- **Responsive Design:** The layout adapts to various screen sizes, providing a seamless experience on both mobile and desktop devices.
- **Interactive UI:** Utilizes libraries like SweetAlert2 for user-friendly notifications and alerts.

## Technologies Used

- **Frontend:**
  - HTML5
  - [Tailwind CSS](https://tailwindcss.com/)
  - Vanilla JavaScript (ES6+)
- **APIs:**
  - [Fake Store API](https://fakestoreapi.com/) for product data.
- **Libraries:**
  - [Swiper.js](https://swiperjs.com/) for the image carousel on the homepage.
  - [SweetAlert2](https://sweetalert2.github.io/) for custom alerts.
  - [Font Awesome](https://fontawesome.com/) & [Flaticon](https://www.flaticon.com/) for icons.

## Getting Started

To run this project locally, you just need a web browser.

1.  Clone the repository or download the source code.
2.  Navigate to the `ecommerceProject` directory.
3.  Open the `html/index.html` file in your preferred web browser.

## Project Structure

```
ecommerceProject/
├── html/
│   ├── index.html      # The main landing page
│   ├── category.html   # Page to display products of a specific category
│   ├── detail.html     # Detailed view of a single product
│   └── cart.html       # The shopping cart page
├── js/
│   ├── script.js       # Main script for index.html (product fetching, favorites)
│   ├── category.js     # Script for the category page
│   ├── detail.js       # Script for the product detail page
│   └── cart.js         # Script for handling cart functionality
├── src/
│   ├── input.css       # Input file for Tailwind CSS
│   └── output.css      # The compiled CSS file
└── img/
    └── ...             # Image assets like logos
```

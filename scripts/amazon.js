import {cart, addToCart, calculateCartQuantity} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";


let productsHTML = '';

products.forEach((product) => {
    productsHTML += `
        <div class="product-container js-product-container-${product.id}">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name-${product.id} limit-text-to-2-lines" >
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${formatCurrency(product.priceCents)}
          </div>

          <div class="product-quantity-container">
            <select class= "js-selector-quantity-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
    `; 
   
});

document.querySelector('.js-products-grid').innerHTML = productsHTML;

function updateCartQuantity(){
 const cartQuantity = calculateCartQuantity();
 document.querySelector('.js-total-quantity').innerHTML = cartQuantity;

 
}

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  let addedMessageTimeoutId;
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const selectorQuantity = document.querySelector(`.js-selector-quantity-${productId}`);
        const quantity = Number(selectorQuantity.value);
        const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
        
        addedMessage.classList.add('added-to-cart-visible');

        if(addedMessageTimeoutId){
          clearTimeout(timeOutId);
        }
        const timeOutId = setTimeout(() => {
          addedMessage.classList.remove('added-to-cart-visible');
          timeOutId = addedMessageTimeoutId;
        }, 2000);

        addToCart(productId, quantity);
        updateCartQuantity();

        selectorQuantity.value = "1";
        
        

    });
});


function searchFilter(products) {
  const searchInput = document.querySelector('.js-search-bar');

  searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();

    products.forEach((item) => {
      const itemValue = item.name.toLowerCase();
      const productDiv = document.querySelector(`.js-product-container-${item.id}`);
      productDiv.classList.toggle('hidden', !itemValue.includes(searchValue));
    });
  });
}
searchFilter(products);

window.onload = updateCartQuantity();

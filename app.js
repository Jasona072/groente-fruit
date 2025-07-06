const productListEl = document.getElementById('productList');
const addProductBtn = document.getElementById('addProductBtn');
const newProductInput = document.getElementById('newProductInput');
const searchInput = document.getElementById('searchInput');

let products = JSON.parse(localStorage.getItem('products')) || [];

function saveProducts() {
  localStorage.setItem('products', JSON.stringify(products));
}

function renderProducts(filter = '') {
  productListEl.innerHTML = '';

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredProducts.length === 0) {
    productListEl.innerHTML = '<p>Geen producten gevonden.</p>';
    return;
  }

  filteredProducts.forEach((product, index) => {
    const productEl = document.createElement('div');
    productEl.className = 'product';

    productEl.innerHTML = `
      <div class="product-name">${product.name}</div>
      <div class="product-actions">
        <input type="number" min="0" value="${product.amount}" data-index="${index}" />
        <button class="reset-btn" data-index="${index}">Reset</button>
        <button class="delete-btn" data-index="${index}">Verwijderen</button>
      </div>
    `;

    productListEl.appendChild(productEl);
  });

  productListEl.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('change', e => {
      const idx = e.target.getAttribute('data-index');
      products[idx].amount = Number(e.target.value);
      saveProducts();
    });
  });

  productListEl.querySelectorAll('.reset-btn').forEach(button => {
    button.addEventListener('click', e => {
      const idx = e.target.getAttribute('data-index');
      products[idx].amount = 0;
      saveProducts();
      renderProducts(searchInput.value);
    });
  });

  productListEl.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', e => {
      const idx = e.target.getAttribute('data-index');
      products.splice(idx, 1);
      saveProducts();
      renderProducts(searchInput.value);
    });
  });
}

addProductBtn.addEventListener('click', () => {
  const name = newProductInput.value.trim();
  if (!name) return alert('Vul een productnaam in.');
  if (products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    return alert('Dit product bestaat al.');
  }
  products.push({ name, amount: 0 });
  saveProducts();
  renderProducts(searchInput.value);
  newProductInput.value = '';
});

searchInput.addEventListener('input', () => {
  renderProducts(searchInput.value);
});

// Init
renderProducts();

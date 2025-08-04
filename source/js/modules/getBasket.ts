export default function getBasket(): void {
  let state: Record<string, number> = {};

  function addToState(prevState: Record<string, number>, productId: string): Record<string, number> {
    return {
      ...prevState,
      [productId]: (prevState[productId] || 0) + 1,
    };
  }

  function removeFromState(prevState: Record<string, number>, productId: string): Record<string, number> {
    const newState = { ...prevState };
    delete newState[productId];
    return newState;
  }

  function changeQuantity(prevState: Record<string, number>, productId: string, change: number): Record<string, number> {
    const currentQuantity = prevState[productId] || 0;
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) {
      const { [productId]: _, ...rest } = prevState;
      return rest;
    }

    return {
      ...prevState,
      [productId]: newQuantity,
    };
  }

  function clearState(): Record<string, number> {
    return {};
  }

  function getProductString(num: number): string {
    if (typeof num !== 'number' || !Number.isInteger(num) || num < 0) {
      return 'товаров';
    }

    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return 'товаров';
    }

    if (lastDigit === 1) {
      return 'товар';
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      return 'товара';
    } else {
      return 'товаров';
    }
  }

  function formatNumberWithSpaces(number: number): string {
    return new Intl.NumberFormat('ru-RU').format(number);
  }

  function buildBasket(products: any[]): void {
    const basketList = document.querySelector('.basket__list') as HTMLElement | null;
    const headerBasketBtn = document.querySelector('.header__basket-btn') as HTMLElement | null;
    const basketSum = document.querySelector('.basket__sum') as HTMLElement | null;
    const basketResult = document.querySelector('.basket__result span') as HTMLElement | null;

    if (!basketList || !headerBasketBtn || !basketSum || !basketResult) return;

    const totalItems = Object.values(state).reduce((sum, quantity) => sum + quantity, 0);
    headerBasketBtn.textContent = `${totalItems}`;
    basketSum.textContent = `${totalItems} ${getProductString(totalItems)}`;

    const resultObject = products.reduce((acc: Record<string, any>, item: any) => {
      acc[item.id] = item;
      return acc;
    }, {} as Record<string, any>);

    basketList.innerHTML = '';
    let totalValue = 0;

    for (const productId in state) {
      if (resultObject[productId].stock) {
        totalValue = totalValue + state[productId] * resultObject[productId].price;
      }

      basketList.innerHTML += `
        <li class="basket__item ${resultObject[productId].stock ? '' : 'inactive'}" id="${productId}">
          <div class="basket__img"><img src="${resultObject[productId].image}" width="96" height="96" alt="${resultObject[productId].name}">
          </div>
          <div class="basket__text-column"><a class="basket__item-link" href="#">${resultObject[productId].name}</a>
            <div class="basket__item-value">${resultObject[productId].price} ₽</div>
          </div>
          <div class="basket__button-column">
            <button class="basket__item-plus" type="button" data-id="${productId}">+</button><span class="basket__item-sum">${state[productId]}</span>
            <button class="basket__item-minus" type="button" data-id="${productId}">-</button>
          </div>
          <button class="basket__delete" type="button" data-id="${productId}">
            <svg class="delete-icon" width="24" height="24">
              <use xlink:href="#icon-close"></use>
            </svg>
            <svg class="return-icon" width="24" height="24">
              <use xlink:href="#icon-return"></use>
            </svg>
          </button>
        </li>
      `;
      removeToBasket(products);
      plusToBasket(products);
      minusToBasket(products);
      clearToBasket(products);
    }

    basketResult.textContent = `${formatNumberWithSpaces(totalValue)}₽`;
  }

  function clearToBasket(products: any[]): void {
    const basketReset = document.querySelector('.basket__reset') as HTMLElement | null;
    if (!basketReset) return;
    basketReset.addEventListener('click', () => {
      state = clearState();
      buildBasket(products);
    });
  }

  function minusToBasket(products: any[]): void {
    const basketItemMinus = document.querySelectorAll('.basket__item-minus');
    basketItemMinus.forEach((item) => {
      item.addEventListener('click', () => {
        state = changeQuantity(state, (item as HTMLElement).dataset.id!, -1);
        buildBasket(products);
      });
    });
  }

  function plusToBasket(products: any[]): void {
    const basketItemPlus = document.querySelectorAll('.basket__item-plus');
    basketItemPlus.forEach((item) => {
      item.addEventListener('click', () => {
        state = addToState(state, (item as HTMLElement).dataset.id!);
        buildBasket(products);
      });
    });
  }

  function removeToBasket(products: any[]): void {
    const basketDelete = document.querySelectorAll('.basket__delete');
    basketDelete.forEach((item) => {
      item.addEventListener('click', () => {
        state = removeFromState(state, (item as HTMLElement).dataset.id!);
        buildBasket(products);
      });
    });
  }

  function addToBasket(products: any[]): void {
    const cardButton = document.querySelectorAll('.products__card button');
    cardButton.forEach((item) => {
      item.addEventListener('click', () => {
        state = addToState(state, (item as HTMLElement).dataset.id!);
        buildBasket(products);
      });
    });
  }

  const startUrl = 'https://6879163463f24f1fdca0cc4f.mockapi.io/colors';
  const checkbox = document.querySelectorAll('.filter input');
  const sort = document.querySelectorAll('.sort input');
  const sortValue = document.querySelector('.sort__button span') as HTMLElement | null;

  function buildSortUrl(): string {
    const sortChecked = document.querySelector('.sort input:checked') as HTMLInputElement | null;
    const comands: Record<string, string> = {
      'expensive': 'sortBy=price&order=desc',
      'cheap': 'sortBy=price&order=asc',
      'raiting': 'sortBy=raiting&order=desc',
      'date': 'sortBy=date&order=desc',
    };
    return sortChecked && comands[sortChecked.id] ? comands[sortChecked.id] : '';
  }

  function buildCheckedUrl(url: string): string {
    const checkboxes = document.querySelectorAll('.filter input:checked');
    const params: string[] = [];
    checkboxes.forEach(item => {
      params.push(`${(item as HTMLInputElement).name}=true`);
    });
    return params.length ? `${url}?${params.join('&')}&${buildSortUrl()}` : `${url}?${buildSortUrl()}`;
  }

  function getRendering(url: string): void {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((products: any[]) => {
        const container = document.getElementById('products') as HTMLElement | null;
        const catalogBlockCaption = document.querySelector('.catalog-block__caption span') as HTMLElement | null;
        if (!container || !catalogBlockCaption) return;
        catalogBlockCaption.textContent = products.length.toString();
        container.innerHTML = '';
        products.forEach(product => {
          container.innerHTML += `
            <div class="products__card" id="${product.id}">
              <div class="products__img">
                <img src="${product.image}" alt="${product.name}">
              </div>
              <a href="/" class="products__name">${product.name}</a>
              <div class="products__price-row">
                <p>${product.price} ₽</p>
                <button type="button" data-id="${product.id}">+</button>
              </div>
            </div>
          `;
        });
        addToBasket(products);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        const container = document.getElementById('products') as HTMLElement | null;
        if (container) {
          container.innerHTML = `<p class="error-message">Не удалось загрузить данные. Пожалуйста, попробуйте позже.</p>`;
        }
      });
  }

  getRendering(buildCheckedUrl(startUrl));

  checkbox.forEach((item) => {
    item.addEventListener('change', () => {
      getRendering(buildCheckedUrl(startUrl));
    });
  });

  sort.forEach((item) => {
    item.addEventListener('change', () => {
      if (sortValue) sortValue.textContent = (item as HTMLElement).dataset.name || '';
      getRendering(buildCheckedUrl(startUrl));
    });
  });
}

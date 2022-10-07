const axios = require('axios');

const url = 'https://api.neshastore.com/items';
const MAX_PER_PAGE = 100;
const MIN_PRICE = 0;
const MAX_PRICE = 200;

(async () => {
  const resume = {
    items: new Map(),
    meta: {
      totalItems: 0,
      itemCount: MAX_PER_PAGE,
      itemsPerPage: 0,
      totalPages: 0,
      currentPage: 0,
    },
  };

  while (resume.meta.itemCount == MAX_PER_PAGE) {
    const query = `page=${resume.meta.currentPage + 1}&limit=${MAX_PER_PAGE}&orderBy=2&priceFrom=${MIN_PRICE}&priceTo=${MAX_PRICE}&tradeLockedWithin=0&tradeLockedWithin=0`;
    const completedURL = `${url}?${query}`;
    console.log(completedURL);
    const {
      data: { meta, items },
    } = await axios.get(completedURL).catch(console.error);

    items.forEach(item => {
      const currentValue = parseFloat(item.price);
      const lastValue = parseFloat(item.oldPrice);
      const offPriceIndex = 1 - currentValue / lastValue;
      const offPricePercent = offPriceIndex * 100;

      resume.items.set(offPricePercent, item);
    });
    resume.meta = meta;
  }

  var mapAsc = [...resume.items.entries()].sort().reverse().slice(0, 1);
  console.log(mapAsc.map(([_, value]) => value));
  console.log(resume.meta);
})();

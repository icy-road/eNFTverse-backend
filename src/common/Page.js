class Page {
  constructor(items, pageInfo) {
    this.items = items;
    this.pageInfo = pageInfo;
  }

  async render(itemRenderFunction) {
    const itemsRendered = [];
    this.items.forEach((item) => { itemsRendered.push(itemRenderFunction(item)); });

    return { items: await Promise.all(itemsRendered), pageInfo: this.pageInfo };
  }
}

module.exports = Page;

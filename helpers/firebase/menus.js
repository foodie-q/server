const {dbMenus} = require('./index');

module.exports = {
  getMenusList: async () => {
    try {
      const menus = await dbMenus.get();
      return Promise.all(
        menus.docs.map(async (doc) => {
          return {id: doc.id, ...doc.data()};
        })
      );
    } catch (e) {
      throw new Error(e.message)
    }
  },
  findById: async (menuId) => {
    try {
      let menu = await dbMenus.doc(menuId).get();
      return {id: menu.id, ...menu.data()};
    } catch (e) {
      throw new Error(e.message)
    }
  },
  createMenu: async (image,name,max,price,time) => {
    try {
      let newMenu = await dbMenus.add({
        image: image,
        name: name,
        max : +max,
        price: +price,
        time : +time
      })
      return {id: newMenu.id, ...newMenu.data()}
    } catch(e) {
      throw new Error(e.message)
    }
  }
};

const { dbOrders } = require('./index');

const menus = require('./menus');
const users = require('./users');

module.exports = {
  // getOrderList: async () => {
  //   try {
  //     const orders = await dbOrders.where("status", "==", 0).get();
  //     return Promise.all(
  //       orders.docs.map(async (doc) => {
  //         let order = { id: doc.id, ...doc.data() };
  //         order['menu'] = await menus.findById(order.menuId.id);
  //         order['user'] = await users.findById(order.userId.id);

  //         delete order['menuId'];
  //         delete order['userId'];

  //         return order;
  //       })
  //     );
  //   } catch (e) {
  //     throw new Error(e.message)
  //   }
  // },
  // getAcceptedList: async () => {
  //   try {
  //     const orders = await dbOrders.where("status", "==", 1).get();
  //     return Promise.all(
  //       orders.docs.map(async (doc) => {
  //         let order = { id: doc.id, ...doc.data() };
  //         order['menu'] = await menus.findById(order.menuId.id);
  //         order['user'] = await users.findById(order.userId.id);

  //         delete order['menuId'];
  //         delete order['userId'];

  //         return order;
  //       })
  //     );
  //   } catch (e) {
  //     throw new Error(e.message)
  //   }
  // },
  findById: async (orderId) => {
    
    try {
      if(orderId === 'cekdoang') throw new Error('error!')
      let order = await dbOrders.doc(orderId).get();
      return { id: order.id, ...order.data() };
    } catch (e) {
      throw new Error(e.message)
    }
  },
  createOrder: async (payload) => {
    try {
      let data = await dbOrders.add(payload)
      if (data) {
        return data.id
      }
    }
    catch (e) {
      throw new Error(e.message)

    }
  }
};

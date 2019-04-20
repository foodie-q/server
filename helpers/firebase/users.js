const {dbUsers, dbSaldo} = require('./index');
const numberToRupiah = require('../numberToRupiah');

module.exports = {
  getSaldo: async (userId) => {
    try {
      const saldo = await dbSaldo.where("userId", "==", dbUsers.doc(userId)).get();
      let moneyOut = 0;
      let moneyIn = 0;
      saldo.docs.forEach((item) => {
        const data = item.data();
        if (data.status + '' === '0') {
          moneyOut += +data.money;
        } else if (data.status + '' === '1') {
          moneyIn += +data.money;
        }
      });
      return numberToRupiah(moneyIn - moneyOut);
    } catch (e) {
      throw new Error(e.message)
    }
  },
  findById: async (userId) => {
    try {
      let user = await dbUsers.doc(userId).get();
      return {id: user.id, ...user.data()};
    } catch (e) {
      throw new Error(e.message)
    }
  }
};
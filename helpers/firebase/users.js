const { dbUsers, dbSaldo } = require('./index');
const numberToRupiah = require('../numberToRupiah');

const getSaldo =  async (userId) => {
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
}

module.exports = {
  getSaldo,
  findById: async (userId) => {
    try {
      let user = await dbUsers.doc(userId).get();
      let saldo = await getSaldo(userId)

      return { id: user.id, saldo, ...user.data() };
    } catch (e) {
      throw new Error(e.message)
    }
  },
  createSaldo: async (objCreate) => {
    let userId = objCreate.userId
    objCreate = { ...objCreate, userId: dbUsers.doc(objCreate.userId) }
    try {
      let saldo = await dbSaldo.add(objCreate)
      if (saldo) {
        const balance = await dbSaldo.where("userId", "==", dbUsers.doc(userId)).get();
        let moneyOut = 0;
        let moneyIn = 0;
        balance.docs.forEach((item) => {
          const data = item.data();
          if (data.status + '' === '0') {
            moneyOut += +data.money;
          } else if (data.status + '' === '1') {
            moneyIn += +data.money;
          }
        });
        return numberToRupiah(moneyIn - moneyOut);
      }
    } catch (error) {
      throw new Error(error.message)
    }
  },
  getBalanceHistory: async (userId) => {
    try {
      const allBalance = await dbSaldo.where('userId', '==', dbUsers.doc(userId)).orderBy('createdAt', 'desc').get();

      let payload = await Promise.all(
        allBalance.docs.map(async (doc) => {
          let data = { id: doc.id, ...doc.data() };
          delete data.userId
          return data
        })
      );

      return payload
    } catch (error) {
      throw new Error(error.message)
    }
  }
};

const express = require('express');
const router = express.Router();
const { createOrder } = require('../helpers/firebase/orders')
const { dbUsers, auth } = require('../helpers/firebase/index')
const { getSaldo, createSaldo, getBalanceHistory, findById } = require('../helpers/firebase/users')
const order = require('../helpers/firebase/orders')



/* istanbul ignore catch  */
router.post('/register', function (req, res, next) {
  let uid
  auth.createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then(user => {
      // console.log(user.user.uid)
      // console.log(req.body)
      uid = user.user.uid
      return dbUsers.doc(user.user.uid).set({
        name: req.body.name,
        uid: user.user.uid,
        role: +req.body.role,
        table: 0,
        arrival: new Date()
      })
    })
    .then(() => {
      let unsub = auth.onAuthStateChanged(firebaseUser => {
        /* istanbul ignore else  */
        if (firebaseUser) {
          dbUsers.doc(firebaseUser.uid).get()
            .then(user => {
              unsub()
              res.status(201).json(user.data())
            })
            .catch(err => {
              /* istanbul ignore next  */
              throw new Error(err.message)
            })
        }
        else {
          dbUsers.doc(uid).get()
            .then(user => {
              unsub()
              res.status(201).json(user.data())
            })
            .catch(err => {
              throw new Error(err.message)
            })
        }
      })
    })
    .catch(err => {

      res.status(500).json(err)
    })

})

router.post('/login', function (req, res, next) {
  auth.signInWithEmailAndPassword(req.body.email, req.body.password)
    .then(user => {
      // console.log(user.user)
      // res.status(200).json({ uid: user.user.uid})
      let unsub = auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          // res.status(200).json(firebaseUser)
          dbUsers.doc(firebaseUser.uid).get()
            .then(user => {
              res.status(200).json(user.data())
              unsub()
            })
            .catch(err => {
              /* istanbul ignore next  */
              throw new Error(err.message)
            })
        }
      })
    })
    .catch(err => {

      res.status(500).json(err)
    })
})

router.get('/logout', function (req, res, next) {
  let unsub = auth.onAuthStateChanged(firebaseUser => {
    /* istanbul ignore else  */
    if (firebaseUser) {
      auth.signOut()
        .then(() => {
          res.status(200).json({ message: `user ${firebaseUser.email} successs log out` })
          unsub()
        })
        .catch(err => {
          /* istanbul ignore next  */
          throw new Error(err.message)
        })
    }
    else {
      res.status(200).json({ message: 'no one log in' })
    }
  })

})

router.get('/allbalance/:id', function (req, res, next) {
  getBalanceHistory(req.params.id)
    .then(allBalance => {
      res.status(200).json(allBalance)
    })
    // .catch(err => {
    //   res.status(500).json(err)
    // })
})

router.post('/order', function (req, res, next) {
  createOrder(req.body.payload)
    .then(newOrder => {
      res.status(200).json(newOrder)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

router.get('/order/:id', function (req, res, next) {
  order.findById(req.params.id)
    .then(order => {
      res.status(200).json(order)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

router.get('/:id', function (req, res, next) {
  findById(req.params.id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json(err.message)
    })
})

router.post('/saldo', function (req, res, next) {
  createSaldo(req.body.payload)
    .then(saldo => {
      res.status(200).json(saldo)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

module.exports = router;

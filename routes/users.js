const express = require('express');
const router = express.Router();
const { createOrder } = require('../helpers/firebase/orders')
const { dbUsers, auth } = require('../helpers/firebase/index')
const { getSaldo, findById, createSaldo } = require('../helpers/firebase/users')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function (req, res, next) {

  auth.createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then(user => {
      console.log(user.user.uid)
      console.log(req.body)
      return dbUsers.doc(user.user.uid).set({
        name: req.body.name,
        uid: user.user.uid,
        role: +req.body.role,
        table: 0,
        arrival: new Date()
      })
    })
    .then(() => {
      auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          dbUsers.doc(firebaseUser.uid).get()
            .then(user => {
              res.status(201).json(user.data())
            })
            .catch(err => {
              throw new Error(err.message)
            })
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })

})

router.post('/login', function (req, res, next) {
  auth.signInWithEmailAndPassword(req.body.email, req.body.password)
    .then(user => {
      // console.log(user.user)
      // res.status(200).json({ uid: user.user.uid})
      auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          // res.status(200).json(firebaseUser)
          dbUsers.doc(firebaseUser.uid).get()
            .then(user => {
              res.status(200).json(user.data())
            })
            .catch(err => {
              throw new Error(err.message)
            })
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

router.get('/logout', function (req, res, next) {
  auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      auth.signOut()
        .then(() => {
          res.status(200).json({ message: `user ${firebaseUser.email} successs log out` })
        })
        .catch(err => {
          console.log(err)
          res.status(500).json(err)
        })
    }
    else {
      res.status(200).json({ message: 'no one log in' })
    }
  })

})

router.get('/saldo/:id', function (req, res, next) {
  getSaldo(req.params.id)
    .then(saldo => {
      res.status(200).json(saldo)
    })
    .catch(err => {
      res.status(500).json(err)
    })
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

router.get('/:id', function (req, res, next) {
  findById(req.params.id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

router.post('/saldo', function (req, res, next) {
  console.log(req.body,'<<<<,,');
  
  createSaldo({ ...req.body.payload, userId: dbUsers.doc(req.body.payload.userId) })
    .then(saldo => {
      res.status(200).json(saldo)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

module.exports = router;

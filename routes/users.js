const express = require('express');
const router = express.Router();
const {dbUsers, auth} = require('../helpers/firebase/index')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function (req, res, next) {
  auth.createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then(user => {
      console.log(user.user.uid)
      return dbUsers.doc(user.user.uid).set({
        name: req.body.name
      })
    })
    .then(() => {
      res.status(201).json({message: 'user created'})
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

router.post('/login', function (req, res, next) {
  auth.signInWithEmailAndPassword(req.body.email, req.body.password)
    .then(user => {
      console.log(user.user)
      res.status(200).json({ uid: user.user.uid})
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})


module.exports = router;

const express = require('express');
const router = express.Router();
const {db, auth} = require('../models/firebase')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req,res,next) {
  auth.createUserWithEmailAndPassword(req.body.email,req.body.password)
  .then(user => {
    res.status(201).json({
      user,
      token : auth.currentUser.getIdToken()
    })

  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
})

router.post('/login', function(req,res,next) {
  auth.signInWithEmailAndPassword(req.body.email, req.body.password)
  .then(user => {
    console.log(user)
    console.log('token',auth.currentUser.getIdToken())
    res.status(200).json(auth.currentUser.getIdToken())
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
})

module.exports = router;

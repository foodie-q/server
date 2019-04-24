const express = require('express');
const router = express.Router();

const {getMenusList, findById, createMenu} = require('../helpers/firebase/menus')

/* GET menus listing. */
router.get('/', function (req, res, next) {
  getMenusList()
    .then(menus => {
      res.status(200).json(menus)    
    })
    .catch(err => {
      res.status(500).json(err)
    })
});

/* GET menu Id listing. */
router.get('/:menuId', function(req,res,next) {
  findById(req.params.menuId)
    .then(menu => {
      res.status(200).json(menu)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

/* POST new menus listing. */
router.post('/', function (req, res, next) {
  createMenu(req.body.image,req.body.name,req.body.max,req.body.price,req.body.time)
    .then(menu => {
      res.status(201).json(menu)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

/* EDIT menus  */


/* DELETE menus  */


module.exports = router;

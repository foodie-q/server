const router = (require('express')).Router();
const qrcode = require('qrcode');
const {dbUsers} = require('../helpers/firebase');

router
  .post('/', ({body: {userId, table}}, res) => {
    dbUsers
      .doc(userId)
      .get()
      .then(async (doc) => {
        if (!!+table && await doc.data()) {
          res
            .json({valid: 1})
        } else {
          res
            .json({valid: 0})
        }
      })
  })
  .get('/', (req, res) => {
    let keyRandom = `1`;
    qrcode.toDataURL(keyRandom, {errorCorrectionLevel: "H", type: "image/png"}, (err, data) => {
      if (err) {
        console.error(err);
      }
      res.render('qrcode', {
        img: data,
      });
    });
  });

module.exports = router;

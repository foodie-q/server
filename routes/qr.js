const router = (require('express')).Router();
const qrcode = require('qrcode');

router
  .get('/', (req, res) => {
    let keyRandom = `qo test`;
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

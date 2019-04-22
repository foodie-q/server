const router = (require('express')).Router();
const Chef = require('../controllers/chef');

router
  .get('/menu', Chef.getMenuList);

module.exports = router;

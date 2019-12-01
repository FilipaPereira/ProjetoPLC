var express = require('express');
var router = express.Router();
const User = require('../controllers/users')


router.get('/', function (req, res) {
  User.listar()
    .then(users => res.status(200).jsonp(users))
    .catch(err => res.status(500).jsonp({ error: err }))
})




/* GET users listing. */
router.get('/register', function (req, res, next) {
  res.render('index');
});

router.get('/profile', function (req, res) {
  res.render('perfil');

})


router.post('/register', function (req, res, next) {
  const { name, apelido, email, password } = req.body;
  if (password.length < 2) {
    res.status(403).jsonp({ status: 'ERROR PASSWORD SIZE 2 MIN' })
  }
  User.getUser(email)
    .then(resp => {
      if (resp[0]) {
        res.status(401).jsonp({ status: "ERROR EMAIL ALREADY IN USE" })
      } else {
        let user = {
          name,
          email,
          apelido,
          password
        }
        User.addUser(user)
          .then(() => {
            res.status(200).jsonp({ status: "OK" })
          })
          .catch(err => {
            res.status(500).jsonp({ status: "SYSTEM ERROR" })
          })
      }
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var Users = require('../controllers/users')
var passport = require('passport')
const jwt = require('jsonwebtoken')
const fs = require('fs')
var wws = require('../websockets/socket')
var Messages = require('../controllers/messages')


const privateKey = fs.readFileSync('./keys/privatekey.key', 'utf-8')


const { uploadI } = require('./../multer/mlt')
const { uploadU } = require('./../multer/mlt')

/* GET users listing. */
router.get('/', passport.authenticate('jwt', { session: false }),function (req, res, next) {
  Users.listar().then(dados => {
    res.status(200).jsonp({data: dados,user:req.user})
  }).catch(erro => {
    res.status(500).jsonp(erro)
  })
});

router.get('/user/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.getUserId(req.params.id).then(dados=>{
    res.status(200).jsonp({user: dados})
  }).catch(() => {
    res.status(500).jsonp({error: "error"})
  })
})

router.get('/user', passport.authenticate('jwt', { session: false }), function (req, res) {
  res.status(200).jsonp({ user: req.user })
})


//ainda nao sei como enviar a imagem logo por isso faço 2 pedidos

router.get('/image', passport.authenticate('jwt', { session: false }), function (req, res) {
  var path = req.user.nome + '/' + req.user.avatar
  if (path != null || path !== undefined) {
    res.status(200).jsonp({ path: 'http://api.manuelmariamoreno/static/uploads/' + path });
  }
})

router.post('/image', passport.authenticate('jwt', { session: false }), uploadI.single('image'), function (req, res) {
  res.status(200).jsonp({ neat: "neat" })
})



router.post('/login', passport.authenticate('local', { session: false }), function (req, res) {
  jwt.sign({ user: req.user }, privateKey, { expiresIn: '2h', algorithm: 'RS256' }, (err, tokengo) => {
    res.status(200).jsonp({ user: req.user, token: tokengo });
  })
});

router.post('/registerFile',uploadU.single('file'),function(req,res){

})

router.post('/register', function (req, res, next) {
  Users.getUser(req.body.email).then(dados => {
    if (dados === null) {
      Users.addUser(req.body).then(v => {
        var dir = './uploads/' + v.nome
        fs.mkdir(dir,function(error,cena){
        });
        
        res.status(200).jsonp(v);
      })
        .catch(err => {
          res.status(500).jsonp(err);
        })
    }
    else {
      res.status(401).jsonp({ status: "Email ja existente" })
    };
  })
})

// --------------------- Messages -------------------------

router.post('/sendMessage',passport.authenticate('jwt',{session:false}),function(req,res){
  var newMessage = {
    id: req.body.pid,
    myself: "asdf",
    content: req.body.message.content,
    timestamp: req.body.message.timestamp,
    participantId: req.user.id
  }
  Messages.addMessage(newMessage).then(dados=>{
    res.status(200).jsonp({message: "sent"})
  })
})

router.post('/getMessage',passport.authenticate('jwt',{session:false}),function(req,res){
  Messages.getMessages(req.user.id,req.body.friendid).then(userdata=>{
      res.status(200).jsonp({usr: req.user , messages: userdata})
  })
})

// --------------------- FRIEND ROUTER --------------------

router.get('/friends', passport.authenticate('jwt', { session: false }), function (req, res) {
  if (req.user.friends.length > 0) {
    getUsers(req.user).then(l => {
      res.status(200).jsonp(l)
    })
  }
  else {
    res.status(500)
  }
})

router.get('/getFriendsRequests',passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.getFriendRequests(req.user.friendsRequests).then(dados => {
    res.status(200).jsonp(dados)
  }).catch(erro => {
    res.status(500).jsonp(erro)
  })
})

router.get('/friendRequests',passport.authenticate('jwt', { session: false }), function (req, res){
  if(req.user.friendsRequests.length>0){
    getUsersRequested(req.user).then(l => {
      res.status(200).jsonp(l)
    })
  }
  else {
    res.status(500)
  }
})

router.post('/sendRequest', passport.authenticate('jwt', { session: false }), function (req, res) {
  if (Users.sendRequest(req.user.id, req.body.friendid.id)) {
    res.status(200).jsonp({sentRequests: req.user.sentFriendRequests })
  }
  else {
    res.status(500).jsonp({ message: "Error in friend request" })
  }
})

router.post('/acceptRequest', passport.authenticate('jwt', { session: false }), function (req, res) {
  if (Users.acceptRequest(req.user.id, req.body.friendid.id)) {
    res.status(200).jsonp({ message: "Friend request sent" })
  }
  else {
    res.status(500).jsonp({ message: "Error in friend request" })
  }
})

// funçao auxiliar para os frienbds. temos que meter noutro ficheiro a parte
async function getUsers(user) {
  var list = [];
  for (i in user.friends) {
    await Users.getUserId(user.friends[i]).then(usr => {
      list.push(usr);
      var f = parseInt(i);
      f++;
      if (f === user.friendsRequests.length) {
      }
    })
  }
  return list
}

async function getUsersRequested(user) {
  var list = [];
  for (i in user.friendsRequests) {
    await Users.getUserId(user.friendsRequests[i]).then(usr => {
      list.push(usr);
      var f = parseInt(i);
      f++;
      if (f === user.friendsRequests.length) {
      }
    })
  }
  return list
}

router.delete('/:id', passport.authenticate('jwt', { session: false }), function (req, res) {

})


module.exports = router;



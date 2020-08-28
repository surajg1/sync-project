const crypto = require('crypto');
const Models = require('../models');
const _ = require("lodash");

exports.UserEncreprion = (req, res, next) =>{
    var emailkey = crypto.createCipher('aes256', req.body.password);
    var Encemail = emailkey.update(req.body.email, 'utf8', 'hex');
    Encemail += emailkey.final('hex');

    var phoneKey = crypto.createCipher('aes-128-cbc-hmac-sha256', req.body.password);
    var Encphonenumber = phoneKey.update(req.body.mobileNumber, 'utf8', 'hex');
    Encphonenumber += phoneKey.final('hex');

    const user = {
      email: Encemail,
      mobileNumber : Encphonenumber,
      password: req.body.password
    }
    console.log(user);
    Models.User_info.create(user).then((doc)=>{
      res.send(user);
    }).catch((err)=>{
      res.send(err);
    })
}

exports.UserDecreption = async(req, res, next) =>{

  let UserEmail = [];
  let UserPassword= [];
  let UserPhone = [];

  console.log("decription");
    try{
        await Models.User_info.findAll({
          where : {
            password : req.body.password
          }
        }).then((data)=>{
          console.log("Doc", data);

          _.map(data, (doc)=>{
            UserEmail = doc.email;
            UserPassword = doc.password;
            UserPhone = doc.mobileNumber
          });
        }).catch((err)=>{

          res.send(err);
          assert.isNotOk("Faild")
        })
    }catch(err){
      res.send(err);
    }

  var mykey = crypto.createDecipher('aes256', UserPassword);
  var phoneKey = crypto.createDecipher('aes-128-cbc-hmac-sha256', UserPassword);


    try {
      var Encemail = mykey.update(UserEmail, 'hex', 'utf8')
      Encemail += mykey.final('utf8');

      var Encmobile = phoneKey.update(UserPhone, 'hex', 'utf8')
      Encmobile += phoneKey.final('utf8');

      console.log(Encmobile, req.body.mobileNumber, Encemail);

      if((req.body.mobileNumber == Encmobile || req.body.email == Encemail) && req.body.password == UserPassword){
        console.log('Login');
        res.send("Login Succssfull");
      }else {
        console.log('Faild');
        res.send("Login Faild");
      }
    } catch (e) {
        console.log("Ivalid Data Provid");
        res.send("error",e)
    }

  // console.log(mystr);
  // console.log(mystr);
}

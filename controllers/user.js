require("dotenv").config();

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.signup = (req, res) => {
  //  console.log("req.body", req.body);
  const user = new User(req.body);
  user.save((error, user) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error)
      });
    }

    user.salt = undefined;
    user.hashed_password = undefined;

    res.json({
      user
    });
  });
};

exports.signin = (req, res) => {
  //buscar usuário pelo Email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Usuário ou email nao existe."
      });
    }
    //se usuario e existir, validar email e passaword
    //criar método autenticar usuario no model user

    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email e senha nao conferem"
      });
    }

    //gerar um token de assinatura com id usuario e senha
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    //inserir o token como 't' no cookie com data de expiração

    res.cookie("t", token, { expire: new Date() + 9999 });

    //retorna a resposta com usuario e token para o front end

    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Signou Success" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});

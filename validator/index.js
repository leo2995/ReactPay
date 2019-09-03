exports.userSignupValidator = (req, res, next) => {
  req.check("name", "Nome é obrigatório").notEmpty();
  req
    .check("email", "Email deve ter entre 3 e 32 caracteres")
    .matches(/.+\@.+\..+/)
    .withMessage("Email deve conter @")
    .isLength({
      min: 4,
      max: 32
    });
  req.check("password", "Senha é obrigatória").notEmpty();
  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("senha deve ser maior que 6 caracteres")
    .matches(/\d/)
    .withMessage("senha deve conter numero");
  const errors = req.validationErrors();

  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};

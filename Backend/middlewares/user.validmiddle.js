const { check, validationResult } = require("express-validator");

validateUserSignUp = [
  check("fullName")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be within 3 to 20 charachter!"),
  check("email").normalizeEmail().isEmail().withMessage("Invalid Email"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is Empty")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be within 8 to 20 charachter!"),
  check("confirmPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Confirm Password is Empty")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be within 8 to 20 characters!")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  check("country").trim().not().isEmpty().withMessage("Select Country"),
  check("province").trim().not().isEmpty().withMessage("Select Province"),
  check("city").trim().not().isEmpty().withMessage("Select City"),
];

uservalidation = (req, res, next) => {
  const result = validationResult(req).array();

  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error });
};

const validateUserSignIn = [
  check("email").trim().isEmail().withMessage("Email or Password is required"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email or Password is required"),
];

module.exports = { validateUserSignUp, uservalidation, validateUserSignIn };

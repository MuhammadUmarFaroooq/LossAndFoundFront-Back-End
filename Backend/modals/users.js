const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  {
    collection: "Users",
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  }
});

userSchema.pre("save", function (next) {
  if (this.isModified("confirmPassword")) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);

      this.confirmPassword = hash;
      next();
    });
  }
});

userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is Missing, no Compare");
  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log("Eror while comparing", error.message);
  }
};

userSchema.statics.isThisEmailInUse = async function (email) {
  const user = await this.findOne({ email });
  return user ? true : false;
};

module.exports = mongoose.model("User", userSchema);

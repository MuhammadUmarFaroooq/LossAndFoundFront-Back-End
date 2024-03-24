const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const VerificationTokenSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: true,
    },
    token: {
      type: String,
      require: true,
    },
    CreatedAt: {
      type: Date,
      expires: 3600,
      default: Date.now(),
    },
  },
  {
    collection: "VerificationToken",
    timestamps: true,
  }
);

VerificationTokenSchema.pre("save", function (next) {
  if (this.isModified("token")) {
    bcrypt.hash(this.token, 8, (err, hash) => {
      if (err) return next(err);

      this.token = hash;
      next();
    });
  }
});

VerificationTokenSchema.methods.compareToken = async function (token) {
  if (!token) throw new Error("Password is Missing, no Compare");
  try {
    const result = await bcrypt.compare(token, this.token);
    return result;
  } catch (error) {
    console.log("Eror while comparing", error.message);
  }
};

module.exports = mongoose.model(
  "VerificationTokenSchema",
  VerificationTokenSchema
);

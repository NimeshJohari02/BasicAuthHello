const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email Not Valid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (value.length <= 6) {
        throw new Error("The Password Should Be Greater than 6 Letters");
      }
      if (value.toLowerCase().includes("password")) {
        throw new Error(" 'Password' Not Allowed ");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  console.log("Before Save");
  const user = this;
  if (user.isDirectModified("password")) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateToken = async function () {
  let user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "NewSecretToken");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, pass) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("Unable To Find User By Email");
  }
  const matchedPassword = await bcrypt.compare(pass, user.password);
  if (!matchedPassword) {
    throw new Error("The User And The Passwords do not match");
  }
  return user;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userData = user.toObject();
  delete userData.password;
  delete userData.tokens;
  return userData;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

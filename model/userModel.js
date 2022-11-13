import mongoose from "mongoose";
import validator from "validator";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import dotenv from 'dotenv'
dotenv.config()
const JWT = process.env.JWT

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Enter a valid email address");
      }
    },
  },
  password: {
    type: String,
    trim: true
  },
  images: [{
    name: {
      type: String
    },
    url: {
      type: String
    }
  },
    ,],
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  },],
}, {
  timestamps: true
});

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, JWT, { expiresIn: '1h' });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({
    email
  });
  if (!user) {
    throw new Error("Invalid Username or Sign up first !!");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid Password!");
  }
  return user;
};

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const User = mongoose.model("User", userSchema);

export default User
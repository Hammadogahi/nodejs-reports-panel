const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter a Name"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already Registered"],
      lowercase: true,
      validate: [isEmail, "Please enter a valid Email"],
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "The password must be at least 6 characters"],
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

userSchema.post("save", function (doc, next) {
  console.log("New User was created and created.", doc);
  next();
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({
    email
  })
  if(user) {
    const auth = await bcrypt.compare(password, user.password)
    if(auth) {
      return user;
    }
    throw Error('Incorrect password');
  }

  throw Error('Incorrect email')
}

module.exports = mongoose.model("User", userSchema);

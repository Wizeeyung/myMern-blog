import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  profilePicture:{
    type: String,
    default: "https://cdn.pixabay.com/photo/2012/04/26/19/43/profile-42914_640.png" 
  },

  //we dont change a user to an admin directly from the front end or api routes, instead we change it in the mongoDB database
  isAdmin: {
    type: Boolean,
    default: false,
  },
}, {timestamps: true}
);

const User = mongoose.model('User', userSchema);

export default User;
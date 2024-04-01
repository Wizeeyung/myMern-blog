import User from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req, res)=> {
  res.json({message: 'API seems to be working on port!'})
}

export const updateUser = async (req, res, next) => {

  //we have to check if the user is authenticated , cause only signed in user can change its own information, would create a function to verify user in the util folder
  //req.user.id is coming from the verifyToken Middleware while req.params.userId is coming from api/user/update/:userId
  if (req.user.id !== req.params.userId){
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }

  if(req.body.password){
    if(req.body.password.length < 6){
      return next(errorHandler(400, 'Password must be at least 6 characters'))
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10)
  }

  if(req.body.username){
  if(req.body.username.length < 7 || req.body.username.length > 20){
    return next(errorHandler(400, 'Username must be between 7 and 20 characters'))
  }

  if(req.body.username.includes(' ')){
    return next(errorHandler(400, 'Username cannot be used'))
  }

  //if the username does not match from a-z , 0-9
  if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
    return next(errorHandler(400, 'Username can only contain letters and numbers'))
  }
};

  //because we want to relate with the database we have to use a try and catch block
  try{
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
      $set: {
        username: req.body.username,
        email: req.body.email,
        profilePicture: req.body.profilePicture,
        password: req.body.password
      }
    }, {new: true});
    const {password, ...rest} = updatedUser._doc;
    res.status(200).json(rest)

  } catch (error){
    next(error)
  }
};
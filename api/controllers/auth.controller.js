import User from "../models/user.models.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) =>{
  //get the body from req.body by destructuring
  const {username, email, password} = req.body;

  //if all of req.body properties are not present then give a message that all fields are required
  if(!username || !email || !password || username === '' || email === '' || password === ''){
    // instead of return res.status(400).json({message: 'All fields are required'}) we can use the error handler function and the next
    next(errorHandler(400, 'All fields are required'))
  }

  //creating hashed password using bcrypt
  const hashedPassword = bcryptjs.hashSync(password, 10)
  // console.log(req.body)

  //get the User model by passing req.body properties to the User model
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try{
    await newUser.save();
    res.json('Signup succesful')
  }catch (error){
    //this would go to the next middleware named error, which is the error middleware created in index.js
    next(error)
  }

  
}
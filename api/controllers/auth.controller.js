import User from "../models/user.models.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

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

  
};



export const signin = async (req, res, next) => {

  const {email, password} = req.body;
  if(!email || !password){
    return next(errorHandler(404, 'All fields are required'))
  }

  try{
    //remember to always use await as you're trying to get data from the database
    const validUser = await User.findOne({email});
    if(!validUser){
      return next(errorHandler(404, 'user not found'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    //always remember to add return statement to the if statement so it doesnt go to the next line
    if(!validPassword){
      return next(errorHandler(400, 'Invalid password'))
    }

    //to get the token we use the json web token and also use a secret key
    const token = jwt.sign(
      {id: validUser._id},
      process.env.JWT_SECRETKEY, 
    );

    //destructure the valid user and dont forget to give the password a variable and also use ._doc to get only the metadata available in the validUser
    const {password: pass, ...rest} = validUser._doc

    res.status(200).cookie('access_token', token,{httpOnly: true}).json(rest);
  

  }catch (error){
    next(error)

  }

}
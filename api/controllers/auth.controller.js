import User from "../models/user.models.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) =>{
  //get the body from req.body by destructuring
  const {username, email, password} = req.body;

  //if all of req.body properties are not present then give a message that all fields are required
  if(!username || !email || !password || username === '' || email === '' || password === ''){
    return res.status(400).json({message: 'All fields are required'})
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
    res.status(500).json({message: error.message})
  }

  
}
import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const veriifyToken = (req, res, next) => {
  //need to get the cookies from the browser, which we have used in the SignIn API route which name of the cookie is 'access_token'
  //for it to work need to install cookie-parser and initialize it in index.js
  const token = req.cookies.access_token;

  if(!token){
    return next(errorHandler(401, 'Unauthorized'));
  }
  jwt.verify(token, process.env.JWT_SECRETKEY, (err, user) =>{
    if(err){
      return next(errorHandler(401, 'Unauthorized'));
    }
    req.user = user;
    next();
  })
}
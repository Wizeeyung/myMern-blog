import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) =>{
  try{
    const {content, postId, userId} = req.body;

    if(userId != req.user.id){
      return next(errorHandler(403, 'You are not allowed to create this comment'));
    }

    const newComment = new Comment({
      content,
      postId,
      userId
    });

    await newComment.save();

    res.status(200).json(newComment);
 
  }catch (error){
    next(error);
  }
};



export const getPostComments = async (req, res, next) =>{
  try{
      const comments = await Comment.find({postId: req.params.postId}).sort({
        createdAt: -1
      });

      res.status(200).json(comments)
  } catch (error) {
    next(error);
  }

};



export const likeComment = async(req, res, next) =>{
  try{
    const comment = await Comment.findbyId(req.params.commentId);

    if(!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }

    //we need to be sure this user id coming from the verifyToken is inside the inside the comment as the same user id
    const userIndex = comment.likes.indexOf(req.user.id)

    //using indexOf when you get -1 it means the user id is not available in the comment data, so you push the likes of this user in the comment to make it available
    if(userIndex === -1){
      comment.numberOfLikes =+1;
      comment.likes.push(req.user.id);
    }else{
      // if the user id is present then remove the user from the likes of the comment data
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();
    res.status(200).json(comment);

  }catch (error){
    next(error);

  }
};



import { errorHandler } from "../utils/error.js";
import Post from "../models/post.models.js";

export const createPost = async (req, res, next) =>{
  if(!req.user.isAdmin){
    return next(errorHandler(403, 'You are not allowed to create a post'))
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'please provide all required fields'))
  }

  const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

  const newPost = new Post({
    ...req.body, 
    slug, 
    userId: req.user.id,
  });
  try{
    const savedPost = await newPost.save();
    res.status(201).json(savedPost)
  }catch (error){
    next(error)
  }

};


//getposts request
export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.userId && {userId : req.query.userId}),
      ...(req.query.category && {category: req.query.category}),
      ...(req.query.slug && {slug: req.query.slug}),
      ...(req.query.postId && {_id: req.query.postId}),
      ...(req.query.searchTerm && {
        $or: [
          {title: {$regex: req.query.searchTerm, $options: 'i'}},
          {content: {$regex: req.query.searchTerm, $options: 'i'}}
        ]
      })
    }).sort({updatedAt: sortDirection}).skip(startIndex).limit(limit);

    //getting total post
    const totalPosts = await Post.countDocuments();

    //getting the last month post
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );


    const lastMonthPosts = await Post.countDocuments({
      createdAt: {$gte: oneMonthAgo}
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    })

  } catch (error){
    next(error);
  }
};




export const deletePost = async (req, res, next) =>{
  if(!req.user.isAdmin || req.user.id !==req.params.userId){
    return next(errorHandler(403, 'You are not allowed to delete the post'))
  }

  try{
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  }catch (error){
    next(error);
  }

}



export const updatePost = async (req, res, next) => {
  //if user is not an admin or if user.id from the verified token is not equal to the user.id of the params which is the route of the current user we would be navigating to then give an error
  if(!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }

  try{
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId,
    {
      $set: {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image 
      }
    }, {new: true});
    res.status(200).json(updatedPost);

  }catch (error){
    next(error);

  }
}
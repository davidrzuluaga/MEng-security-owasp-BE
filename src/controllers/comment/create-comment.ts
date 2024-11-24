import { RequestHandler } from "express";
import SecurityManager from "../../modules/security";
import Comment from "../../db/models/comments.model";

export const createComment: RequestHandler = async (req, res) => {
  try {
    const { authenticatedUserId, postId, content } = req.body;

    // Sanitize the input content
    const sanitizedContent = SecurityManager.sanitizeInput(content);

    const newComment = await Comment.create({
      content: sanitizedContent,
      post_id: postId,
      author_id: authenticatedUserId,
      timestamp: new Date(),
    });

    if (newComment) {
      return res.status(201).json({ comment: newComment });
    } else {
      return res.status(400).json({ message: "Failed to create comment" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating comment", error });
  }
};

import { Request, Response } from "express";
import SecurityManager from "../../modules/security";
import Comment from "../../db/models/comments.model";

class CommentController {
  /**
   * Creates a new comment.
   *
   * @param {Request} req - The request object containing the comment details.
   * @param {Response} res - The response object to send the created comment or error message.
   * @returns {Promise<Response>} The response object with the created comment or an error message.
   *
   * @property {string} req.body.author_name - The name of the comment's author.
   * @property {string} req.body.post_id - The ID of the post the comment belongs to.
   * @property {string} req.body.content - The content of the comment.
   */
  async createComment(req: Request, res: Response): Promise<Response> {
    try {
      const { author_name, post_id, content } = req.body;

      const newComment = await Comment.create({
        content: SecurityManager.sanitizeInput(content),
        post_id,
        author_name: SecurityManager.sanitizeInput(author_name),
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
  }
}

export default new CommentController();

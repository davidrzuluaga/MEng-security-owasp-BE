import { Request, Response } from "express";
import SecurityManager from "../../modules/security";
import Comment from "../../db/models/comments.model";

class CommentController {
  async create(req: Request, res: Response): Promise<Response> {
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

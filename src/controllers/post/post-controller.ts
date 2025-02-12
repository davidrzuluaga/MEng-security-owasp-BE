import { Request, Response } from "express";
import { Post } from "../../db/models";
import { Op, WhereOptions } from "sequelize";
import SecurityManager from "../../modules/security";
import { PostType } from "../../types/post";

class PostController {
  /**
   * Retrieves all posts with optional title filtering.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {string} [req.query.title] - Optional title filter.
   * @returns {Promise<Response>} JSON response with posts.
   */
  public async getAllPosts(req: Request, res: Response): Promise<Response> {
    try {
      let filters: WhereOptions = {
        deletedAt: null,
      };

      if (req.query.title && typeof req.query.title === "string") {
        filters = {
          ...filters,
          title: {
            [Op.iLike]: `%${SecurityManager.sanitizeInput(req.query.title)}%`,
          },
        };
      }

      const posts = await Post.findAll({
        where: filters,
        order: [["createdAt", "DESC"]],
        include: [
          {
            association: "comments",
            where: { deletedAt: null },
            required: false,
            order: [["createdAt", "DESC"]],
          },
        ],
      });

      return res.status(200).json({ posts, success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "error" });
    }
  }
  /**
   * Creates a new post.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {string} req.body.title - The title of the post.
   * @param {string} req.body.content - The content of the post.
   * @param {string} req.body.author_name - The author of the post.
   * @returns {Promise<Response>} JSON response with created post.
   */
  public async createPost(req: Request, res: Response): Promise<Response> {
    try {
      const { title, content, author_name } = req.body;

      if (!title || !content || !author_name) {
        return res.status(400).json({ message: "Title and post are required" });
      }

      let newPost = {
        title: SecurityManager.sanitizeInput(title),
        content: SecurityManager.sanitizeInput(content),
        author_name: SecurityManager.sanitizeInput(author_name),
      } as PostType;

      if (author_name) {
        newPost = await Post.create(newPost);
      }

      if (newPost?.id) {
        return res.status(201).json({ newPost });
      } else {
        return res.status(400).json({ newPost });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error" });
    }
  }
  /**
   * Edits an existing post by ID.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {string} req.params.id - The ID of the post to edit.
   * @param {string} [req.body.title] - The updated title of the post.
   * @param {string} [req.body.content] - The updated content of the post.
   * @param {string} [req.body.author_name] - The updated author name.
   * @returns {Promise<Response>} JSON response with updated post.
   */
  public async editPost(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { title, content, author_name } = req.body;

      const existingPost = await Post.findByPk(id);
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (title) existingPost.title = SecurityManager.sanitizeInput(title);
      if (content) existingPost.content = SecurityManager.sanitizeInput(content);
      if (author_name)
        existingPost.author_name = SecurityManager.sanitizeInput(author_name);

      const updatedPost = await existingPost.save();
      return res.status(200).json({ updatedPost });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error updating the post" });
    }
  }
}

export default new PostController();

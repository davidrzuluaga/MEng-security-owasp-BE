import request from "supertest";
import express, { Request, Response } from "express";
import PostController from "./post-controller";
import { Post } from "../../db/models";
import { Op } from "sequelize";
import SecurityManager from "../../modules/security";

const app = express();
app.use(express.json());
app.get("/posts", (req: Request, res: Response) =>
  PostController.getAllPostsByTitle(req, res)
);

jest.mock("../../db/models", () => ({
  Post: {
    findAll: jest.fn(),
  },
}));

jest.mock("../../modules/security", () => ({
  sanitizeInput: jest.fn((input: string) => input),
}));

describe("getAllPostsByTitle", () => {
  it("should return 400 if title is not present", async () => {
    const response = await request(app).get("/posts");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid title");
  });

  it("should return 200 and posts if title is valid", async () => {
    const mockPosts = [
      {
        id: 1,
        title: "Test Post",
        content: "Test Content",
        author_name: "Author",
      },
    ];
    (Post.findAll as jest.Mock).mockResolvedValue(mockPosts);

    const response = await request(app).get("/posts").query({ title: "Test" });

    expect(response.status).toBe(200);
    expect(response.body.posts).toEqual(mockPosts);
    expect(response.body.success).toBe(true);
  });

  it("should return 500 if there is a server error", async () => {
    (Post.findAll as jest.Mock).mockRejectedValue(new Error("Server error"));

    const response = await request(app).get("/posts").query({ title: "Test" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("error");
  });


  it("should prevent SQL injection", async () => {
    const maliciousInput = "'; DROP TABLE posts; --";
    (Post.findAll as jest.Mock).mockResolvedValue([]);
    
    const response = await request(app).get(`/posts?title=${maliciousInput}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ posts: [], success: true });
    const sanitizedInput = SecurityManager.sanitizeInput(maliciousInput)
    expect(Post.findAll).toHaveBeenCalledWith({
      where: {
        title: {
          [Op.iLike]: `%${sanitizedInput}%`,
        },
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          association: "comments",
          required: false,
          order: [["createdAt", "DESC"]],
        },
      ],
    });
  });
});

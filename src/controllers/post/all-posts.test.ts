import request from "supertest";
import express from "express";
import { Post } from "../../db/models";
import { Op } from "sequelize";
import PostController from "./post-controller";

const app = express();
app.get("/posts", PostController.getAllPosts);

jest.mock("../../db/models", () => ({
  Post: {
    findAll: jest.fn(),
  },
}));

describe("GET /posts", () => {
  it("should return all posts with status 200", async () => {
    const mockPosts = [
      {
        id: 1,
        title: "Post 1",
        createdAt: new Date()?.toDateString(),
        comments: [],
      },
    ];
    (Post.findAll as jest.Mock).mockResolvedValue(mockPosts);

    const response = await request(app).get("/posts");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ posts: mockPosts, success: true });
  });

  it("should return status 500 if there is an error", async () => {
    (Post.findAll as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/posts");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "error" });
  });

  it("should prevent SQL injection", async () => {
    const maliciousInput = "'; DROP TABLE posts; --";
    (Post.findAll as jest.Mock).mockResolvedValue([]);

    const response = await request(app).get(`/posts?title=${maliciousInput}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ posts: [], success: true });
    expect(Post.findAll).toHaveBeenCalledWith({
      where: {
        deletedAt: null,
        title: {
          [Op.iLike]: "% DROP TABLE posts %",
        },
      },
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
  });
});

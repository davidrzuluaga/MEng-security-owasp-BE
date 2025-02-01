import request from "supertest";
import express from "express";
import { editPost } from "./edit-post";
import Post from "../../db/models/posts.model";
import SecurityManager from "../../modules/security";

const app = express();
app.use(express.json());
app.put("/posts/:id", editPost);

jest.mock("../../db/models/posts.model");
jest.mock("../../modules/security");

describe("editPost", () => {
  it("should return 404 if the post is not found", async () => {
    (Post.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .put("/posts/1")
      .send({
        title: "New Title",
        post: "New Post",
        author_name: "New Author",
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Post not found" });
  });

  it("should update the post and return 200", async () => {
    const mockPost = {
      id: 1,
      title: "Old Title",
      post: "Old Post",
      author_name: "Old Author",
      save: jest.fn().mockResolvedValue({
        id: 1,
        title: "New Title",
        post: "New Post",
        author_name: "New Author",
      }),
    };

    (Post.findByPk as jest.Mock).mockResolvedValue(mockPost);
    (SecurityManager.sanitizeInput as jest.Mock).mockImplementation(
      (input) => input
    );

    const response = await request(app)
      .put("/posts/1")
      .send({
        title: "New Title",
        post: "New Post",
        author_name: "New Author",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      updatedPost: {
        id: 1,
        title: "New Title",
        post: "New Post",
        author_name: "New Author",
      },
    });
    expect(mockPost.save).toHaveBeenCalled();
  });

  it("should return 500 if there is an error", async () => {
    (Post.findByPk as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .put("/posts/1")
      .send({
        title: "New Title",
        post: "New Post",
        author_name: "New Author",
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Error updating the post" });
  });

  it("should sanitize inputs to prevent SQL injection", async () => {
    const mockPost = {
      id: 1,
      title: "Old Title",
      post: "Old Post",
      author_name: "Old Author",
      save: jest.fn().mockResolvedValue({
        id: 1,
        title: " DROP TABLE posts ",
        post: " DROP TABLE posts ",
        author_name: " DROP TABLE posts ",
      }),
    };

    (Post.findByPk as jest.Mock).mockResolvedValue(mockPost);

    const response = await request(app)
      .put("/posts/1")
      .send({
        title: "'; DROP TABLE posts; --",
        post: "'; DROP TABLE posts; --",
        author_name: "'; DROP TABLE posts; --",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      updatedPost: {
        id: 1,
        title: " DROP TABLE posts ",
        post: " DROP TABLE posts ",
        author_name: " DROP TABLE posts ",
      },
    });
    expect(mockPost.save).toHaveBeenCalled();
  });
});

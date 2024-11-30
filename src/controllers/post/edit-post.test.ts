import request from "supertest";
import express from "express";
import { editPost } from "./edit-post";
import Post from "../../db/models/posts.model";

const app = express();
app.use(express.json());
app.put("/posts/:id", editPost);

jest.mock("../../db/models/posts.model");

describe("editPost", () => {
  it("should update the post and return the updated post", async () => {
    const mockPost = {
      id: 1,
      title: "Old Title",
      post: "Old Post",
      save: jest
        .fn()
        .mockResolvedValue({ id: 1, title: "New Title", post: "New Post" }),
    };
    (Post.findByPk as jest.Mock).mockResolvedValue(mockPost);

    const response = await request(app)
      .put("/posts/1")
      .send({ title: "New Title", post: "New Post" });

    expect(response.status).toBe(200);
    expect(response.body.updatedPost).toEqual({
      id: 1,
      title: "New Title",
      post: "New Post",
    });
    expect(mockPost.save).toHaveBeenCalled();
  });

  it("should return 404 if the post is not found", async () => {
    (Post.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .put("/posts/1")
      .send({ title: "New Title", post: "New Post" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Post not found");
  });

  it("should return 500 if there is an error updating the post", async () => {
    (Post.findByPk as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .put("/posts/1")
      .send({ title: "New Title", post: "New Post" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error updating the post");
  });
});

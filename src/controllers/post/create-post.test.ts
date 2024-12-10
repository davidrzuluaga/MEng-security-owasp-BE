import request from "supertest";
import express from "express";
import { createPost } from "./create-post";
import Post from "../../db/models/posts.model";

const app = express();
app.use(express.json());
app.post("/posts", createPost);

jest.mock("../../db/models/posts.model");

describe("POST /posts", () => {
  it("should create a new post and return 201 status", async () => {
    const mockPost = {
      id: 1,
      title: "Test Title",
      post: "Test Post",
      user_id: 1,
    };
    (Post.create as jest.Mock).mockResolvedValue(mockPost);

    const response = await request(app)
      .post("/posts")
      .set("user", JSON.stringify({ id: 1 }))
      .send({ title: "Test Title", post: "Test Post"});

    expect(response.status).toBe(201);
    expect(response.body.client).toEqual(mockPost);
  });

  it("should return 400 status if post creation fails", async () => {
    (Post.create as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post("/posts")
      .set("user", JSON.stringify({ id: 1 }))
      .send({ title: "Test Title", post: "Test Post"});

    expect(response.status).toBe(400);
    expect(response.body.client).toBeNull();
  });

  it("should return 500 status if there is a server error", async () => {
    (Post.create as jest.Mock).mockRejectedValue(new Error("Server Error"));

    const response = await request(app)
      .post("/posts")
      .set("user", JSON.stringify({ id: 1 }))
      .send({ title: "Test Title", post: "Test Post"});

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("error");
    expect(response.body.error).toBeDefined();
  });
});

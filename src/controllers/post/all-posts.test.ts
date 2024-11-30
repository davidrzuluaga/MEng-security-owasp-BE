import request from "supertest";
import express from "express";
import { getAllPosts } from "./all-posts";
import Post from "../../db/models/posts.model";

const app = express();
app.get("/posts", getAllPosts);

jest.mock("../../db/models/posts.model");

describe("GET /posts", () => {
  it("should return all posts with status 200", async () => {
    const mockPosts = [
      { id: 1, title: "Post 1" },
      { id: 2, title: "Post 2" },
    ];
    (Post.findAll as jest.Mock).mockResolvedValue(mockPosts);

    const response = await request(app).get("/posts");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ clients: mockPosts, success: true });
  });

  it("should return status 500 on error", async () => {
    (Post.findAll as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/posts");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "error",
      error: expect.any(Object),
    });
  });
});

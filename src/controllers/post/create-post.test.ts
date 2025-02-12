import request from "supertest";
import express from "express";
import Post from "../../db/models/posts.model";
import SecurityManager from "../../modules/security";
import PostController from "./post-controller";

const app = express();
app.use(express.json());
app.post("/posts", PostController.createPost);

jest.mock("../../db/models/posts.model");
jest.mock("../../modules/security");

describe("POST /posts", () => {
  it("should create a new post and return 201 status", async () => {
    const mockPost = {
      id: 1,
      title: "Test Title",
      content: "Test Post",
      author_name: "Test Author",
    };

    (SecurityManager.sanitizeInput as jest.Mock).mockImplementation(
      (input) => input
    );
    (Post.create as jest.Mock).mockResolvedValue(mockPost);

    const response = await request(app).post("/posts").send({
      title: "Test Title",
      content: "Test Post",
      author_name: "Test Author",
    });

    expect(response.status).toBe(201);
    expect(response.body.newPost).toEqual(mockPost);
  });

  it("should return 400 if title, post, or author_name is missing", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Title",
      content: "Test Post",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Title and post are required");
  });

  it("should return 500 if there is a server error", async () => {
    (SecurityManager.sanitizeInput as jest.Mock).mockImplementation(() => {
      throw new Error("Sanitization error");
    });

    const response = await request(app).post("/posts").send({
      title: "Test Title",
      content: "Test Post",
      author_name: "Test Author",
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("error");
  });

  it("should sanitize inputs to avoid SQL injection", async () => {
    const maliciousInput = "'; DROP TABLE posts; --";
    const sanitizedInput = "sanitized";

    (SecurityManager.sanitizeInput as jest.Mock).mockImplementation(
      (input) => sanitizedInput
    );
    (Post.create as jest.Mock).mockResolvedValue({
      id: 1,
      title: sanitizedInput,
      content: sanitizedInput,
      author_name: sanitizedInput,
    });

    const response = await request(app).post("/posts").send({
      title: maliciousInput,
      content: maliciousInput,
      author_name: maliciousInput,
    });

    expect(response.status).toBe(201);
    expect(response.body.newPost.title).toBe(sanitizedInput);
    expect(response.body.newPost.content).toBe(sanitizedInput);
    expect(response.body.newPost.author_name).toBe(sanitizedInput);
  });
});

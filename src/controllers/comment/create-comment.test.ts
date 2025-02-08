import request from "supertest";
import express from "express";
import Comment from "../../db/models/comments.model";
import SecurityManager from "../../modules/security";
import CommentController from "./comment-controller";

const app = express();
app.use(express.json());
app.post("/comments", CommentController.create);

jest.mock("../../db/models/comments.model");
jest.mock("../../modules/security");

describe("POST /comments", () => {
  it("should create a new comment and return 201 status", async () => {
    const mockComment = {
      id: 1,
      content: "Test content",
      post_id: 1,
      author_name: "Test Author",
    };

    (SecurityManager.sanitizeInput as jest.Mock).mockImplementation(
      (input) => input
    );
    (Comment.create as jest.Mock).mockResolvedValue(mockComment);

    const response = await request(app).post("/comments").send({
      author_name: "Test Author",
      post_id: 1,
      content: "Test content",
    });

    expect(response.status).toBe(201);
    expect(response.body.comment).toEqual(mockComment);
  });

  it("should return 400 status if comment creation fails", async () => {
    (SecurityManager.sanitizeInput as jest.Mock).mockImplementation(
      (input) => input
    );
    (Comment.create as jest.Mock).mockResolvedValue(null);

    const response = await request(app).post("/comments").send({
      author_name: "Test Author",
      post_id: 1,
      content: "Test content",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Failed to create comment");
  });

  it("should return 500 status if there is a server error", async () => {
    (SecurityManager.sanitizeInput as jest.Mock).mockImplementation(
      (input) => input
    );
    (Comment.create as jest.Mock).mockRejectedValue(new Error("Server error"));

    const response = await request(app).post("/comments").send({
      author_name: "Test Author",
      post_id: 1,
      content: "Test content",
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error creating comment");
  });

  it("should sanitize input to prevent SQL injection", async () => {
    const maliciousInput = "'; DROP TABLE comments; --";
    const sanitizedInput = "sanitized";

    (SecurityManager.sanitizeInput as jest.Mock).mockImplementation(
      (input) => sanitizedInput
    );
    (Comment.create as jest.Mock).mockResolvedValue({
      id: 1,
      content: sanitizedInput,
      post_id: 1,
      author_name: sanitizedInput,
    });

    const response = await request(app).post("/comments").send({
      author_name: maliciousInput,
      post_id: 1,
      content: maliciousInput,
    });

    expect(response.status).toBe(201);
    expect(response.body.comment.content).toBe(sanitizedInput);
    expect(response.body.comment.author_name).toBe(sanitizedInput);
    expect(SecurityManager.sanitizeInput).toHaveBeenCalledWith(maliciousInput);
  });
});

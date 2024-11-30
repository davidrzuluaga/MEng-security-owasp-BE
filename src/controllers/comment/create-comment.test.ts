import request from "supertest";
import express from "express";
import { createComment } from "./create-comment";
import Comment from "../../db/models/comments.model";
import SecurityManager from "../../modules/security";

const app = express();
app.use(express.json());
app.post("/comments", createComment);

jest.mock("../../db/models/comments.model");
jest.mock("../../modules/security");

describe("POST /comments", () => {
  it("should create a new comment and return 201 status", async () => {
    const mockComment = {
      content: "Test comment",
      post_id: 1,
      author_id: 1,
      timestamp: (new Date())?.toDateString(),
    };

    (SecurityManager.sanitizeInput as jest.Mock).mockReturnValue(
      "Test comment"
    );
    (Comment.create as jest.Mock).mockResolvedValue(mockComment);

    const response = await request(app).post("/comments").send({
      authenticatedUserId: 1,
      postId: 1,
      content: "Test comment",
    });

    expect(response.status).toBe(201);
    expect(response.body.comment).toEqual(mockComment);
  });

  it("should return 400 status if comment creation fails", async () => {
    (SecurityManager.sanitizeInput as jest.Mock).mockReturnValue(
      "Test comment"
    );
    (Comment.create as jest.Mock).mockResolvedValue(null);

    const response = await request(app).post("/comments").send({
      authenticatedUserId: 1,
      postId: 1,
      content: "Test comment",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Failed to create comment");
  });

  it("should return 500 status if there is a server error", async () => {
    (SecurityManager.sanitizeInput as jest.Mock).mockReturnValue(
      "Test comment"
    );
    (Comment.create as jest.Mock).mockRejectedValue(new Error("Server error"));

    const response = await request(app).post("/comments").send({
      authenticatedUserId: 1,
      postId: 1,
      content: "Test comment",
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error creating comment");
  });
});

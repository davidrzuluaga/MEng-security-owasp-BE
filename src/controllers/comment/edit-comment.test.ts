import request from "supertest";
import express from "express";
import { editComment } from "./edit-comment";
import Comment from "../../db/models/comments.model";
import SecurityManager from "../../modules/security";

const app = express();
app.use(express.json());
app.put("/comments/:id", editComment);

jest.mock("../../db/models/comments.model");
jest.mock("../../modules/security");

describe("editComment", () => {
  let mockComment: any;

  beforeEach(() => {
    mockComment = {
      id: 1,
      author_id: 1,
      content: "Original content",
      save: jest.fn().mockResolvedValue(this),
    };

    (Comment.findByPk as jest.Mock).mockResolvedValue(mockComment);
    (SecurityManager.checkAccessRights as jest.Mock).mockReturnValue(true);
    (SecurityManager.sanitizeInput as jest.Mock).mockImplementation(
      (input) => input
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if comment is not found", async () => {
    (Comment.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .put("/comments/1")
      .send({
        authenticatedUserId: 1,
        userRole: "user",
        content: "Updated content",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Comment not found");
  });

  it("should return 403 if user is not authorized", async () => {
    (SecurityManager.checkAccessRights as jest.Mock).mockReturnValue(false);

    const response = await request(app)
      .put("/comments/1")
      .send({
        authenticatedUserId: 2,
        userRole: "user",
        content: "Updated content",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Forbidden: Access denied");
  });

  it("should return 500 if there is an error", async () => {
    (Comment.findByPk as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const response = await request(app)
      .put("/comments/1")
      .send({
        authenticatedUserId: 1,
        userRole: "user",
        content: "Updated content",
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error editing comment");
  });
});

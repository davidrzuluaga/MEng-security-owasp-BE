import request from "supertest";
import express from "express";
import { deleteComment } from "./delete-comment";
import Comment from "../../db/models/comments.model";
import SecurityManager from "../../modules/security";

const app = express();
app.use(express.json());
app.delete("/comments/:id", deleteComment);

jest.mock("../../db/models/comments.model");
jest.mock("../../modules/security");

describe("DELETE /comments/:id", () => {
  let mockComment: any;

  beforeEach(() => {
    mockComment = {
      id: 1,
      author_id: 1,
      destroy: jest.fn(),
    };
    (Comment.findByPk as jest.Mock).mockResolvedValue(mockComment);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a comment if the user is authorized", async () => {
    (SecurityManager.checkAccessRights as jest.Mock).mockReturnValue(true);

    const response = await request(app)
      .delete("/comments/1")
      .send({ authenticatedUserId: 1, userRole: "user" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comment deleted successfully");
    expect(mockComment.destroy).toHaveBeenCalled();
  });

  it("should return 404 if the comment is not found", async () => {
    (Comment.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .delete("/comments/1")
      .send({ authenticatedUserId: 1, userRole: "user" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Comment not found");
  });

  it("should return 403 if the user is not authorized", async () => {
    (SecurityManager.checkAccessRights as jest.Mock).mockReturnValue(false);

    const response = await request(app)
      .delete("/comments/1")
      .send({ authenticatedUserId: 2, userRole: "user" });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Forbidden: Access denied");
    expect(mockComment.destroy).not.toHaveBeenCalled();
  });

  it("should return 500 if there is a server error", async () => {
    (Comment.findByPk as jest.Mock).mockRejectedValue(
      new Error("Server error")
    );

    const response = await request(app)
      .delete("/comments/1")
      .send({ authenticatedUserId: 1, userRole: "user" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error deleting comment");
  });
});

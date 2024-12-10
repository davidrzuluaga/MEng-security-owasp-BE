import request from "supertest";
import express from "express";
import { editPost } from "./edit-post";
import Post from "../../db/models/posts.model";
import { AuthenticatedRequest } from "../../middlewares/check-permissions";

const app = express();
app.use(express.json());
app.put("/posts/:id", editPost);

jest.mock("../../db/models/posts.model");

describe("editPost", () => {
  let mockPost: any;

  beforeEach(() => {
    mockPost = {
      id: 1,
      title: "Original Title",
      post: "Original Post",
      user_id: 1,
      save: jest.fn().mockResolvedValue(this),
    };
    (Post.findByPk as jest.Mock).mockResolvedValue(mockPost);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update the post if the user is authenticated and owns the post", async () => {
    const updatedData = { title: "Updated Title", post: "Updated Post" };
    const response = await request(app)
      .put("/posts/1")
      .set("user", JSON.stringify({ id: 1 }))
      .send(updatedData)

    expect(response.status).toBe(200);
    expect(response.body.updatedPost.title).toBe(updatedData.title);
    expect(response.body.updatedPost.post).toBe(updatedData.post);
    expect(mockPost.save).toHaveBeenCalled();
  });

  it("should return 404 if the post is not found", async () => {
    (Post.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .put("/posts/1")
      .send({ title: "Updated Title", post: "Updated Post" })
      .set("user", JSON.stringify({ id: 1 }));

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Post not found");
  });

  it("should return 401 if the user does not own the post", async () => {
    const response = await request(app)
      .put("/posts/1")
      .send({ title: "Updated Title", post: "Updated Post" })
      .set("user", JSON.stringify({ id: 2 }));

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Forbidden: You are not allowed to delete this post"
    );
  });

  it("should return 500 if there is an error updating the post", async () => {
    mockPost.save.mockRejectedValue(new Error("Save error"));

    const response = await request(app)
      .put("/posts/1")
      .send({ title: "Updated Title", post: "Updated Post" })
      .set("user", JSON.stringify({ id: 1 }));

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error updating the post");
  });
});

import request from "supertest";
import express from "express";
import { getOneUser } from "./get-one";
import User from "../../db/models/user.model";

const app = express();
app.use(express.json());
app.post("/get-one", getOneUser);

jest.mock("../../db/models/user.model");

describe("GET /get-one", () => {
  it("should return a user when email is provided", async () => {
    const mockUser = { id: 1, email: "test@example.com", name: "Test User" };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .post("/get-one")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual(mockUser);
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      attributes: { exclude: ["password"] },
    });
  });
});

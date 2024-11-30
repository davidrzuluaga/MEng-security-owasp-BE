import request from "supertest";
import express from "express";
import { getAllUsers } from "./get-all";
import User from "../../db/models/user.model";

const app = express();
app.use(express.json());
app.post("/get-all-users", getAllUsers);

jest.mock("../../db/models/user.model");

describe("GET /get-all-users", () => {
  it("should return all users when no keyword is provided", async () => {
    const mockUsers = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Doe", email: "jane@example.com" },
    ];
    (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

    const response = await request(app).post("/get-all-users").send({});
    expect(response.status).toBe(200);
    expect(response.body.users).toEqual(mockUsers);
  });

  it("should return filtered users when keyword is provided", async () => {
    const mockUsers = [{ id: 1, name: "John Doe", email: "john@example.com" }];
    (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

    const response = await request(app)
      .post("/get-all-users")
      .send({ keyword: "John" });
    expect(response.status).toBe(200);
    expect(response.body.users).toEqual(mockUsers);
  })
});

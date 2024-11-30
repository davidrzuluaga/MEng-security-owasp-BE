import request from "supertest";
import express from "express";
import { signIn } from "./sign-in";
import User from "../../db/models/user.model";
import SecurityManager from "../../modules/security";

const app = express();
app.use(express.json());
app.post("/sign-in", signIn);

jest.mock("../../db/models/user.model");
jest.mock("../../modules/security");

describe("POST /sign-in", () => {
  it("should return 400 if email or password is missing", async () => {
    const response = await request(app).post("/sign-in").send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please pass email and password.");
  });

  it("should return 400 if user is not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    const response = await request(app)
      .post("/sign-in")
      .send({ email: "test@example.com", password: "password" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Authentication failed.");
  });

  it("should return 400 if password does not match", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      email: "test@example.com",
      password: "hashedpassword",
    });
    (SecurityManager.comparePassword as jest.Mock).mockResolvedValue(false);
    const response = await request(app)
      .post("/sign-in")
      .send({ email: "test@example.com", password: "password" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Authentication failed.");
  });

  it("should return 200 and a token if authentication is successful", async () => {
    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      role: "user",
      password: "hashedpassword",
    };
    (User.findOne as jest.Mock).mockResolvedValue(user);
    (SecurityManager.comparePassword as jest.Mock).mockResolvedValue(true);
    (SecurityManager.generateToken as jest.Mock).mockReturnValue("testtoken");

    const response = await request(app)
      .post("/sign-in")
      .send({ email: "test@example.com", password: "password" });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBe("JWT testtoken");
  });

  it("should return 500 if there is a server error", async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error("Database error"));
    const response = await request(app)
      .post("/sign-in")
      .send({ email: "test@example.com", password: "password" });
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal Server Error");
  });
});

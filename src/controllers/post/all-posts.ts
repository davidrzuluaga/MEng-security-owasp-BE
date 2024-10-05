import { RequestHandler } from "express";
import client from "../db";

export const getAllPosts: RequestHandler = async (req, res) => {
  try {
    await client.connect();
    client.query("SELECT * FROM posts", (err, result) => {
      if (err) {
        console.error("Error executing query", err);
      } else {
        return res.status(200).json({ rows: result.rows, success: !0 });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error", error });
  }
};

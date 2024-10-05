import { RequestHandler } from "express";
import client from "../db";

export const createPost: RequestHandler = async (req, res) => {
  try {
    const { title, post, user_id } = req.body;
    await client.connect();
    client.query(
      `INSERT INTO public.posts (created_at, updated_at, title, post, user_id) VALUES(now(), now(), '${title}', '${post}', ${user_id});`,
      (error, result) => {
        if (error) {
          console.error("Error executing query", error);
          return res.status(500).json({ message: "error", error });
        } else {
          return res
            .status(200)
            .json({ rows: result.rows, message: "registrado con éxito" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error", error });
  }
};

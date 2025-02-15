import { Sequelize } from "sequelize-typescript";
import Comment from "./comments.model";
import Post from "./posts.model";

describe("Comment Model", () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [Comment, Post],
    });
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });
  it("should not allow null content", async () => {
    try {
      await Comment.create({
        content: null,
        author_name: "Test Author",
        post_id: 1,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should not allow null author_name", async () => {
    try {
      await Comment.create({
        content: "This is a test comment",
        author_name: null,
        post_id: 1,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should not allow null post_id", async () => {
    try {
      await Comment.create({
        content: "This is a test comment",
        author_name: "Test Author",
        post_id: null,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

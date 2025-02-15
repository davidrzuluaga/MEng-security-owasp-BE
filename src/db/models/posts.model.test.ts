import { Sequelize } from "sequelize-typescript";
import Post from "./posts.model";
import Comment from "./comments.model";

describe("Post Model", () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    sequelize.addModels([Post, Comment]);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a post", async () => {
    const post = await Post.create({
      title: "Test Title",
      content: "Test Content",
      author_name: "Test Author",
    });

    expect(post.id).toBeDefined();
    expect(post.title).toBe("Test Title");
    expect(post.content).toBe("Test Content");
    expect(post.author_name).toBe("Test Author");
  });

  it("should associate comments with a post", async () => {
    const post = await Post.create({
      title: "Test Title",
      content: "Test Content",
      author_name: "Test Author",
    });

    const comment = await Comment.create({
      post_id: post.id,
      content: "Test Comment",
      author_name: "Test Author",
    });

    const comments = await post.$get("comments");
    expect(comments.length).toBe(1);
    expect(comments[0].content).toBe("Test Comment");
  });
});

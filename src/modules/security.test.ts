import SecurityManager from "./security";

describe("SecurityManager.sanitizeInput", () => {
  it("should remove <script> tags", () => {
    const input = '<script>alert("XSS")</script>';
    const output = SecurityManager.sanitizeInput(input);
    expect(output).toBe("");
  });

  it("should remove other HTML tags", () => {
    const input = "<div>Hello</div>";
    const output = SecurityManager.sanitizeInput(input);
    expect(output).toBe("Hello");
  });

  it("should remove single quotes, double quotes, and semicolons", () => {
    const input = `Hello 'world'; "test"`;
    const output = SecurityManager.sanitizeInput(input);
    expect(output).toBe("Hello world test");
  });

  it("should remove SQL comment indicators", () => {
    const input = "SELECT * FROM users --";
    const output = SecurityManager.sanitizeInput(input);
    expect(output).toBe("SELECT * FROM users ");
  });

  it("should remove backslashes", () => {
    const input = "C:\\Users\\test";
    const output = SecurityManager.sanitizeInput(input);
    expect(output).toBe("C:Userstest");
  });

  it("should return non-string input as is", () => {
    const input = 12345;
    const output = SecurityManager.sanitizeInput(input as any);
    expect(output).toBe(12345);
  });

  it("should handle empty string input", () => {
    const input = "";
    const output = SecurityManager.sanitizeInput(input);
    expect(output).toBe("");
  });

  it("should handle input with no special characters", () => {
    const input = "Hello world";
    const output = SecurityManager.sanitizeInput(input);
    expect(output).toBe("Hello world");
  });
});

import { setupRecording, setupAPI } from "../test/setup";
import { SaleorSDK } from "../src/core";
import { API_URI, TEST_AUTH_EMAIL, TEST_AUTH_PASSWORD } from "../config";
import { USER } from "../src/apollo/queries";

describe("auth api", () => {
  const context = setupRecording();
  const { client } = setupAPI();
  const saleor = SaleorSDK(client);

  beforeEach(() => {
    const { server } = context.polly;
    server.any().on("beforePersist", (_, recording) => {
      const requestJson = JSON.parse(recording.request.postData.text);
      const responseHeaders = recording.response.headers.filter(
        (el: any) => el.name !== "set-cookie"
      );

      delete requestJson.variables?.email;
      delete requestJson.variables?.password;

      recording.request.postData.text = JSON.stringify(requestJson);
      recording.response.cookies = [];
      recording.response.headers = responseHeaders;
    });
  });

  it("can login", async () => {
    const { data } = await saleor.auth.login(
      TEST_AUTH_EMAIL as string,
      TEST_AUTH_PASSWORD as string
    );
    expect(data.tokenCreate.user.id).toBeDefined();
    expect(data.tokenCreate.token).toBeDefined();
    expect(data.tokenCreate.errors).toHaveLength(0);
  });

  it("login caches user data", async () => {
    await saleor.auth.login(TEST_AUTH_EMAIL, TEST_AUTH_PASSWORD);
    const cache = client.readQuery({
      query: USER,
    });
    expect(cache).not.toBeNull();
    expect(cache).toBeDefined();
  });

  it("will throw an error if login credentials are invalid", async () => {
    const { data } = await saleor.auth.login("wrong@example.com", "wrong");
    expect(data.tokenCreate.user).toBeFalsy();
    expect(data.tokenCreate.token).toBeFalsy();
    expect(data.tokenCreate.errors).not.toHaveLength(0);
  });

  it("can register", async () => {
    const { data } = await saleor.auth.register(
      "register@example.com",
      "register",
      API_URI,
      "default-channel"
    );
    expect(data.accountRegister.accountErrors).toHaveLength(0);
  });

  it("logout clears user cache", async () => {
    await saleor.auth.login(TEST_AUTH_EMAIL, TEST_AUTH_PASSWORD);
    await saleor.auth.logout();
    const cache = client.readQuery({
      query: USER,
    });
    expect(cache).toBeNull();
  });
});

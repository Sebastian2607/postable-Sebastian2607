import express from "express";
import * as profileController from "./routes/Users/profile-controller.js";
import * as authController from "./routes/Users/auth-controller.js";
import * as postController from "./routes/Posts/post-controller.js";
import { authenticateHandler } from "./middlewares/authenticate.js";

const app = express();

app.use(express.json());

app.get("/", postController.getAllPostsHandler);
app.get("/posts/:username", postController.getPostsByUsernameHandler);
app.post("/posts", authenticateHandler, postController.createPostHandler);
app.patch("/posts/:postId", authenticateHandler, postController.updatePostHandler);
app.delete("/posts/:postId", authenticateHandler, postController.deletePostHandler);    

app.get("/me",  authenticateHandler, profileController.getMe);
app.patch("/me",  authenticateHandler, profileController.updateMe);
app.delete("/me",  authenticateHandler, profileController.deleteMe);

app.post("/login", authController.loginHandler);
app.post("/signup", authController.signupHandler);

app.listen(5500, () => { console.log("Server is running on port 5500"); })
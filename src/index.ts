import express from "express";
import * as profileController from "./routes/Users/profile-controller.js";
import * as authController from "./routes/Users/auth-controller.js";
import * as postController from "./routes/Posts/post-controller.js";
import * as likesController from "./routes/Posts/likes-controller.js"
import * as usersController from  "./routes/Admin/users-controller.js"
import { authenticateHandler } from "./middlewares/authenticate.js";
import { adminOnly } from "./middlewares/adminOnly.js";

const app = express();

app.use(express.json());

// User routes:
app.get("/posts", postController.getAllPostsHandler);
app.get("/posts/:username", postController.getPostsByUsernameHandler);
app.post("/posts", authenticateHandler, postController.createPostHandler);
app.patch("/posts/:postId", authenticateHandler, postController.updatePostHandler);
app.delete("/posts/:postId", authenticateHandler, postController.deletePostHandler);   

app.post("/posts/:postId/like", authenticateHandler, likesController.createLikeHandler)
app.delete("/posts/:postId/like", authenticateHandler, likesController.deleteLikeHandler)

app.get("/me",  authenticateHandler, profileController.getMe);
app.patch("/me",  authenticateHandler, profileController.updateMe);
app.delete("/me",  authenticateHandler, profileController.deleteMe);

app.post("/login", authController.loginHandler);
app.post("/signup", authController.signupHandler);

// Admin routes
app.get("/admin/users", adminOnly, usersController.getAllUsersHandler)
app.get("/admin/users/username/:username", adminOnly, usersController.getUserByUsernameHandler)
app.get("/admin/users/id/:id", adminOnly, usersController.getUserByIdHandler)

app.listen(5500, () => { console.log("Server is running on port 5500"); })
const express = require("express");
const UserRouter = require("./routes/UserRoutes");

const authfun = require("./middleware/auth");
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(UserRouter, authfun);
app.listen(port, () => console.log("Server at " + port));

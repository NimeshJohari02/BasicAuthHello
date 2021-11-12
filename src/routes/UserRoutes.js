const express = require("express");
const userRouter = new express.Router();
const User = require("../models/User");
const authfun = require("../middleware/auth");
require("../db/db");
userRouter.post("/users", async (req,res)=>{
				const newUser = new User(req.body);
				try{
				await newUser.save();
								const newToken = await newUser.generateToken();
								res.status(201).send({user:newUser,token:newToken});
				}

				catch(e){
								res.status(404).send(e);
				}
});
userRouter.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    // console.log(token);
    res.send({ user, token });
  } catch (e) {
    // console.log(e);
    res.status(404).send();
  }
});
userRouter.get("/users/me", authfun, async (req, res) => {
  res.send(req.user);
});

userRouter.post("/users/logout", authfun, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (el) => el.token !== req.currToken
    );
    await req.user.save();
    res.send("Logout Successfull");
  } catch (e) 
				{
								res.status(503).send(e);
				}
});

module.export= userRouter;

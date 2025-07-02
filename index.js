const express = require("express");
const app = express();
const main = require("./db");
const user = require("./user");
const validation = require("./validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authuser = require("./auth");
app.use(cookieParser());
app.use(express.json());

main()
  .then(() => {
    console.log("DB connected");

    app.listen(3000, () => {
      console.log("at port 3000");
    });

    app.post("/reg", async (req, res) => {
      try {
        validation(req.body);
        req.body.password = await bcrypt.hash(req.body.password, 10);
        await user.create(req.body);
        res.send("user register successfully");
      } catch (error) {
        res.status(400).send(error.message);
      }
    });

    app.post("/log", async (req, res) => {
      try {
        const people = await user.findOne({ email: req.body.email });
        if (!people) {
          throw new Error("Invalid login");
        }
        const pass = await bcrypt.compare(req.body.password, people.password);
        if (!pass) {
          throw new Error("Invalid login");
        }
        const token = jwt.sign({ _id: people._id, email: people.email }, "aaa");
        res.cookie("token", token);
        res.send("Login successfully");
      } catch (error) {
        res.status(400).send(error.message);
      }
    });

    app.get("/user", authuser, async (req, res) => {
      try {
        res.send(req.result);
      } catch (error) {
        res.status(400).send(error.message);
      }
    });

    app.get("/logout", (req, res) => {
      res.clearCookie("token");
      res.send("Logged out");
    });

    app.put("/user", authuser, async (req, res) => {
      try {
        const ans = await user.findByIdAndUpdate(req.result._id, {
          $set: { name: req.body.name, age: req.body.age },
        });
        if (ans) {
          res.send("user updated sucessfully");
        }
      } catch (error) {
        res.status(400).send(error.message);
      }
    });

    app.delete("/user", authuser, async (req, res) => {
      try {
        const ans = await user.findByIdAndDelete(req.result._id);
        if (ans) {
          res.send("Deleted");
        }
      } catch (error) {
        res.status(400).send(error.message);
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");

dotenv.config();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DBconnection Siccessfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/product", productRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running in port :5000");
});

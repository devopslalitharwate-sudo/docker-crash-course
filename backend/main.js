const express = require("express")
const cors = require("cors")

const sequelize = require("./config/database")

// models
const User = require("./models/UserModel")


//routes
const UserRoute  = require("./routes/UserRoute")


const app = express()
app.use(cors())
app.use(express.json())

const PORT = 5000
app.use("/api/users",UserRoute)

app.get("/api/",async(req,res) => {
    res.json({
      message:"Hello world"
    })
})



async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    await sequelize.sync({ alter: true });
    console.log("Models synced successfully!");

    app.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
    });

  } catch (err) {
    console.error("Database connection failed:", err);
  }
}


if(process.env.NODE_ENV !== "test"){
  startServer();
}

app.listen(PORT,"0.0.0.0",err => {
    console.log(`Listening on port: ${PORT}`)
}) 


module.exports = app
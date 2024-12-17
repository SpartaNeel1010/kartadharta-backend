const mongoConnect=require('./db')
const express=require('express')
const cors = require('cors');

const app= express()
app.use(cors())
app.use(express.json())
mongoConnect()

app.get("/",(req,res)=>{
    res.send("Hello this is the backend of our app")
})
app.get("/health",(req,res)=>{
    res.send("Hello this is the backend of our app")
})

const UserRoutes=require("./routes/user")
const AppointmentRoutes= require("./routes/appointment")

app.use("/user",UserRoutes)
app.use("/appointment",AppointmentRoutes)
const port = process.env.PORT || 8080
app.listen(port,()=>{
    console.log(`Listening at ${port}`)

})
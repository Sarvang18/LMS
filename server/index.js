import express from "express"
import dotenv from "dotenv"
import connectDB from "./database/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"


import userRoute from "./routes/user.route.js"
import courseRoute from "./routes/course.route.js"
import mediaRoute from "./routes/media.route.js"
import coursePurchaseRoute from "./routes/coursePurchase.route.js"
import courseProgress from "./routes/courseProgress.route.js"

dotenv.config({})

connectDB()

const app = express()

const PORT = process.env.PORT || 3000

// default middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));


// apis
app.use('/api/v1/media',mediaRoute)
app.use('/api/v1/user',userRoute) 
app.use('/api/v1/course',courseRoute)
app.use('/api/v1/purchase',coursePurchaseRoute) // razorpay
app.use('/api/v1/progress',courseProgress) 
 
app.listen(PORT,()=>{
    console.log(`Server listen at port ${PORT}`)
})


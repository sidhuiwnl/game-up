import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.route";
import userRoutes from "./routes/user.route"

const app = express();


app.use(cors({
    origin: "https://game-up-dusky.vercel.app",
}))



app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks",taskRoutes);
app.use("/api/v1/user",userRoutes)


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
    return
});

export default app;
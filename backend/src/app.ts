import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.ts";
import taskRoutes from "./routes/task-route.ts";
import userRoutes from "./routes/user.routes.ts";

const app = express();

app.use(express.json());
app.use(cors())



app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks",taskRoutes);
app.use("/api/v1/user",userRoutes)


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
    return
});

export default app;
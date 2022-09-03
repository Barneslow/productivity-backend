const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const noteRoutes = require("./routes/noteRoutes");
const taskRoutes = require("./routes/taskRoutes");
const emojiRoutes = require("./routes/emojiRoutes");
const autoReset = require("./controllers/automaticController");
const schedule = require("node-schedule");

const { errorHandler, notFound } = require("./middlewares/errorHandler");

const app = express();

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

db();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/emojis", emojiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on port ${PORT}`));

schedule.scheduleJob("0 0 * * 1", () => {
  autoReset.resetWeeklyGoals();
  console.log("Weekly Goal Reset");
});

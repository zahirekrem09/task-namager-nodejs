const express = require("express");
const helmet = require("helmet");
const config = require("./config");
const loaders = require("./loaders");
const { ProjectRoutes, UserRoutes } = require("./routes");

// !! start all config
config();
// !! load servises
loaders();

// !! start express app
const app = express();
// !! json parser middleware
app.use(express.json());
// !! helmet header protection middleware
app.use(helmet());

const PORT = process.env.PORT || 3232;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  app.use("/api/v1/projects", ProjectRoutes);
  app.use("/api/v1/users", UserRoutes);
});

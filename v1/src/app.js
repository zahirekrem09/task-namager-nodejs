const express = require("express");
const helmet = require("helmet");
const fileUpload = require('express-fileupload');
const config = require('./config');
const loaders = require('./loaders');
const { ProjectRoutes, UserRoutes, SectionRoutes, TaskRoutes } = require('./routes');
const events = require('./scripts/events');
const path = require('path');

// !! start all config
config();
// !! load servises
loaders();
// !! load events
events();

// !! start express app
const app = express();

// !! static files server
app.use('/uploads', express.static(path.join(__dirname, './', 'uploads')));

// !! json parser middleware
app.use(express.json());
// !! helmet header protection middleware
app.use(helmet());
// !! file upload middleware  req.files
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }
  })
);

const PORT = process.env.PORT || 3232;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // !! load all routes
  app.use('/api/v1/projects', ProjectRoutes);
  app.use('/api/v1/users', UserRoutes);
  app.use('/api/v1/sections', SectionRoutes);
  app.use('/api/v1/tasks', TaskRoutes);
  console.log('Routes loaded');
});

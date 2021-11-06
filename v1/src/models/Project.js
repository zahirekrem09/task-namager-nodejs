const Mongoose = require("mongoose");
const logger = require("../scripts/logger/Projects");
const ProjectSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_id: {
      type: Mongoose.Types.ObjectId,
      ref: "user",
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ProjectSchema.post("save", function (doc) {
  logger.log({
    level: "info",
    message: `Project ${doc.name} was saved`,
  });
});

module.exports = Mongoose.model("project", ProjectSchema);

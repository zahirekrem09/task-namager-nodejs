const Mongoose = require('mongoose');
const logger = require('../scripts/logger/Sections');
const SectionSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    user_id: {
      type: Mongoose.Types.ObjectId,
      ref: 'user'
    },
    project_id: {
      type: Mongoose.Types.ObjectId,
      ref: 'project'
    },
    order: {
      type: Number
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

SectionSchema.post('save', function (doc) {
  logger.log({
    level: 'info',
    message: `Section ${doc.name} was saved`
  });
});

module.exports = Mongoose.model('section', SectionSchema);

const Mongoose = require('mongoose');
const logger = require('../scripts/logger/Tasks');
const TaskSchema = new Mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    assigned_to: {
      type: Mongoose.Types.ObjectId,
      ref: 'user'
    },
    due_date: {
      type: Date
    },
    statuses: [String],
    section_id: {
      type: Mongoose.Types.ObjectId,
      ref: 'section'
    },
    user_id: {
      type: Mongoose.Types.ObjectId,
      ref: 'user'
    },
    project_id: {
      type: Mongoose.Types.ObjectId,
      ref: 'project'
    },
    is_completed: {
      type: Boolean,
      default: false
    },
    comments: [
      {
        comment: String,

        commented_at: {
          type: Date,
          default: Date.now
        },
        user_id: {
          type: Mongoose.Types.ObjectId,
          ref: 'user'
        }
      }
    ],
    media: [
      {
        file: String,
        user_id: {
          type: Mongoose.Types.ObjectId,
          ref: 'user'
        }
      }
    ],
    sub_tasks: [
      {
        type: Mongoose.Types.ObjectId,
        ref: 'task'
      }
    ],

    order: {
      type: Number
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

TaskSchema.post('save', function (doc) {
  logger.log({
    level: 'info',
    message: `Task ${doc.title} was saved`
  });
});

module.exports = Mongoose.model('task', TaskSchema);

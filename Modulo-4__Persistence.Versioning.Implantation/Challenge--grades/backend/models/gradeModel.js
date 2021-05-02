export default (mongoose) => {
  const gradeSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    }
  },
    { versionKey: false }
  );

  const gradeModel = mongoose.model('grades', gradeSchema, 'grades');
  return gradeModel;
};

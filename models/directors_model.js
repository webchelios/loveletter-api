import mongoose from "mongoose";

const DirectorsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  surname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  }
});

export default mongoose.model('Directors', DirectorsSchema);

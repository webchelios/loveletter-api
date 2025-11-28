import mongoose from "mongoose";

const MoviesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  }
});

export default mongoose.model('Movies', MoviesSchema);

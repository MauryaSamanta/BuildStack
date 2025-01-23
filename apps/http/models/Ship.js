import mongoose from 'mongoose';

const shipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Index for fast user-specific queries
  },
  title: {
    type: String,
    required: true,
  },
  diff:{
    type:String
  },
  project:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Project'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // Index for date-based queries
  },
});

export default mongoose.model('Ship', shipSchema);

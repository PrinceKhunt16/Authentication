import mongoose, { Promise } from "mongoose";

const connectToDB = async () => {
  try {
    const connection = mongoose.connect(process.env.MONGO_URI);

    if (connection.readyState == 1) {
      return
    }
  } catch (error) {
    return Promise.reject("Connection error", error);
  }
};

export default connectToDB;
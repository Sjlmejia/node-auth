import mongoose, {Schema} from "mongoose";

const useSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    img: {
      type: String,
    },
    roles: {
      type: [String],
      default: ['USER_ROLE'],
      enum: ['ADMIN_ROLE', 'USER_ROLE'],
    }
}); 

export const UserModel = mongoose.model('User', useSchema);
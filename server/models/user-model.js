import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [30, 'Name cannot exceed 30 characters'],
      minlength: [3, 'Name cannot be less than 3 characters']
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Please enter a valid email address']
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
      minlength: [8, 'Password must be at least 8 characters long'],
      maxlength: [30, 'Password cannot exceed 30 characters']
    },

    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },

    resetPasswordToken: {
      type: String,
      default: null
    },

    resetPasswordTokenExpire: {
      type: Date,
      default: null
    },

    department: {
      type: String,
      default: null
    },

    experties: {
      type: [String],
      default: [],
    },

    maxStudents: {
      type: Number,
      default: 10,
      min: [1, "At least one student must be assigned"],
      max: [50, "Maximum of 50 students can be assigned"],
    },

    assignedStudents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    }],

    supervisors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    }],

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null
    }
  },
  { timestamps: true }
)

// Hash password
userSchema.pre('save', async function () {
  const bcrypt = await import('bcryptjs')

  if (!this.isModified('password')) return

  this.password = await bcrypt.hash(this.password, 12)
})

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User
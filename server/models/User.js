const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  // This is simplified for the example. In a real app, you MUST hash passwords.
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['client', 'freelancer'], 
    required: true 
  },
  profile: {
      bio: { 
        type: String, 
        default: '' 
      },
      skills: [{ 
        type: String 
      }]
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
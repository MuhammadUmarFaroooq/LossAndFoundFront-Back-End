const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      default: "Other",
    },
    color: {
      type: String,
      default: "Other",
    },
    datePosted: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dateOfItem: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      validate: {
        validator: (images) => Array.isArray(images) && images.length <= 5,
        message: "Images must be an array of up to 5 filenames",
      },
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "Posts",
    timestamps: true,
  }
);

// Create indexes for efficient querying
postSchema.index({ expirationDate: 1 });
postSchema.index({ isExpired: 1 });

// Mongoose middleware for automatic expiration/deletion
postSchema.pre("remove", async function (next) {
  const now = new Date();
  if (this.expirationDate < now && !this.isDeleted) {
    // Expired post: schedule deletion after 5 days of reminder
    const deletionDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    setTimeout(() => {
      this.deleteOne({ _id: this._id }).exec();
    }, deletionDate - now);
  }
  next();
});

module.exports = mongoose.model("Post", postSchema);

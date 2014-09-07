var PostSchema = new mongoose.Schema({
    user: String
  , content: String
  , published: { type: Date, default: Date.now }
  , space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space' }
  , link: String
}, {
    toJSON: { virtuals: true }
  , toObject: { virtuals: true }
  , shardkey: { _id: 'hashed' }
  , autoIndex: false
})

PostSchema.index({ _id: 'hashed' })
PostSchema.index({ published: 1 })

mongoose.model('Post', PostSchema)
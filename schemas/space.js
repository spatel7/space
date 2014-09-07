var SpaceSchema = new mongoose.Schema({
    name: String
  , shortname: String
  , posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', unique: true}]
  , created: { type: Date, default: Date.now }
  , lat: Number
  , lon: Number
}, {
    shardkey: { _id: 'hashed' }
  , autoIndex: false
});

SpaceSchema.index({ _id: 'hashed' });

mongoose.model('Space', SpaceSchema);
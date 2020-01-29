import { Schema, model } from 'mongoose'
import moment from 'moment'

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, //reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance'
  },
  due_back: { type: Date, default: Date.now }
})

BookInstanceSchema.virtual('url').get(function() {
  '/catalog/bookInstance/' + this._id
})

BookInstanceSchema.virtual('due_back_formatted').get(function() {
  return moment(this.due_back).format('MMMM Do, YYYY')
})

export default model('BookInstance', BookInstanceSchema)

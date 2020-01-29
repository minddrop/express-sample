import { Schema, model } from 'mongoose'

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date }
})

AuthorSchema.virtual('name').get(function() {
  const fullName =
    this.first_name && this.family_name
      ? this.family_name + ', ' + this.first_name
      : ''
  return fullName
})

AuthorSchema.virtual('lifespan').get(function() {
  return (
    this.date_of_death.getYear() - this.date_of_birth.getYear()
  ).toString()
})

AuthorSchema.virtual('url').get(function() {
  '/catalog/author/' + this._id
})

export default model('Author', AuthorSchema)

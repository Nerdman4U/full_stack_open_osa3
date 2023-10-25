const mongoose = require('mongoose')

const password = process.env.MONGODB_PASSWORD
//mongoose.options.overwriteModels = true
//const conn = new PhoneConnect(mongoose, password)

const url = `mongodb+srv://jonitoyryla2:${password}@yonisthebest.aguxysm.mongodb.net/phoneApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => {console.log("connected")})
    .catch((e) => {console.log("error connecting")})

const PhoneSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
          validator: function(v) { return /\d{3}-\d{7}/.test(v); },
          message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    }
})

PhoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', PhoneSchema)


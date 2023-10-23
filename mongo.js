const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password, if you want to add a person, give also a name and a number')
  process.exit(1)
}
const password = process.argv[2]
let name = null
let number = null
if (process.argv.length === 4) {
    name = process.argv[3]
}
else if (process.argv.length === 5) {
    name = process.argv[3]
    number = process.argv[4]
}

class PhoneConnect {
    constructor(db, password, action) {
        this.db = db
        this.password = password    
        this.action = action
        this.personSchema = null
        this.personModel = null
    }
    get mongoose() { return this.db }
    createSchema() {
      return new this.db.Schema({
          name: String,
          number: Number,
      })
    }
    createModel() {
      if (this.noteModel) {
        return this.noteModel
      }
      const personModel = this.db.model('Person', this.getOrCreateSchema())
      this.personModel = personModel
      return personModel
    }
    getOrCreateSchema() { 
      if (this.noteSchema) {
        return this.noteSchema
      }
      const noteSchema = this.createSchema()
      this.nodeSchema = noteSchema
      return noteSchema
    }
    connect() {
      if (!this.db) { console.log("no db"); return }
      const url = `mongodb+srv://jonitoyryla2:${password}@yonisthebest.aguxysm.mongodb.net/phoneApp?retryWrites=true&w=majority`      
      this.db.set('strictQuery', false)
      this.db.connect(url)      
    }
    disconnect() {
      this.db.connection.close()
    }
    // todo: rename printPhoneBook?
    getPersons() {
      if (!this.db) { console.log("no db"); return }
      console.log("Phonebook:")
      this.personModel.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
      })
      .catch((e) => { console.log("error, e:", e)})
      .finally(()  => {
        this.disconnect()
      })        
    }
    addPerson(name, number) {
      const person = new this.personModel({
        name: name,
        number: number
      })
      person.save().then(result => {})
      .catch((e) => {
        console.log('note saved! error:', e)
      })
      .finally(() => {
        this.disconnect()
      })  
    }
}

const conn = new PhoneConnect(mongoose, password)
conn.connect()
conn.createModel()
if (name && number) {
    conn.addPerson(name, number)
}
else {
    conn.getPersons()
}

// const note = new Note({
//   content: 'HTML is Easy 3',
//   important: true,
// })



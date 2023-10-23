// How to use:
// const conn = new PhoneConnect(mongoose, password)
// conn.connect()
// conn.addPerson(name, number)
// conn.getPersons()

class PhoneConnect {
    constructor(db, password, action) {
        this.db = db
        this.password = password    
        this.action = action
        this.personSchema = null
    }
    get mongoose() { return this.db }
    createSchema() {
      return new this.db.Schema({
          name: String,
          number: Number,
      })
    }
    // getOrCreateModel
    get personModel() {
      return this.db.model('Person', this.getOrCreateSchema()) 
    }
    getOrCreateSchema() { 
      if (this.personSchema) {
        console.log("getOrCreateSchema, old schema")
        return this.personSchema
      }
      console.log("getOrCreateSchema, new schema")
      const personSchema = this.createSchema()
      this.personSchema = personSchema
      return personSchema
    }
    connect() {
      if (!this.db) { console.log("no db"); return }
      const url = `mongodb+srv://jonitoyryla2:${this.password}@yonisthebest.aguxysm.mongodb.net/phoneApp?retryWrites=true&w=majority`      
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
      return this.personModel.find({}).then(result => {
        console.log("PhoneConnect.getPersons()", result.map((o) => [o.name,o.number]))
        return result
      })
      .catch((e) => { console.log("PhoneConnection error:", e)})
    }
    addPerson(name, number) {
      const person = new this.personModel({
        name: name,
        number: number
      })
      return person.save().then(result => {
        return result
      })
      .catch((e) => {
        console.log('addPerson() error:', e)
      })
    }
}

module.exports = PhoneConnect
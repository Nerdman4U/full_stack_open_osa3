const mongoose = require('mongoose')
const PhoneConnect = require('./src/phoneconnect')

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

const conn = new PhoneConnect(mongoose, password)
conn.connect()

if (name && number) {
    conn.addPerson(name, number)
    .finally(() => { conn.disconnect() })
}
else {
    console.log("getPersons()")
    conn.getPersons()
    .finally(() => { conn.disconnect() })
}


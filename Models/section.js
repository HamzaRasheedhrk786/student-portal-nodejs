const mongoose= require('mongoose');
const Schema = mongoose.Schema;
// defining schema for student
const SectionSchema = new Schema({
  name: String
})


module.exports = mongoose.model('tblsections',SectionSchema);
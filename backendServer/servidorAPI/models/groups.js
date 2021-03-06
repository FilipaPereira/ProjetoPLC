var mongoose = require('mongoose')

var groupsSchema = new mongoose.Schema({
    id: {type:String, required:true},
    nome: {type:String, required: true},
    avatar:  String,
    admins: {type: [String], required: true},
    members: [String],
    requests: [String],
    private: String,
    descricao: String,
    isDiscipline: {type: String, required: true},

})

module.exports = mongoose.model('groups',groupsSchema)
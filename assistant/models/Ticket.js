import mongoose from 'mongoose'


const ticketSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    status:{type:String,default:'TODO',enum:['TODO','in-progress','closed']},
    priority:{type:String,default:'medium',enum:['low','medium','high']},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    assignedTo:{type:mongoose.Schema.Types.ObjectId,ref:'User',default:null},
    deadline:{type:Date},
    tags:[{type:String}],
    helpfulNotes:{type:String},
    relatedSkills:[{type:String}],
    createdAt:{type:Date,default:Date.now}
},{timestamps:true
})

const Ticket=mongoose.models.Ticket || mongoose.model('Ticket',ticketSchema)
export default Ticket
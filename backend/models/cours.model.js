import mongoose from "mongoose";

const coursSchema = mongoose.Schema({

    titre : String,
    description : String,
    duree : Number,
    frais : Number,
    payent : Boolean,
    creator : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'utilisateur',
        require : true
    }
})
const CoursModel = mongoose.model('cours' ,coursSchema);
export default CoursModel;
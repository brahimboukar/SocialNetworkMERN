import mongoose from 'mongoose';


const GroupSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  superAdministrateur:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'utilisateur' }],
  administrateurs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'utilisateur'}],
  membres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'utilisateur' }],
  estPrive: { type: Boolean, default: false },
  demandeDeRejoindre: [{ type: mongoose.Schema.Types.ObjectId, ref: 'utilisateur' }],
  publicationEnAttente: [{ type: mongoose.Schema.Types.ObjectId, ref: 'publication' }],
  publicationPublie: [{ type: mongoose.Schema.Types.ObjectId, ref: 'publication' }],
  invitations: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'utilisateur', 
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
    },
  ],
});

const GroupModel = mongoose.model('groupe', GroupSchema);
export default GroupModel;

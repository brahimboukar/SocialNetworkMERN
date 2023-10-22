import User from'../models/user.model.js';
import Cours  from'../models/cours.model.js';

//CreateCours
export const add = (req , res ) => {

  const userId = res.locals.user.id
  
    const data = {
        titre : req.body.titre,
        description  :req.body.description,
        duree : req.body.duree,
        frais : req.body.frais,
        payent :  req.body.payent,
        creator : userId
        
    }
    
    const _cours = new Cours(data);

    _cours.save().then(
        (createdUser) => {
            res.status(200).json({message : "Cours added successfuly ..."})
        }
    ).catch(
        (err) => {
            res.status(400).json({message : "Probleme while adding user ..."})
        }
    )

}
//ListCours
export const list = (req , res ) => {
    Cours.find().exec().then((data,error) => {
        if(error) return res.status(400).json({status : false , error});
        return res.status(200).json({
            status : true,
            message : "Get Cours successfuly",
            data,
        });
    });
};
// GetCours
export const getCours = async(req, res) => {
  try {
     // Get id off the url
  const courId = req.params.id;
    // Find the cours using that id
  const cours = await Cours.findById(courId);
  if(!cours){
    return res.status(404).json({
      success: false,
      message: "Cours not found",
    });
  }
    res.status(200).json({cours});
  } catch (err) {
    res.status(404).json({success: false ,message: err });
  }
}

// DeleteCours 
export const deletea = async (req, res) => {
  try {
    // Obtenir l'ID depuis l'URL
    const coursId = req.params.id;
    console.log(coursId);
    const userId = res.locals.user.id;

    // Trouver le cours par son ID
    const cours =Cours.findOne({ _id: coursId });
    console.log(cours);

    if (!cours) {
      return res.status(404).json({
        message: "Cours not found",
      });
    }

    // Vérifier si l'utilisateur actuel est le créateur du cours
    if (cours.creator !== userId) {
      return res.status(401).json({ error: 'You do not have permission' });
    }
    else {
      // Supprimer le cours s'il appartient à l'utilisateur actuel
      await cours.remove(); // Use remove() to delete the document
      res.json({ success: true, message: "Cours deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting the course', details: error.message });
  }
};

// update Cours 
export const update =async (req,res) => {
  try{
  // Get the id off the url
  const id = req.params.id;
  // Get the data off the req body
  const  {titre,description,duree,frais,payent,creator} = req.body;
// Find and update the cours
  await Cours.findByIdAndUpdate(id , {titre,description,duree,frais,payent,creator})
  // Find updated note
  const coure = await Cours.findById(id);
  res.json({ coure,
    success: true,
    message: "Cours Update successfuly",
  });
}
catch (error) {
  res.status(500).json({
    success: false,
    message: error.message,
  });
}

  // .then(()=> res.send({message : "Cours Update successfuly"}))
  // .catch((err) => {
  //   res.send({ error: err , msg:"Something went Wrong!" });
  // });
}



// serche cours
export const coursGet = async (req, res) => {
try {
  
  const data = await Cours.find(
    {
    "$or" : [
      {titre : { $regex: req.params.key}}
    ]
  }
  )
  res.json({
    status : true,
    message : "Get Cours successfuly",
    data,

});
} catch (error) {
  res.status(401).json(error)
}


}
export default {
  add,list,getCours,deletea,update,coursGet
}
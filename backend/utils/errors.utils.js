//error handling for registration
export const signUpErrors = (err) => {
  const errorPriority = [
    "identifiant",
    "email",
    "telephone",
    "nom",
    "prenom",
    "dateDeNaissance",
  ];

  for (const field of errorPriority) {
    if (err.message.includes(field)) {
      if (field === "telephone") return "Téléphone n'est pas saisi";
      if (field === "nom") return "Nom n'est pas saisi";
      if (field === "prenom") return "Prénom n'est pas saisi";
      if (field === "dateDeNaissance")
        return "Date de naissance n'est pas saisie";
    }
  }

  if (err.code === 11000) {
    const key = Object.keys(err.keyValue)[0];
    if (key.includes("identifiant")) return "Cet identifiant est déjà pris";
    if (key.includes("email")) return "Cet email est déjà enregistré";
  }

  return "Une erreur s'est produite lors de l'inscription";
};

// error handling for login
export const signInErrors = (err) => {
  const errors = { email: "", motDePasse: "" };
  if (err.message.includes("email")) errors.email = "Email incorrect";
  if (err.message.includes("motDePasse"))
    errors.motDePasse = "Mot de passe incorrect";
  return errors;
};

// error handling logout
export const signOutErrors = (err) => {
  const errors = { message: "" };
  if (err.message.includes("message"))
    errors.message = "Une erreur s'est produite lors de la déconnexion";
  return errors;
};
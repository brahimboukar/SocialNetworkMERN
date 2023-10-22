import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, "uploads/images");
    } else if (file.mimetype.startsWith("video")) {
      cb(null, "uploads/videos");
    } else {
      cb(new Error("Invalid file type"));
    }
  },
  filename: (req, file, cb) => {
    if (!req.randomString) {
      // Generate a random string (UUID) if it doesn't exist in the request object
      req.randomString = uuidv4();
    }

    const fileExt = file.originalname.split('.').pop(); // Get file extension
    const filename = `${req.randomString}-${file.originalname}`; // Use the stored random string for the filename
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;

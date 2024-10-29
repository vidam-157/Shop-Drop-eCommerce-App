import multer from "multer";

const storage = multer.diskStorage({

    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage });

export default upload;

/*
Multer is a Node.js middleware used for handling file uploads in Express applications. 
It allows to handle multipart/form-data, which is the format used for file uploads. 
We can use Multer to save uploaded files to a specific location on your server (such as a folder) or
directly to a cloud storage service.
*/

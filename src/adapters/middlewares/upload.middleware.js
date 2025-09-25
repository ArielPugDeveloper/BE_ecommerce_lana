import multer from 'multer';

const storage = multer.diskStorage({
  // Configura el destino temporal para guardar los archivos
  destination: function (req, file, cb) {
    cb(null, './uploads/'); 
  },
  // Configura el nombre del archivo para evitar conflictos
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// `multer` se configura para manejar una sola imagen
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB límite
  },
  fileFilter: (req, file, cb) => {
    // Aceptar solo imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// Middleware personalizado que maneja archivos opcionales
export const uploadImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Error en upload middleware:', err);
      return res.status(400).json({ error: err.message });
    }
    
    // Log para debug
    console.log('Upload middleware - req.body:', req.body);
    console.log('Upload middleware - req.file:', req.file);
    
    next();
  });
};

// Middleware alternativo para cuando no se necesita subir archivos
export const parseFormData = (req, res, next) => {
  upload.none()(req, res, (err) => {
    if (err) {
      console.error('Error en parseFormData middleware:', err);
      return res.status(400).json({ error: err.message });
    }
    
    // Log para debug
    console.log('ParseFormData middleware - req.body:', req.body);
    
    next();
  });
};
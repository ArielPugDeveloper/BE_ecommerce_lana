const isAdmin = (req, res, next) => {
  // Asume que el rol del usuario está en el token, por ejemplo, req.user.role
  if (req.user && req.user.role === 'admin') {
    next(); // Permite que la solicitud continúe
  } else {
    res.status(403).json({ error: 'Acceso denegado. No eres un administrador.' });
  }
};

export default isAdmin;
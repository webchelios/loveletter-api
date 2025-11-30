import "dotenv/config";
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
	const token = req.get("token");
	jwt.verify(token, process.env.SEED, (err, decoded) => {
		if (err) {
			return res.status(401).json(`Error al verificar jwt: ${err}`);
		}
		req.usuario = decoded.usuario;
		next();
	});
};

export { verifyToken };

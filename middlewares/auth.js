import "dotenv/config";
import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
	const token = req.get("token");
	jwt.verify(token, process.env.SEED, (error, decoded) => {
		if (error) {
			console.log(error);
			return res.status(401).json({
				error,
			});
		}
		req.usuario = decoded.usuario;
		next();
	});
};

export { verificarToken };

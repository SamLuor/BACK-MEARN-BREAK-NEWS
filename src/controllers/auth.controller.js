import bcrypt from "bcryptjs";
import loginService from "../services/auth.services.js";

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginService(email);

    if (!user) {
      return res.status(404).send({ message: "User or Password not found" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(404).send({ message: "User or Password not found" });
    }

    return res.send("Login ok");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export { Login };

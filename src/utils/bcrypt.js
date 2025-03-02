import 'dotenv/config';
import { hashSync, compareSync, genSaltSync} from "bcrypt";

export const createHash = (password) => hashSync(password, genSaltSync(parseInt(process.env.SALT)));

export const validatePassword = (passIngresada, passBDD) => {
    if (!passBDD) {
        return false;
    }
    return compareSync(passIngresada, passBDD);
};
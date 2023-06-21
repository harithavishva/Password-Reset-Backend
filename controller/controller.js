import User from '../models/userSchema.js';
import { sendMail } from '../helper/helper.js';
import randomString from 'random-string';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const register = async (req, res) => {

    try {

        let userInDB = await User.findOne({ email: req.body.email });
        if (userInDB) {
            res.status(409).send({ msg: "Sorry, email Id already exist", status: 409 });
        } else {
            let hashPassword = await bcrypt.hashSync(req.body.password, 5);
            req.body.password = hashPassword;
            await User.create(req.body);
            res.status(201).send({ msg: "User registred successful", status: 201 });
        }

    } catch (error) {
        res.status(500).send({ msg: "Something Went Wrong" })
        console.log(error);
    }

}


const login = async (req, res) => {

    try {
        let userInDB = await User.findOne({ email: req.body.email });
        if (!userInDB) {
            res.status(404).send({ msg: "User email-id not found", status: 404 });
        } else {

            let isPasswordMatch = await bcrypt.compareSync(req.body.password, userInDB.password);
            if (!isPasswordMatch) {
                res.status(409).send({ msg: "Wrong user login password", status: 409 });
            } else {
                let authToken = await jwt.sign({ email: userInDB.email }, process.env.KEY);
                res.status(200).send({ msg: "Login Successful", status: 200, token: authToken });
            }

        }

    } catch (error) {
        res.send({ msg: "Something Went Wrong" })
        console.log(error);
    }

}


const forgotPassword = async (req, res) => {

    try {

        let userFromDB = await User.findOne({ email: req.body.email });
        if (!userFromDB) {
            res.status(404).send({ msg: "User's email Id not found", status: 404 });
        } else {
            let string = await randomString({ length: 10 });
            let resetToken = await jwt.sign({ string }, "pass_reset", { expiresIn: "1h" });

            await userFromDB.updateOne({ resetToken: resetToken });
            sendMail(userFromDB.email, resetToken);

            res.status(200).send({ msg: "Password reset link sent to mail", status: 200 });
        }

    } catch (error) {
        res.send({ msg: "Something Went Wrong" })
        console.log(error);
    }

}


const resetPass = (req, res) => {

    jwt.verify(req.body.resetToken, 'pass_reset', async (error, info) => {

        if (error) {

            if (error.message == 'jwt expired') {
                res.status(410).send({ msg: 'Sorry, Password reset link expired', status: 410 });
            } else {
                res.status(400).send({ msg: 'Sorry, Something went wrong', status: 400 });
            }

        } else if (info) {

            let userInDB = await User.findOne({ resetToken: req.body.resetToken });
            if (userInDB) {

                let hashPassword = await bcrypt.hashSync(req.body.password, 5);
                await userInDB.updateOne({ password: hashPassword, resetToken: "" });
                res.status(200).send({ msg: 'New password updated successfully', status: 200 });

            } else {
                res.status(400).send({ msg: 'Sorry, wrong request', status: 400 });
            }

        } else {
            res.status(400).send({ msg: 'Sorry, Something went wrong' });
        }

    });

}


export { register, login, forgotPassword, resetPass };
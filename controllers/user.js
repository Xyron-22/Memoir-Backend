import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

export const signin = async (req, res) => {
    const {email, password} = req.body;

    try {
        const existingUser = await User.findOne({email});

        if(!existingUser) {
            return res.status(200).json({ message: "User does not exist"});//
        }

        const isPassCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPassCorrect) {
            return res.status(200).json({message: "Invalid Credentials"});//
        }

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.SECRET_KEY, {expiresIn: "1h"});

        res.status(200).json({ result: existingUser, token});
    } catch (error) {
        res.status(500).json({message: "Something went wrong"});
    }
};


export const signup = async (req, res) => {
    const {email, password, firstName, lastName, confirmPassword} = req.body;

    try {
        const exsistingUser = await User.findOne({email});

        if(exsistingUser) {
            return res.status(200).json({message: "User already exist"});
        }
        if(password !== confirmPassword) {
            return res.status(200).json({message: "Password does not match"});
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await User.create({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`
        })
        
        const token = jwt.sign({email: result.email, id: result._id}, process.env.SECRET_KEY, { expiresIn: "1h"});

        res.status(200).json({result, token});
    } catch (error) {
        res.status(500).json({message: "Something went wrong"});
    }
};

const { error } = require("node:console");
const { prisma } = require("../config/db.js");
const bcrypt = require('bcrypt')
const token = require('../utils/generateToken.js')
const e = require("express");
const { execArgv } = require("node:process");
const { generateKey } = require("node:crypto");

const register = async(req, res) => {
    const { name, email, password} = req.body;

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
        where:{ email: email },

    });

    if (userExists) {
        return res.status(400).json({error: "User alreaddy exists with this email"});
    }

    // Hash Password
   const salt = await bcrypt.genSalt(10)
  // console.log(salt)
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await prisma.user.create(
        {
            data: {
                name,
                email,
                password: hashedPassword,
            }
        }
    );
       // Generate the JWT token
    const token = generateToken(user.id, res);
    res.status(201).json({
        status: "success",
        data: {
            user:{
                id: user.id,
                name: name,
                email: email,

            },
            token
        }
    })

};


const login = async (req, res) => {
    const { email, password} = req.body;

    // check if user email exists in the table
    const user = await prisma.user.findUnique({
        where: {email: email},
    });
    
    if (!user) {
        return res.status(400).json({error: "Invalid Email or Password"});
    }

    //console.log(password)
    //console.log(user.password)
    // verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password"})
    }
    // Generate the JWT token
    const token = generateToken(user.id, res);

        res.status(201).json({
        status: "success",
        data: {
            user:{
                id: user.id,
                email: email,

            },
            token,
        }
    });

    
}


const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });

}


module.exports = { register, login, logout }
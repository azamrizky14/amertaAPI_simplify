const Auth = require("../models/Auth.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtKey = 'amerta';
var session = require('express-session')


const RegisterAuth = (req, res) => {
    try {

        Auth.find({ Auth_email: req.body.email }).exec().then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Email sudah Terdaftar"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const newAuth = new Auth({
                            Auth_username: req.body.username,
                            Auth_email: req.body.email,
                            Auth_password: hash,
                            Auth_role: req.body.role,
                            Auth_status: "Y",
                            Auth_created: new Date().toISOString().slice(0, 10),
                            Auth_domain: req.body.domain,
                            Auth_still_logged: "N"
                        });
                        newAuth.save().then(result => {
                            res.status(201).json(result)
                        })
                    }
                })
            }
        })
    } catch (error) {
        res.send(500).json({ message: error.message })
    }
};

const LoginAuth = async(req, res) => {
    try {
        await Auth.find({ Auth_email: req.body.email })
            .exec()
            .then(user => {
                if (user.length < 1) {
                    return res.status(401).json({
                        message: 'Email tidak ada'
                    });
                } else {
                    username = user[0].Auth_username
                    const dtkubody = req.body;
                    bcrypt.compare(req.body.password, user[0].Auth_password, (err, result) => {
                        if (result) {
                            // console.log(req.Session)
                            const token = jwt.sign(dtkubody, jwtKey, { algorithm: 'HS256' })
                            const hasil = user[0]
                            return res.status(200).json({
                                message: 'Berhasil Login',
                                token: token,
                                data: hasil
                            })
                        } else {
                            return res.status(401).json({
                                message: 'Email dan password tidak sesuai'
                            })
                        }
                    })
                }
            })
    } catch (error) {
        res.send(500).json({ message: error.message })
    }
}

const LogoutAuth = async(req, res) => {
    try {
        const { id } = req.params;
        const LogoutAuth = await Auth.findByIdAndUpdate(id, {
            Auth_still_logged: "N",
            $push: {
                Auth_history_login: {
                    "Auth_history_login_tanggal": new Date().toISOString().slice(0, 10)
                }
            }
        });
        if (!LogoutAuth) {
            return res.status(404).json({ message: "Tidak ada" })
        }
        const HasilLogout = await Auth.findById(id);
        res.status(200).json(HasilLogout)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const LogAuth = async(req, res) => {
    try {
        const { id } = req.params;
        const LogoutAuth = await Auth.findByIdAndUpdate(id, {
            $push: {
                Auth_history: req.body.Auth_history
            }
        });
        if (!LogoutAuth) {
            return res.status(404).json({ message: "Tidak ada" })
        }
        const HasilLog = await Auth.findById(id);
        res.status(200).json(HasilLog)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    RegisterAuth,
    LoginAuth,
    LogoutAuth,
    LogAuth
};
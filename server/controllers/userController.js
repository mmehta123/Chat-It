const register = (req, res, next) => {
    console.log(req.body.email);
    return res.send("hello borther");
};

module.exports = register;
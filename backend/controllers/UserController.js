const User = require("../models/UserModel")

exports.getUser = async(req,res) => {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({
        "message":"User Not Found"
    })

    return res.json({
        "data":user
    })
}


exports.getUsers  = async(req,res) => {
    const user = await User.findAll()
    return res.json({
        data:user
    })
}

exports.deleteUser = async(req,res) => {
    const user = await User.destroy({
        where:{
            id: req.params.id
        }
    })
    if(!user) return res.status(404).json({message:"User Not Found"})
    return res.json({message:"User Deleted"})
}


exports.createUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = await User.create({
            username: username,
            password: password,
            email: email
        });

        return res.status(201).json({
            message: "User Created",
            data: newUser
        });
    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
};


exports.updateUser = async(req,res) => {
    const {id}  = req.params
    const {username, email, password} = req.body
    
    try{
        const user = await User.findByPk(id)
        
        if(!user){
            return res.status(404).json({
                error:"User Not Found"
            })
        }

        await user.update({
            username: username || user.username,
            email: email || user.email,
            password: password || user.password
        }
        )

        return res.status(200).json({
            message: "User Updated",
            data: user
        })
    }
    catch(err){
        return res.status(400).json({
            err: err.message
        })
    }
}

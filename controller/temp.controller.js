const UserService = require('../services/user.services')
class UserController {
    async signup(req, res) {
        try {
            const { name, email, password, role } = req.body
            if (!name || !email || !password || !role) {
                return res.status(400).json({ message: "All fields are required!" })
            }
            if (!["student", "faculty"].includes(role)) {
                return res.status(400).json({ message: "Role must be student or faculty" });
            }
            const result = await UserService.signup(name, email, password, role)
            return res.status(201).json({ message: "User created successfully", data: result });
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }

    }

    async login(req, res) {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                return res.status(400).json({ message: 'both email and passeord required' })
            }
            const login = await UserService.loginUser(email, password)
            res.status(200).json(login)
        }
        catch (err) {
            res.status(401).json({ message: err.message })
        }
    }

    async getAllUsers(req, res) {
        try {
            const result = await UserService.getAllUsers(req.user)

            return res.status(200).json({
                message: "Users fetched successfully",
                data: result
            })
        }
        catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    }

    async softDeleteUser(req, res) {
        try {
            const { id } = req.params;


            const result = await UserService.softDeleteUser(
                id,
                req.user
            );

            return res.status(200).json({
                message: "User soft-deleted successfully",
                data: result
            });

        } catch (err) {

            if (err.message === "User not found") {
                return res.status(404).json({
                    message: err.message
                });
            }

            if (
                err.message === "Students are not allowed to delete records" ||
                err.message === "Faculty can delete student records and their own record only"
            ) {
                return res.status(403).json({
                    message: err.message
                });
            }

            if (err.message === "User is already deleted") {
                return res.status(409).json({
                    message: err.message
                });
            }

            return res.status(500).json({
                message: err.message
            });
        }


    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const result = await UserService.updateUser(id, req.user, req.body);
            return res.status(200).json({
                message: "User updated successfully",
                data: result
            });
        } catch (err) {
            throw new Error(err.message)
        }
    }
    // async update(req, res) {
    //     try {
    //         const { id } = req.params;
    //         const { name } = req.body;

    //         const result = await UserService.update(id, name);

    //         return res.status(200).json({
    //             message: "User updated successfully",
    //             data: result
    //         });
    //     } catch (error) {
    //         console.error("Update error:", error);
    //         return res.status(500).json({
    //             message: error.message
    //         });
    //     }
    // }
    // async adduserprofile(req,res)
    // {
    //     try {
    //         const userId=req.user.id
    //         const{age,dob,bio}=req.body;
    //         if(!userId)
    //         {
    //             return res.status(400).json({message:"user id required"})
    //         }
    //         const newuserProfile=await UserService.addUserProfile(userId,{age,dob,bio})
    //         res.status(201).json(newuserProfile);
    //     } catch (error) {
    //         if(error.code===11000)
    //         {
    //             return res.status(409).json({message:"a user profile already exist"})
    //         }
    //         console.log(error.message)
    //         res.status(400).json({error:error.message})

    //     }
    // }
}
module.exports = new UserController();
const User = require("../models/users.models")
const { default: mongoose } = require('mongoose');

const tokenService = require('../jwt/token.service')

const bcrypt = require('bcrypt')
class UserServices {
    async signup(name, email, password, role) {

        const exist = await User.findOne({ email });
        if (exist) {
            throw new Error("User already exists");
        }
        const hashedpass = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email: email.trim().toLowerCase(),
            password: hashedpass,
            role
        });
        const userData = user.toObject();
        delete userData.password;
        return userData;
    }
    async loginUser(email, password) {
        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            throw new Error("invalid credentials");
        }
        if (!user.isActive) {
            throw new Error('user is inactive')
        }
        const payload = {
            id: user._id,
            role: user.role,
            email: user.email,
            isActive: user.isActive,
        }
        const token = tokenService.generateToken(payload)
        const uwp = user.toObject()
        delete uwp.password
        return { user: uwp, token }
    }

    async getAllUsers(loggedInUser) {
        if (loggedInUser.role === "student") {
            throw new Error("Students cannot see all user records");
        }
        const users = await User.find({ isActive: true });
        return users;
    }
    async softDeleteUser(id) {
        const user = await User.findById(id)
        if (user.role !== "faculty") {
            throw new Error("students not allowed to delete the records")
        }
        if (!user.isActive) {
            throw new Error("User is already deleted");
        }
        user.isActive = false
        await user.save()
        return user
    }

    async updateUser(targetUserId, loggedInUser, updateData) {
        // Find target user
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            throw new Error("User not found");
        }

        // Check record ownership
        const isOwner = targetUser._id.toString() === loggedInUser.id.toString();

        // Student authorization
        if (loggedInUser.role === "student" && !isOwner) {
            throw new Error("Students can update only their own record");
        }

        // Faculty authorization
        if (loggedInUser.role === "faculty") {
            if (!isOwner && targetUser.role !== "student") {
                throw new Error(
                    "Faculty can update their own record and student records only"
                );
            }
        }

        // Allow only name and email
        const allowedUpdates = {};

        if (updateData.name !== undefined) {
            allowedUpdates.name = updateData.name;
        }

        if (updateData.email !== undefined) {
            allowedUpdates.email = updateData.email;
        }

        if (Object.keys(allowedUpdates).length === 0) {
            throw new Error("Name or email is required");
        }

        // Update record
        const updatedUser = await User.findByIdAndUpdate(
            targetUserId,
            { $set: allowedUpdates },
            {
                new: true,
                runValidators: true
            }
        );

        return updatedUser;
    }



    // async addUserProfile(userId,profiledata){
    //     if(!mongoose.isValidObjectId(userId))
    //     {
    //         throw new Error("invalid user id")
    //     }
    //     const user=await User.findById(userId)
    //     if(!user)
    //     {
    //         throw new Error("user not found")
    //     }
    //     const userProfile=await UserProfile.create({
    //         user:userId,
    //         age:profiledata.age,
    //         dob:profiledata.dob,
    //         bio:profiledata.bio,
    //     })
    //     user.profile=userProfile._id;
    //     await user.save()
    //     return userProfile

    // }


}
module.exports = new UserServices()
const Follow= require("../Models/FollowModel");
const User= require("../Models/UserModel");



const followUser = async(req, res)=>{
    const currentUserId = req.params.userId;
    const {followingUserId} = req.body;
    try {
        //verifying following user is present or not
        await User.verifyUserId({userId:followingUserId});

        // Check if the currentUser already follows the followingUser
        let alreadyFollowed=await Follow.checkuserAlreadyFollowing({ currentUserId, followingUserId })
        if(alreadyFollowed){
            console.log("object",alreadyFollowed);
            return res.send({
                status: 400,
                message:`already following by you`,
                data:alreadyFollowed
            })
        }


        let followdb=await Follow.followAndSave({ currentUserId, followingUserId })

        return res.send({
            status: 200,
            message:"followed sucessfully",
            data:followdb
        })

    } catch (error) {
        return res.send({
            status: 400,
            message:error
        })
    }

}
const unfollowUser = async(req, res)=>{
    const currentUserId = req.params.userId;
    const {followingUserId} = req.body;
    try {
        //verifying following user is present or not
        await User.verifyUserId({userId:followingUserId});

        // Check if the currentUser already follows the followingUser
        let alreadyFollowed=await Follow.checkuserAlreadyFollowing({ currentUserId, followingUserId })
        if(!alreadyFollowed){
            return res.send({
                status: 400,
                message:`you not following this user`,
            })
        }

        let unfollowdb=await Follow.unfollowAndSave({ currentUserId, followingUserId })

        return res.send({
            status: 200,
            message:"unfollowed sucessfully",
            data:unfollowdb
        })

    } catch (error) {
        return res.send({
            status: 400,
            message:error
        })
    }

}

const getFollowingList = async(req, res) => {
    const currentUserId = req.params.userId;
    const page=req.query.page || 1;
    const LIMIT= 5;
    try {
        // await User.verifyUserId({userId:currentUserId});


        let followingDetails=await Follow.getFollowingDetails({currentUserId,page,LIMIT});

        return res.send({
            status: 200,
            message:"following list got sucessfully",
            data:followingDetails
        })
        
    } catch (error) {
        return res.send({
            status: 400,
            message:error
        })
    }

}

const getFollowersList = async(req, res) => {
    const currentUserId = req.params.userId;
    const page=req.query.page || 1;
    const LIMIT= 5;
    try {
        // await User.verifyUserId({userId:currentUserId});


        let followingDetails=await Follow.getFollowersDetails({currentUserId,page,LIMIT});

        return res.send({
            status: 200,
            message:"follower list got sucessfully",
            data:followingDetails
        })
        
    } catch (error) {
        return res.send({
            status: 400,
            message:error
        })
    }

}

module.exports = { followUser,getFollowingList ,getFollowersList,unfollowUser}

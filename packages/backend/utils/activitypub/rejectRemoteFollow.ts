import { object } from "underscore";
import { Follows, User } from "../../db"
import { environment } from "../../environment";
import { activityPubObject } from "../../interfaces/fediverse/activityPubObject"
import { postPetitionSigned } from "./postPetitionSigned";

async function rejectremoteFollow(userId: string, remoteUserId: string){
    const localUser = await User.findByPk(userId);
    const remoteUser = await User.findByPk(remoteUserId);
    const followToBeDestroyed = await Follows.findOne({
        where: {
            followedId: userId,
            followerId: remoteUserId
        }
    })

    const apObj: activityPubObject = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        actor: environment.frontendUrl + '/fediverse/blog/' + localUser.url,
        id:  followToBeDestroyed.remoteFollowId,
        type: 'Reject',
        object: {
            actor: remoteUser.remoteId,
            id: followToBeDestroyed.remoteFollowId,
            object: environment.frontendUrl + '/fediverse/blog/' + localUser.url,
            type: 'Follow'
        }
    }
    const response = await postPetitionSigned(apObj, localUser, remoteUser.remoteInbox);
    return response;
}

export {rejectremoteFollow}
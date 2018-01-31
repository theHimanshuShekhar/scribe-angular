"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const afs = admin.firestore();
exports.onPost = functions.firestore
    .document('posts/{postId}')
    .onCreate(event => {
    const post = event.data.data();
    const currentuid = post.uid;
    const pid = post.pid;
    const date = post.date;
    updateFollowerFeeds(currentuid, pid, date);
    updateTotalScribes(currentuid);
});
exports.onLike = functions.firestore
    .document('posts/{postID}/likes/{userID}')
    .onCreate(event => {
    const uid = event.params.userID;
    const pid = event.params.postID;
    const data = {
        pid: pid
    };
    afs.doc('users/' + uid + '/likes/' + pid).set(data)
        .then(() => updateUserLikes(uid))
        .catch(err => console.log(err));
});
exports.onUnLike = functions.firestore
    .document('posts/{postID}/likes/{userID}')
    .onDelete(event => {
    const uid = event.params.userID;
    const pid = event.params.postID;
    afs.doc('users/' + uid + '/likes/' + pid).delete()
        .then(() => updateUserLikes(uid))
        .catch(err => console.log(err));
});
function updateUserLikes(uid) {
    afs.collection('users/' + uid + '/likes').get()
        .then(likes => {
        console.log(likes.size);
        const data = {
            totalLikes: likes.size
        };
        afs.doc('users/' + uid).update(data)
            .catch(err => console.log(err));
    })
        .catch(err => console.log(err));
}
exports.onDelete = functions.firestore
    .document('posts/{postId}')
    .onDelete(event => {
    const deletedPost = event.data.previous.data();
    deleteFeedPosts(deletedPost.uid, deletedPost.pid);
});
exports.onFollow = functions.firestore
    .document('users/{userID}/followers/{followerID}')
    .onCreate(event => {
    const personuid = event.params.userID;
    const currentuid = event.params.followerID;
    updateFollowers(personuid);
    updateFollowers(currentuid);
    updateFollowing(currentuid);
    updateFollowing(personuid);
});
exports.onUnFollow = functions.firestore
    .document('users/{userID}/followers/{followerID}')
    .onDelete(event => {
    const personuid = event.params.userID;
    const currentuid = event.params.followerID;
    updateFollowers(personuid);
    updateFollowers(currentuid);
    updateFollowing(currentuid);
    updateFollowing(personuid);
});
function updateFollowing(uid) {
    afs.collection('users/' + uid + '/following').get()
        .then(snapshot => {
        const data = {
            totalFollowing: snapshot.size
        };
        afs.doc('users/' + uid).update(data)
            .catch(err => {
            console.log(err);
        });
    })
        .catch(err => {
        console.log(err);
    });
}
function updateFollowers(uid) {
    afs.collection('users/' + uid + '/followers').get()
        .then(snapshot => {
        const data = {
            totalFollowers: snapshot.size
        };
        afs.doc('users/' + uid).update(data)
            .catch(err => {
            console.log(err);
        });
    })
        .catch(err => {
        console.log(err);
    });
}
function deleteFeedPosts(postUser, pid) {
    afs.collection('users/' + postUser + '/followers').get()
        .then(snapshot => {
        snapshot.forEach(doc => {
            afs.doc('users/' + doc.id + '/feed/' + pid).delete()
                .then(() => {
                console.log('Feed Post Deleted for user ', doc.id);
            })
                .catch(err => {
                console.log('delete error', err);
            });
        });
    }).then(() => {
        afs.doc('users/' + postUser + '/feed/' + pid).delete()
            .then(() => {
            console.log('Feed Post Deleted for PostUser-', postUser);
        })
            .catch(err => {
            console.log('delete error', err);
        });
    })
        .catch(err => {
        console.log(err);
    });
    updateTotalScribes(postUser);
}
function updateFollowerFeeds(currentuid, pid, date) {
    afs.collection('users/' + currentuid + '/followers').get()
        .then((snapshot) => {
        snapshot.forEach((doc) => {
            const feed = {
                pid: pid,
                date: date,
            };
            afs.collection('users/' + doc.id + '/feed').doc(pid).set(feed)
                .catch((err) => {
                console.log(err);
            });
            afs.collection('users/' + currentuid + '/feed').doc(pid).set(feed)
                .catch((err) => {
                console.log(err);
            });
        });
    })
        .catch((err) => {
        console.log('Error updating feeds', err);
    });
}
function updateTotalScribes(uid) {
    afs.collection('posts').where('uid', '==', uid).get()
        .then(posts => {
        const scribes = posts.size;
        const data = {
            totalScribes: scribes
        };
        afs.doc('users/' + uid).update(data)
            .then(() => {
            console.log('totalScribes updated for user- ', uid);
        })
            .catch((err) => {
            console.log(err);
        });
    })
        .catch((err) => {
        console.log(err);
    });
}
//# sourceMappingURL=index.js.map
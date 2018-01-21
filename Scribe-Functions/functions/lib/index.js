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
        const totalScribes = posts.size;
        const data = {
            totalScribes: totalScribes
        };
        afs.doc('users/' + uid).update(data)
            .catch((err) => {
            console.log(err);
        });
    })
        .catch((err) => {
        console.log(err);
    });
}
//# sourceMappingURL=index.js.map
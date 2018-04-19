import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebase from 'firebase/app';

admin.initializeApp(functions.config().firebase);
const afs = admin.firestore();

exports.onMessage = functions.firestore
  .document('messaging/{rid}/messages/{mid}')
  .onCreate(event => {
    const msg = event.data.data();
    const rid = event.params.rid;
    const update = {
      lastUpdate: msg.timestamp
    };
    afs.doc('messaging/' + rid).update(update)
    .catch(err => console.log(err));
  });

exports.onCreateRoom = functions.firestore
  .document('messaging/{rid}/users/{uid}')
  .onCreate(event => {
    const rid = event.params.rid;
    const uid = event.params.uid;
    afs.collection('messaging/' + rid + '/users').get()
    .then(userList => {
      if (userList) {
        userList.forEach(user => {
          const otheruser = user.data();
          if (otheruser.uid !== uid) {
            const time = admin.firestore.FieldValue.serverTimestamp();
            const roomData = {
              rid: rid,
              uid: otheruser.uid,
              lastupdate: time
            };
            afs.doc('/users/' + uid + '/messaging/' + rid).set(roomData);
          }
        });
      }
    })
    .catch((err) => console.log(err));
  });

exports.onSub = functions.firestore
  .document('groups/{gid}/members/{uid}')
  .onCreate(event => {
    const gid = event.params.gid;
    const userid = event.params.uid;
    const date = admin.firestore.FieldValue.serverTimestamp();
    const gdata = {
      gid: gid,
      last: date
    };
    afs.doc('users/' + userid + '/groups/' + gid).set(gdata).catch(err => console.log(err));
    updateGroupTotalMembers(gid);
  });

  exports.onUnSub = functions.firestore
  .document('groups/{gid}/members/{uid}')
  .onDelete(event => {
    const gid = event.params.gid;
    const userid = event.params.uid;
    afs.doc('users/' + userid + '/groups/' + gid).delete().catch(err => console.log(err));
    updateGroupTotalMembers(gid);
  });

  function updateGroupTotalMembers(gid) {
    afs.collection('groups/' + gid + '/members').get()
    .then(members => {
      const groupDoc = {
        totalMembers: members.size
      };
      afs.doc('groups/' + gid).update(groupDoc)
      .catch(err => console.log(err));
    }).catch(err => console.log(err));
  }

exports.onPost = functions.firestore
  .document('posts/{postId}')
  .onCreate(event => {
    const post = event.data.data();
    const currentuid = post.uid;
    const pid = post.pid;
    const date = post.date;
    if (post.type === 'group') {
      const gid = post.to;
      updateGroupFeed(pid, gid);
      updateUserGroup(gid, post.uid);
    }
    if (post.type === 'comment') {
      updatePostTotalComments(post.to);
    }
    updateFollowerFeeds(currentuid, pid, date);
    updateTotalScribes(currentuid);
});

function updateUserGroup(gid, uid) {
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  const gData = {
    last: timestamp
  };
  afs.doc('users/' + uid + '/groups/' + gid).update(gData)
  .catch(err => console.log(err));
}

function updateGroupFeed(pid, gid) {
  const date = admin.firestore.FieldValue.serverTimestamp();
  const data = {
    pid: pid,
    date: date,
    totalLikes: 0
  };
  afs.doc('groups/' + gid + '/feed/' + pid).set(data)
  .then(() => {
    updateSubFeed(pid, gid, data.date);
  }).catch(err => console.log(err));
}

function updateSubFeed(pid, gid, date) {
  afs.collection('groups/' + gid + '/members').get()
  .then(memberList =>{
    if (memberList) {
      memberList.forEach(member => {
        const feeddata = {
          pid: pid,
          date: date
        };
        afs.doc('/users/' + member.data().uid + '/feed/' + pid).set(feeddata)
        .catch(err => console.log(err));
      });
    }
  }).catch(err => console.log(err));
}

exports.onLike = functions.firestore
    .document('posts/{postID}/likes/{userID}')
    .onCreate(event => {
        const uid = event.params.userID;
        const pid = event.params.postID;
        afs.doc('posts/' + pid).get()
        .then(postData => {
            const postDate = postData.data().date;
            const data = {
                pid: pid,
                date: postDate
            };
            afs.doc('users/' + uid + '/likes/' + pid).set(data)
            .then(() => {
              updateUserLikes(uid);
              updatePostTotalLikes(pid);
              if (postData.data().type === 'group' && postData.data().totalLikes) {
                // Update Group feed total likes
                const likeDoc = {
                  totalLikes: postData.data().totalLikes
                };
                afs.doc('groups/' + postData.data().gid + '/feed/' + pid).update(likeDoc).catch(err => console.log(err));
              }
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));

    });

    function updatePostTotalLikes(pid) {
      afs.collection('posts/' + pid + '/likes').get()
      .then(likes => {
        const postDoc = {
          totalLikes: likes.size
        };
        afs.doc('posts/' + pid).update(postDoc);
      })
      .catch(err => console.log(err));
    }

exports.onUnLike = functions.firestore
.document('posts/{postID}/likes/{userID}')
.onDelete(event => {
    const uid = event.params.userID;
    const pid = event.params.postID;
    afs.doc('users/' + uid + '/likes/' + pid).delete()
    .then(() => updateUserLikes(uid))
    .then(() => updatePostTotalLikes(pid))
    .catch(err => console.log(err));
});

function updateUserLikes(uid) {
    afs.collection('users/' + uid + '/likes').get()
    .then(likes => {
        const data = {
            totalLikes: likes.size
        };
        afs.doc('users/' + uid).update(data)
        .catch(err => console.log(err));
    }).catch(err => console.log(err));
}

exports.onDelete = functions.firestore
  .document('posts/{postId}')
  .onDelete(event => {
    const deletedPost = event.data.previous.data();
    if (deletedPost.type = 'comment') {
      const parentid = deletedPost.to;
      afs.doc('/posts/' + parentid + '/comments/' + deletedPost.pid).delete()
      .then(() => updatePostTotalComments(deletedPost.to))
      .catch((err) => console.log(err));
    }
    deleteFeedPosts(deletedPost.uid, deletedPost.pid);
  })

  function updatePostTotalComments(pid) {
    afs.collection('posts/' + pid + '/comments').get()
    .then(comments => {
      const postDoc = {
        totalComments: comments.size
      };
      afs.doc('posts/' + pid).update(postDoc);
    })
    .catch(err => console.log(err));
  }

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
        snapshot.forEach(
            doc => {
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
            }
            afs.collection('users/' + doc.id + '/feed').doc(pid).set(feed)
            .catch((err) => {
                console.log(err);
            });
            afs.collection('users/' + currentuid + '/feed').doc(pid).set(feed)
            .catch((err) => {
                console.log(err);
            });
        })
    }).catch((err) => {
        console.log('Error updating feeds', err);
    });
}

function updateTotalScribes(uid) {
    afs.collection('posts').where('uid', '==', uid).get()
    .then(
        posts => {
            const scribes = posts.size;
            const data = {
                totalScribes: scribes
            }
            afs.doc('users/' + uid).update(data)
            .then(() => {
                console.log('totalScribes updated for user- ', uid);
            })
            .catch(
                (err) => {
                 console.log(err);
                });
        })
    .catch ((err) => {
        console.log(err);
    });
}

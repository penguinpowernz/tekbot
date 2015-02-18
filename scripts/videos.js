module.exports = function(robot) {
  

  if ( robot.brain.data.videos == null ) {
    robot.brain.data.videos = [];
  }

  var checkForNewVideo = function(robot, callback) {
    if ( robot.brain.data.latest_video == null ) {
      robot.brain.data.latest_video = robot.brain.data.videos[0];
      callback(false);
    } else {
      if ( robot.brain.data.latest_video != robot.brain.data.videos[0] ) {
        var vid = robot.brain.data.latest_video = robot.brain.data.videos[0];
        robot.messageRoom(null, "OMG GUYS THERES A NEW VIDEO OUT!");
        robot.messageRoom(null, vid.title+": "+vid.link);
        callback(true);
      } else {
        callback(false);
      }
    }
  };

  var getFeed = function(robot, callback) {
    console.log("GETTING VIDEO FEED");
    // TODO: check for the last time we got the feed
//     robot.http("http://gdata.youtube.com/feeds/api/users/teksyndicate/uploads?alt=json")
//     .header('Accept', 'application/json')
//     .get(function(err, res, body){

    // CURL HACK
    require("child_process").exec("curl http://gdata.youtube.com/feeds/api/users/teksyndicate/uploads?alt=json", function(err, stdout, stderr) {
      if ( err ) {
      } else {
        data = JSON.parse(stdout);

        robot.brain.data.videos = data.feed.entry.map(function(e) {
          return {title: e.title["$t"], link: e.link[0].href };
        });

        checkForNewVideo(robot, function() {
          if ( typeof(callback) == "function" ) { callback(true); }
        });
      }
    });
  }

  // run it and set a schedule
  getFeed(robot, function() {
    setInterval(function() {
      getFeed(robot);
    }, 60000 * 10);

    var replyWithVideo = function(msg, video) {
      msg.reply(video.title+": "+video.link);
    };

    robot.respond(/(what is|whats|what's|get me|show me|link me) the latest video/i, function(msg) {
      var latest = robot.brain.data.videos[0];
      if ( latest == null ) {
        msg.reply("Hmmm, I'm not sure, let me go look for some videos...");
        getFeed(robot, function(new_video) {
          if (!new_video) {
            var latest = robot.brain.data.videos[0];
            if ( latest == null ) {
              msg.reply("Sorry, I'm unable to locate the videos... hey penguinpowernz, help me out?");
            } else{
              replyWithVideo(msg, latest);
            }
          }
        });
      } else {
        replyWithVideo(msg, latest);
      }
    });

  });
  
  robot.respond(/list some videos/i, function(msg) {
    msg.reply("yes I am...");
    robot.brain.data.videos.slice(0, 10).forEach(function(vid) {
      msg.reply(vid.title+": "+vid.link);
    });
  });
};

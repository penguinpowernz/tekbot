

module.exports = function(robot) {

  var greetings = [
    "ohai {{name}}!",
    "wassup {{name}}",
    "hi there",
    "hey {{name}}, howsit going?",
    "hey there!",
    "Greetings and salutations, {{name}}"
  ];

  var greet = function(msg, name) {
    msg.send(msg.random(greetings).replace("{{name}}", name));
  };

  robot.hear(/^(hey|hi) (everyone|guys)[!]?$/i, function(msg) {
    greet(msg, msg.message.user.name);
  });

  robot.hear(/stop/i, function(msg) {
    msg.send("WE CAN'T STOP HERE!! THIS IS BAT COUNTRY!!");
  });

};

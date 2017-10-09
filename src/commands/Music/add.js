const yt = require("ytdl-core");
const getInfoAsync = require("util").promisify(yt.getInfo);

const YouTubeRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed)?)?\/|watch\/?\?(?:\S*?&?v=))|youtu\.be\/)([\w-]{11})(?:[^\w-]|$)/;
const DefaultObj = {
  playing: false,
  songs: [],
};

exports.run = async (client, msg, [song]) => {
  const id = YouTubeRegExp.exec(song);
  if (id === null) throw "You must provide a valid YouTube URL.";
  const info = await getInfoAsync(`https://youtu.be/${id[1]}`);

  if (client.queue.has(msg.guild.id) === false) client.queue.set(msg.guild.id, DefaultObj);
  client.queue.get(msg.guild.id).songs.push({ url: song, title: info.title, seconds: info.length_seconds, requester: msg.author.username }); //eslint-disable-line

  return msg.send(`🎵 Added **${info.title}** to the queue 🎶`);
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: [],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
  cooldown: 5,
};

exports.help = {
  name: "add",
  description: "Adds a song the the queue.",
  usage: "<song:str>",
  usageDelim: "",
  extendedHelp: "",
};

exports.init = (client) => {
  client.queue = new client.methods.Collection();
};

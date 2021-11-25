const { MessageEmbed } = require("discord.js");

module.exports = {
  randomIntFromInterval: function (min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  generateError: function (ctx, message) {
    var error = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("An error occured")
      .setTimestamp(Date.now)
      .setDescription(message)
      .setFooter("Melvin", "https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp")

    return ctx.channel.send({ embeds: [error] });
  },

  sleep: function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  format: function (seconds) {
    var days = Math.floor(seconds / 60 / 60 / 24)
    var hours = Math.floor(seconds / 60 / 60) % 24
    var minutes = Math.floor(seconds / 60) % 60
    var seconds = Math.floor(seconds % 60)

    days = (days > 0) ? `${hours}d ` : ''
    hours = (hours > 0) ? `${hours}h ` : ''
    minutes = (minutes > 0) ? `${minutes}m ` : ''
    seconds = (seconds > 0) ? `${seconds}s` : ''

    return days + hours + minutes + seconds
  },

  generateEmbed: function (message, title, description, url, duration, image) {
    var desc;
    if (typeof duration === "undefined") {
      desc = `[${description}](${url})`
    }
    else {
      desc = `[${description}](${url}) \n \`[0:00 / ${duration}]\``
    }

    var embed = new MessageEmbed()
      .setColor("#" + Math.floor(Math.random() * 16777215).toString(16))
      .setTitle(title)
      .setThumbnail(image)
      .setDescription(desc)
      .setTimestamp(Date.now)
      .setFooter("Melvin", "https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp")
  
    return message.channel.send({ embeds: [embed] })
  }
}
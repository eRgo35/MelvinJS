const { generateEmbed, generateError } = require('./tools')

module.exports = {
  play: async function (guildQueue, player, message, args) {
    try {
      args.shift()
      const queue = player.createQueue(message.guild.id)
      await queue.join(message.member.voice.channel)

      if (/list/.test(args.join(' '))) {
        await queue.playlist(args.join(' ')).catch(_ => {
          if (!guildQueue) queue.stop()
        })
      } else {
        await queue.play(args.join(' ')).catch(_ => {
          if (!guildQueue) queue.stop()
        })
      }

      const track = queue.songs[queue.songs.length - 1]
      generateEmbed(message, 'Queued', track.name, track.url, track.duration, track.thumbnail)
    } catch (err) {
      console.log(err)
      generateError(message, "Something went wrong. We're working on it.")
    }
  },

  playlist: async function (guildQueue, player, message, args) {
    try {
      args.shift()
      const queue = player.createQueue(message.guild.id)
      await queue.join(message.member.voice.channel)
      await queue.playlist(args.join(' ')).catch(_ => {
        if (!guildQueue) queue.stop()
      })

      const track = queue.songs[queue.songs.length - 1]
      generateEmbed(message, 'Queued', track.name, track.url, track.duration, track.thumbnail)
    } catch (err) {
      console.log(err)
      generateError(message, "Something went wrong. We're working on it.")
    }
  },

  skip: async function (guildQueue, message, args) {
    try {
      guildQueue.skip()
      generateEmbed(message, 'Skipped', 'Song skipped')
    } catch (err) {
      generateError(message, 'There is no track to skip!')
    }
  },

  stop: async function (guildQueue, message, args) {
    try {
      guildQueue.stop()
      generateEmbed(message, 'Stopped', 'Stopped music playback')
    } catch (err) {
      generateError(message, 'There is no track to stop!')
    }
  },

  loop: async function (guildQueue, message, args) {
    try {
      if (args[1] === 'off' || args[1] === '0') {
        guildQueue.setRepeatMode(0)
        generateEmbed(message, 'Loop', 'Repeat disabled')
      } else if (args[1] === 'one' || args[1] === '1' || args[1] === 'current' || args[1] === 'song') {
        guildQueue.setRepeatMode(1)
        generateEmbed(message, 'Loop', 'Repeat set to one')
      } else if (args[1] === 'on' || args[1] === 'queue' || args[1] === '2') {
        guildQueue.setRepeatMode(2)
        generateEmbed(message, 'Loop', 'Repeat set to queue')
      } else {
        let repeat
        if (guildQueue.repeatMode === 0) {
          repeat = 'disabled'
        } else if (guildQueue.repeatMode === 1) {
          repeat = 'set to one'
        } else {
          repeat = 'set to queue'
        }
        generateEmbed(message, 'Loop', `Repeat is ${repeat}`)
      }
    } catch (err) {
      generateError(message, 'There is no track to loop!')
    }
  },

  volume: async function (guildQueue, message, args) {
    try {
      if (/\d/.test(args[1])) {
        guildQueue.setVolume(parseInt(args[1]))
      }
      generateEmbed(message, 'Volume', `Volume set to ${guildQueue.volume}%`)
    } catch (err) {
      generateError(message, 'There is no track to change volume!')
    }
  },

  seek: async function (guildQueue, message, args) {
    try {
      guildQueue.seek(parseInt(args[1]) * 1000)
    } catch (err) {
      generateError(message, 'There is no track to seek!')
    }
  },

  queue: async function (guildQueue, message, args) {
    try {
      const trackList = []
      for (let i = 0; i < guildQueue.songs.length; i++) {
        trackList.push(guildQueue.songs[i].name)
      }
      generateEmbed(message, 'Queue', trackList.join('\n'))
    } catch (err) {
      generateError(message, 'The queue is empty!')
    }
  },

  shuffle: async function (guildQueue, message) {
    try {
      guildQueue.shuffle()
      generateEmbed(message, 'Shuffle', 'Tracks have been shuffled')
    } catch (err) {
      generateError(message, 'There are no tracks to shuffle!')
    }
  },

  pause: async function (guildQueue, message) {
    try {
      guildQueue.setPaused(true)
      generateEmbed(message, 'Paused', 'Music playback is paused')
    } catch (err) {
      generateError(message, 'There is no track to pause!')
    }
  },

  resume: async function (guildQueue, message) {
    try {
      guildQueue.setPaused(false)
      generateEmbed(message, 'Resumed', 'Music playback is resumed')
    } catch (err) {
      generateError(message, 'There is no track to resume!')
    }
  },

  remove: async function (guildQueue, message, args) {
    try {
      guildQueue.remove(parseInt(args[1]))
      generateEmbed(message, 'Queue', `${guildQueue.songs[args[1]].name} was removed from queue`)
    } catch (err) {
      generateError(message, 'There is no track to remove!')
    }
  },

  join: async function (guildQueue, player, message, args) {
    try {
      const queue = player.createQueue(message.guild.id)
      await queue.join(message.member.voice.channel)
      generateEmbed(message, 'Joined the voice channel', 'Hello there, add some music with $play!')
    } catch (err) {
      generateError(message, "Something went wrong. We're working on it.")
    }
  },

  leave: async function (guildQueue, player, message, args) {
    try {
      const queue = player.createQueue(message.guild.id)
      queue.stop()
      guildQueue.leave()
      generateEmbed(message, 'Stopped', 'Stopped music playback and left the voice channel')
    } catch (err) {
      generateError(message, 'There is no track to stop!')
    }
  }
}

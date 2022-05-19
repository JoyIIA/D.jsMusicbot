const { Message, VoiceRegion, MessageActionRow } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { SpotifyPlugin } = require("@distube/spotify")
const { DisTube } = require("distube")
const { SoundCloudPlugin } = require("@distube/soundcloud")
global.Discord = require('discord.js');
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_INTEGRATIONS", "GUILD_VOICE_STATES"] 
})

client.login("LOGINTOKEN");

const distube = new DisTube(client, {
	youtubeDL: false,
	plugins: [ new SoundCloudPlugin(), new SpotifyPlugin()],
	leaveOnEmpty: true,
	leaveOnStop: true
})

client.on("ready", () => {
	  console.log("✝ Online ma non è cool ✝ ");
})

client.on("messageCreate", message =>{
	if(message.content.startsWith(".play")) {
		const voiceChannel = message.member.voice.channel
		if(!voiceChannel){
			return message.channel.send(":ME_attention: Devi essere in un canale vocale :ME_attention:")
		}

    const voiceChannelBot = message.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
		if(voiceChannelBot && voiceChannel != voiceChannelBot.id) {
			return message.channel.send(":CoP_zerotwo_fuck: Qualcun'altro ascolta musica :CoP_zerotwo_fuck:")
		}
			
    let args = message.content.split(/\s+/)
    let query = args.slice(1).join(" ")

		if (!query) {
			return message.channel.send(":NaC_BlobParty: Inserisci la canzone che vuoi sentire :NaC_BlobParty:")
		}

		distube.play(voiceChannelBot || voiceChannel, query, {
			member: message.member,
			textChannel: message.channel,
			message: message
		})
	}
})

distube.on("addSong", (queue, song) =>{
	var embed = new Discord.MessageEmbed()
	    .setTitle("Canzone aggiunta alla coda!")
	    .addField("Canzone aggiunta alla coda:", song.name)
      .addField("Richiesta da", song.user.toString())
	
	queue.textChannel.send({ embeds: [embed] })
})

distube.on("playSong", (queue, song) => {
		var embed = new Discord.MessageEmbed()
	    .setTitle("Riproducendo un'altra canzone!")
	    .addField("Sto riproducendo", song.name)
	    .addField("Richiesta da", song.user.toString())

	queue.textChannel.send({ embeds: [embed] })
})

distube.on("searchNoResult", (message  , query) => {
	   var embed = new Discord.MessageEmbed()
	   .setTitle("Canzone non trovata...")
	   .addField("Non ho trovato la tua canzone")
	   .addField("Quindi sto riproducendo:", song.name)
	   .addField("Canzone non trovata da:", song.user.toString())
})

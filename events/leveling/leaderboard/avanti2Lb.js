const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { humanize } = require("../../../functions/general/humanize")
const { getEmoji } = require("../../../functions/general/getEmoji");
const { replyMessage } = require("../../../functions/general/replyMessage");
const { getAllUsers } = require("../../../functions/database/getAllUsers");

const time_now = new Date().toLocaleString();
module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("avanti2Lb")) return

        interaction.deferUpdate().catch(() => { })
        console.log(`events/avanti2Lb.js > isMaintenance > ${time_now}`)
        if (isMaintenance(interaction.user.id)) return
        console.log(`events/avanti2Lb.js > Mando msg > ${time_now}`)
        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")
        console.log(`events/avanti2Lb.js > Ottengo tutti gli utenti > ${time_now}`)
        let userstatsList = await getAllUsers(client)
        console.log(`events/avanti2Lb.js > Riordino l'array > ${time_now}`)
        let leaderboardListLeveling = userstatsList.sort((a, b) => (a.leveling.xp < b.leveling.xp) ? 1 : ((b.leveling.xp < a.leveling.xp) ? -1 : 0)); /*>*/ console.log(`leaderboard.js > Riordino l'array > ${time_now}`);
        let leaderboardLeveling = ""

        let totPage = Math.ceil(leaderboardListLeveling.length / 10)
        let page = totPage

        for (let i = 10 * (page - 1); i < 10 * page; i++) {
            if (leaderboardListLeveling[i]) {
                console.log(`leaderboard.js > Inizio ciclo "for" (${i}) > ${time_now}`);
                switch (i) {
                    case 0:
                        leaderboardLeveling += ":first_place: ";
                        break
                    case 1:
                        leaderboardLeveling += ":second_place: "
                        break
                    case 2:
                        leaderboardLeveling += ":third_place: "
                        break
                    default:
                        leaderboardLeveling += `**#${i + 1}** `
                }

                let utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == leaderboardListLeveling[i].id); /*>*/ console.log(`leaderboard.js > Ottengo l'utente > ${time_now}`);
                leaderboardLeveling += `${utente.toString()} - **Lvl. ${leaderboardListLeveling[i].leveling.level}** (XP: ${humanize(leaderboardListLeveling[i].leveling.xp)})\n`
            }
        }

        let leaderboardListEconomy = userstatsList.sort((a, b) => (a.economy.money < b.economy.money) ? 1 : ((b.economy.money < a.economy.money) ? -1 : 0)); console.log(`events/avanti2Lb.js > Riordino l'array > ${time_now}`)
        let leaderboardEconomy = ""

        for (let i = 10 * (page - 1); i < 10 * page; i++) {
            if (leaderboardListEconomy[i]) {
                console.log(`leaderboard.js > Inizio ciclo "for" (${i}) > ${time_now}`)
                switch (i) {
                    case 0:
                        leaderboardEconomy += ":first_place: ";
                        break
                    case 1:
                        leaderboardEconomy += ":second_place: "
                        break
                    case 2:
                        leaderboardEconomy += ":third_place: "
                        break
                    default:
                        leaderboardEconomy += `**#${i + 1}** `
                }

                let utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == leaderboardListEconomy[i].id); /*>*/ console.log(`leaderboard.js > Ottengo l'utente > ${time_now}`);
                leaderboardEconomy += `${utente.toString()} - **${humanize(leaderboardListEconomy[i].economy.money)}$**\n`
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(":trophy: Leaderboard :trophy:")
            .setColor("#ffc400")
            .setDescription("Statistiche ranking di tutti gli utenti nel server")
            .setThumbnail(client.guilds.cache.get(settings.idServer).iconURL({ dynamic: true }))
            .addField(":beginner: Leveling", leaderboardLeveling)
            .addField(":coin: Economy", leaderboardEconomy)
            .setFooter({ text: `Page ${page}/${totPage}` })

        let button1 = new Discord.MessageButton()
            .setCustomId(`indietro2Lb,${interaction.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous2"))

        let button2 = new Discord.MessageButton()
            .setCustomId(`indietroLb,${interaction.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous"))

        if (page == 1) {
            button1.setDisabled()
            button2.setDisabled()
        }

        let button3 = new Discord.MessageButton()
            .setCustomId(`avantiLb,${interaction.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next"))

        let button4 = new Discord.MessageButton()
            .setCustomId(`avanti2Lb,${interaction.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next2"))

        if (page == totPage) {
            button3.setDisabled()
            button4.setDisabled()
        }

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)

        console.log(`leaderboard.js > Ottengo l'utente > ${time_now}`);
        interaction.message.edit({ embeds: [embed], components: [row] })
    },
};
require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const THERAPIST_IDS = process.env.THERAPIST_IDS.split(',');

client.once('ready', () => {
  console.log(`🧠 Therapist Bot is online as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const msg = message.content.trim().toLowerCase();
  const args = msg.split(' ');

  // Only allow therapists to use commands
  if (!THERAPIST_IDS.includes(message.author.id)) return;

  if (msg.startsWith('!help')) {
    return message.channel.send(`
📘 **Therapist Bot Commands**

- \`!viewbookings\` → View all upcoming bookings
- \`!viewbookings <YYYY-MM-DD>\` → Filter bookings by date
- \`!help\` → Show this help message
    `);
  }

  if (msg.startsWith('!viewbookings')) {
    let data;
    try {
      data = JSON.parse(fs.readFileSync('bookings.json', 'utf8'));
    } catch (err) {
      return message.channel.send('❌ Error reading booking data.');
    }

    let filtered = data;
    if (args.length === 2) {
      const filterDate = args[1];
      filtered = data.filter(b => b.date === filterDate);
    }

    if (filtered.length === 0) {
      return message.channel.send('📭 No bookings found.');
    }

    const response = filtered
      .map(
        (b, i) =>
          `**${i + 1}.** 🧑 ${b.user} (ID: ${b.userId})\n🗓️ ${b.date} at 🕒 ${b.time}\n💼 Therapist: ${b.therapist}\n💵 Payment: ${b.paid ? '✅ Received' : '❌ Pending'}\n`
      )
      .join('\n');

    return message.channel.send(`📋 **Booking List:**\n\n${response}`);
  }
});

client.login(process.env.DISCORD_TOKEN);


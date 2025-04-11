require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const Razorpay = require('razorpay');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const therapists = JSON.parse(fs.readFileSync('./therapists.json'));
let bookings = JSON.parse(fs.readFileSync('./bookings.json'));

client.once('ready', () => {
  console.log(`🤖 Bot is online as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Help Command
  if (message.content.toLowerCase() === '!help') {
    const helpMessage = `
🧠 **Mental Health Therapy Bot Commands**

📋 \`!therapists\` – View available therapists  
🗓️ \`!book <therapist_id> <YYYY-MM-DD> <HH:MM>\` – Book a therapy session  
❌ \`!cancel <therapist_id>\` – Cancel your unpaid session  
📅 \`!mysessions\` – View your booked sessions  
ℹ️ \`!help\` – Show this help message

💡 Example: \`!book t1 2025-04-15 15:00\`
    `;
    return message.channel.send(helpMessage);
  }

  // List Therapists
  if (message.content.toLowerCase() === '!therapists') {
    therapists.forEach(therapist => {
      const embed = new EmbedBuilder()
        .setTitle(therapist.name)
        .setDescription(`**Speciality:** ${therapist.speciality}\n**Age:** ${therapist.age}\n**Cost/Session:** ₹${therapist.cost}`)
        .setImage(therapist.image)
        .setFooter({ text: `Therapist ID: ${therapist.id}` });
      message.channel.send({ embeds: [embed] });
    });
  }

  // Book a session
  if (message.content.toLowerCase().startsWith('!book')) {
    const args = message.content.split(' ');

    if (args.length < 4) {
      return message.reply("❗ Usage: `!book <therapist_id> <YYYY-MM-DD> <HH:MM>`");
    }

    const [_, therapistId, date, time] = args;
    const therapist = therapists.find(t => t.id === therapistId);

    if (!therapist) {
      return message.reply("❌ Therapist not found. Use `!therapists` to see the list.");
    }

    const user = {
      id: message.author.id,
      name: message.author.username
    };

    const sessionDetails = {
      user,
      therapistId: therapist.id,
      therapistName: therapist.name,
      date,
      time,
      paid: false
    };

    const order = await razorpay.paymentLink.create({
      amount: therapist.cost * 100,
      currency: "INR",
      description: `Therapy session with ${therapist.name} on ${date} at ${time}`,
      customer: {
        name: user.name,
        contact: "1290875634",
        email: "test@example.com"
      },
      notify: {
        sms: true,
        email: true
      }
    });

    sessionDetails.payment_id = order.id;
    bookings.push(sessionDetails);
    fs.writeFileSync('./bookings.json', JSON.stringify(bookings, null, 2));

    message.reply(`💳 Please complete your payment to confirm your session:\n${order.short_url}`);
  }

  // Cancel a session
  if (message.content.toLowerCase().startsWith('!cancel')) {
    const args = message.content.split(' ');
    const userId = message.author.id;
    const therapistId = args[1];

    const index = bookings.findIndex(b => b.user.id === userId && b.therapistId === therapistId && !b.paid);
    if (index === -1) {
      return message.reply("❌ No unpaid session found to cancel.");
    }

    bookings.splice(index, 1);
    fs.writeFileSync('./bookings.json', JSON.stringify(bookings, null, 2));
    return message.reply("✅ Your session has been canceled.");
  }

  // View sessions
  if (message.content.toLowerCase() === '!mysessions') {
    const userSessions = bookings.filter(b => b.user.id === message.author.id);
    if (userSessions.length === 0) return message.reply("📭 You have no sessions booked.");

    let summary = `📅 **Your Sessions:**\n`;
    userSessions.forEach(s => {
      summary += `• ${s.therapistName} on ${s.date} at ${s.time} [${s.paid ? "✅ Paid" : "💰 Not Paid"}]\n`;
    });
    message.reply(summary);
  }
});

client.login(process.env.DISCORD_TOKEN);


require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const resources = {
  anxiety: {
    articles: [
      "https://www.helpguide.org/articles/anxiety/anxiety-disorders-and-anxiety-attacks.htm",
      "https://www.nhs.uk/mental-health/conditions/generalised-anxiety-disorder/overview/"
    ],
    videos: [
      "https://www.youtube.com/watch?v=WWloIAQpMcQ"
    ],
    helplines: [
      "India: 9152987821 (iCall)",
      "USA: 1-800-662-HELP",
      "UK: 116 123 (Samaritans)"
    ]
  },
  depression: {
    articles: [
      "https://www.healthline.com/health/depression",
      "https://www.mind.org.uk/information-support/types-of-mental-health-problems/depression/"
    ],
    videos: [
      "https://www.youtube.com/watch?v=XiCrniLQGYc"
    ],
    helplines: [
      "India: 022 2552 1111 (AASRA)",
      "USA: 988 Suicide & Crisis Lifeline",
      "UK: 116 123 (Samaritans)"
    ]
  },
  stress: {
    articles: [
      "https://www.verywellmind.com/stress-and-health-3145086"
    ],
    videos: [
      "https://www.youtube.com/watch?v=hnpQrMqDoqE"
    ],
    helplines: [
      "USA: 1-800-273-TALK",
      "India: 9152987821 (iCall)"
    ]
  }
};

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const msg = message.content.trim().toLowerCase();

  if (msg === '!help') {
    return message.channel.send(`
📘 **Mental Health Resource Bot Commands**

- \`!resource\` → View available topics (e.g. anxiety, depression, stress)
- \`!resource <topic>\` → Get resources for that topic
- \`!helpline\` → View global helpline numbers
- \`!help\` → Show this help message
    `);
  }

  if (msg === '!resource') {
    return message.channel.send(
      `🗂️ Available Topics:\n${Object.keys(resources)
        .map(t => `- ${t}`)
        .join('\n')}\n\nType \`!resource <topic>\` to view more.`
    );
  }

  if (msg.startsWith('!resource ')) {
    const topic = msg.split(' ')[1];
    if (!resources[topic]) {
      return message.channel.send('❌ Topic not found. Use `!resource` to view available topics.');
    }

    const res = resources[topic];
    return message.channel.send({
      content: `📚 **Resources for ${topic.charAt(0).toUpperCase() + topic.slice(1)}**\n\n**Articles:**\n${res.articles
        .map(a => `🔗 ${a}`)
        .join('\n')}\n\n**Videos:**\n${res.videos
        .map(v => `▶️ ${v}`)
        .join('\n')}\n\n**Helplines:**\n${res.helplines.map(h => `📞 ${h}`).join('\n')}`
    });
  }

  if (msg === '!helpline') {
    const helplines = Object.values(resources)
      .map(r => r.helplines)
      .flat()
      .filter((v, i, a) => a.indexOf(v) === i); // remove duplicates

    return message.channel.send(`📞 **Global Helplines**\n\n${helplines.map(h => `- ${h}`).join('\n')}`);
  }
});

client.login(process.env.DISCORD_TOKEN);


const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, REST, Events, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const sessions = new Map();

const commands = [
  new SlashCommandBuilder().setName('focus').setDescription('Start a Pomodoro focus session (25-5 mins)'),
  new SlashCommandBuilder().setName('longfocus').setDescription('Start a longer Pomodoro (50-10 mins)'),
  new SlashCommandBuilder()
    .setName('customfocus')
    .setDescription('Start a custom focus session')
    .addIntegerOption(option =>
      option.setName('work')
        .setDescription('Work duration in minutes')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('break')
        .setDescription('Break duration in minutes')
        .setRequired(true)),
  new SlashCommandBuilder().setName('motivate').setDescription('Get a productivity/mindset quote'),
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(async () => {
  try {
    console.log('⏳ Registering commands...');
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
      body: commands.map(cmd => cmd.toJSON()),
    });
    console.log('✅ Slash commands registered!');
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log(`🟢 Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, user } = interaction;

  const startSession = async (workMin, breakMin) => {
    await interaction.reply({ content: `🔔 Focus session started for ${workMin} minutes. Stay focused!`, ephemeral: true });

    setTimeout(async () => {
      await interaction.followUp({ content: `⏸️ Time's up! Take a ${breakMin}-minute break.`, ephemeral: true });

      setTimeout(async () => {
        await interaction.followUp({ content: `✅ Break over! You're ready for the next session.`, ephemeral: true });
      }, breakMin * 60000);
    }, workMin * 60000);
  };

  if (commandName === 'focus') {
    startSession(25, 5);
  }

  if (commandName === 'longfocus') {
    startSession(50, 10);
  }

  if (commandName === 'customfocus') {
    const work = interaction.options.getInteger('work');
    const rest = interaction.options.getInteger('break');
    startSession(work, rest);
  }

  if (commandName === 'motivate') {
    const quotes = [
      "✨ 'Focus on being productive instead of busy.' – Tim Ferriss",
      "🧠 'You don’t need more time, you just need to decide.' – Seth Godin",
      "💡 'Success is the sum of small efforts, repeated.'",
      "🎯 'Discipline is choosing between what you want now and what you want most.'"
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const embed = new EmbedBuilder()
      .setTitle('💬 Motivation')
      .setDescription(quote)
      .setColor('Green');
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);


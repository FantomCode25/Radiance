require('dotenv').config();
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, Routes, REST, Events, StringSelectMenuBuilder } = require('discord.js');
const products = require('./products.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const categories = [...new Set(products.map(p => p.category))];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const command = new SlashCommandBuilder()
  .setName('shop')
  .setDescription('Browse mental health products');

(async () => {
  try {
    console.log('Registering slash command...');
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
      body: [command.toJSON()],
    });
    console.log('Command registered!');
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand() && interaction.commandName === 'shop') {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('select-category')
      .setPlaceholder('Choose a category')
      .addOptions(
        categories.map(cat => ({
          label: cat,
          value: cat
        }))
      );

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({ content: '🛍️ Choose a category to browse products:', components: [row] });
  }

  if (interaction.isStringSelectMenu() && interaction.customId === 'select-category') {
    const selectedCategory = interaction.values[0];
    const items = products.filter(p => p.category === selectedCategory);

    if (!items.length) {
      return interaction.reply({ content: '❌ No products found in this category.', ephemeral: true });
    }

    for (const product of items) {
      const embed = new EmbedBuilder()
        .setTitle(product.name)
        .setDescription(`${product.description}\n\n💰 **Price**: ${product.price}`)
        .setImage(product.image)
        .setColor('Green')
        .setFooter({ text: `Category: ${product.category}` });

      const button = new ButtonBuilder()
        .setLabel('Buy Now')
        .setStyle(ButtonStyle.Link)
        .setURL(product.link);

      const row = new ActionRowBuilder().addComponents(button);

      await interaction.channel.send({ embeds: [embed], components: [row] });
    }

    await interaction.update({ content: `🛍️ Products in **${selectedCategory}**:`, components: [] });
  }
});

client.login(process.env.DISCORD_TOKEN);


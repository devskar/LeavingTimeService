import Bot from './discord/bot';

const main = () => {
	const bot = new Bot();
	bot.login();
};

main();

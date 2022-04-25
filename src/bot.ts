import {
	Awaitable,
	Client,
	ClientEvents,
	Intents,
	TextChannel,
	User,
} from 'discord.js';
import config from '../ltime.config.json';

class Bot {
	private client: Client;

	constructor() {
		this.client = new Client({ intents: Intents.FLAGS.DIRECT_MESSAGES });
		this.registerDefaultEvents();
	}

	registerEvent<K extends keyof ClientEvents>(
		event: K,
		listener: (...args: ClientEvents[K]) => Awaitable<void>,
	) {
		this.client.on(event, listener);
	}

	registerDefaultEvents() {
		this.client.on('ready', event => {
			console.log('Ready!');
			this.log('LeavingTimerService started. Running Configurations now!');

			event.user.setActivity(config.discord.botStatus, {
				type: 'PLAYING',
			});
		});
	}

	login(): void {
		console.log('Logging in...');
		this.client.login(config.discord.appToken);
	}

	destroy(): void {
		this.client.destroy();
	}

	log(message: string): void {
		this.getLogChannel().then(channel => {
			if (channel) {
				channel.send(message);
			}
		});
	}

	async getLogChannel(): Promise<TextChannel> {
		return this.client.channels
			.fetch(config.discord.logChannelId)
			.then(channel => channel as TextChannel);
	}

	async getUserById(id: string): Promise<User> {
		return this.client.users.fetch(id).catch(err => {
			throw err;
		});
	}

	sendMessageToUser(user: User, message: string): void {
		user.send(message);
	}

	async sendMessageToUserById(userId: string, message: string): Promise<void> {
		this.getUserById(userId)
			.then(user => {
				this.sendMessageToUser(user, message);
			})
			.catch(err => {
				throw err;
			});
	}
}

export default Bot;

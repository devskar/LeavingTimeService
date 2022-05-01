import {
	Awaitable,
	Client,
	ClientEvents,
	Intents,
	Message,
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
			this.log('LeavingTimerService started. Running Configurations now!');

			event.user.setActivity(config.discord.botStatus, {
				type: 'PLAYING',
			});
		});
	}

	login(): void {
		this.log('Logging in...');
		this.client.login(config.discord.appToken);
	}

	async destroy(): Promise<void> {
		this.client.destroy();
	}

	async log(message: string): Promise<Message<boolean> | void> {
		console.log('[LOG] ' + message);
		if (this.client.isReady())
			return this.sendMessageToChannelById(
				config.discord.logChannelId,
				message,
			);
	}

	async getUserById(id: string): Promise<User> {
		return this.client.users.fetch(id);
	}

	async getChannelById(id: string): Promise<TextChannel> {
		return (await this.client.channels.fetch(id)) as TextChannel;
	}

	async sendMessageToUser(
		user: User,
		message: string,
	): Promise<Message<boolean>> {
		// DEBUG
		this.log('Sending message to ' + user.username);
		return user.send(message);
	}

	async sendMessageToUserById(
		userId: string,
		message: string,
	): Promise<Message<boolean>> {
		const user = await this.getUserById(userId);
		return this.sendMessageToUser(user, message);
	}

	async sendMessageToChannelById(
		channelId: string,
		message: string,
	): Promise<Message<boolean>> {
		const channel = await this.getChannelById(channelId);
		return this.sendMessageToChannel(channel, message);
	}

	async sendMessageToChannel(
		channel: TextChannel,
		message: string,
	): Promise<Message<boolean>> {
		return channel.send(message);
	}
}

export default Bot;

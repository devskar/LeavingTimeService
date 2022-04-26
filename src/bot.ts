import {
	Awaitable,
	Client,
	ClientEvents,
	Intents,
	Message,
	User,
} from 'discord.js';
import config from '../ltime.config.json';

class Bot {
	private client: Client;
	private clientMessageQueue: { id: string; message: string }[] = [];
	private serverMessageQueue: { id: string; message: string }[] = [];

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

	async destroy(): Promise<void> {
		this.client.destroy();
	}

	async log(message: string): Promise<void> {
		this.addServerMessageToQueue(config.discord.logChannelId, message);
		console.log(message);
	}

	async getUserById(id: string): Promise<User> {
		return this.client.users.fetch(id);
	}

	async sendMessageToUser(
		user: User,
		message: string,
	): Promise<Message<boolean>> {
		console.log('Sending message to ' + user.username);
		return user.send(message);
	}

	async sendMessageToUserById(
		userId: string,
		message: string,
	): Promise<Message<boolean>> {
		const user = await this.getUserById(userId);
		return this.sendMessageToUser(user, message);
	}

	addClientMessageToQueue(id: string, message: string): void {
		this.clientMessageQueue.push({ id, message });
	}

	async sendQueuedClientMessages(): Promise<void> {
		Promise.all(
			this.clientMessageQueue.map(message =>
				this.sendMessageToUserById(message.id, message.message),
			),
		);
	}

	addServerMessageToQueue(id: string, message: string): void {
		this.serverMessageQueue.push({ id, message });
	}

	async sendQueuedServerMessages(): Promise<void> {
		Promise.all(
			this.serverMessageQueue.map(message =>
				this.sendMessageToUserById(message.id, message.message),
			),
		);
	}
}

export default Bot;

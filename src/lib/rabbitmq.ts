import * as amqp from 'amqplib';

let channel: amqp.Channel | null = null;
let connection: amqp.Connection | null = null;

export async function connectRabbitMQ() {
    try {
        const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
        connection = await amqp.connect(url);
        channel = await connection.createChannel();
        console.log('🐰 RabbitMQ connected');
        return { connection, channel };
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
        throw error;
    }
}

export async function publishEvent(queue: string, event: any) {
    try {
        if (!channel) {
            await connectRabbitMQ();
        }

        await channel!.assertQueue(queue, { durable: true });
        channel!.sendToQueue(queue, Buffer.from(JSON.stringify(event)), {
            persistent: true
        });

        console.log(`📤 Published event to ${queue}:`, event.event);
    } catch (error) {
        console.error('Error publishing event:', error);
    }
}

export function getRabbitMQChannel() {
    return channel;
}

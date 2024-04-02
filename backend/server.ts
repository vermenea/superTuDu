import Fastify, {
	FastifyInstance,
	FastifyRequest,
	FastifyReply,
} from 'fastify';
import fs from 'fs';
import fastifyCors from '@fastify/cors';

const fastify: FastifyInstance = Fastify({ logger: true });

fastify.register(fastifyCors);

let todos: Todo[] = [];

try {
	const data = fs.readFileSync('todos.json', 'utf8');
	todos = JSON.parse(data);
} catch (error) {
	console.error('Error loading todos:', error);
}

fastify.get('/todos', async (request: FastifyRequest, reply: FastifyReply) => {
	reply.code(200).send(todos)
});

fastify.post(
	'/todos',
	async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const todoData = request.body as Todo;
			const newTodo: Todo = { ...todoData, idx: Date.now() };
			todos.push(newTodo);
			saveTodosToFile(todos);
			reply.code(201).send(newTodo);
		} catch (error) {
			reply.code(500).send({ error: 'Internal Server Error' });
		}
	}
);

function saveTodosToFile(todos: Todo[]) {
	fs.writeFile('todos.json', JSON.stringify(todos), 'utf8', (err) => {
		if (err) {
			console.error('Error saving todos:', err);
		}
	});
}

interface Todo {
	idx: number;
	name: string;
	completed: boolean;
}

const start = async () => {
	try {
		await fastify.listen({ port: 3000 });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();

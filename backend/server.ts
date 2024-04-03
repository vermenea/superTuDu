import Fastify, {
	FastifyInstance,
	FastifyRequest,
	FastifyReply,
} from 'fastify';
import fs from 'fs';
import fastifyCors from '@fastify/cors';
import { v4 as uuidv4 } from 'uuid';

interface TodoRequestBody {
	name: string;
	completed: boolean;
}

interface TodoProps {
	idx: string;
	name: string;
	completed: boolean;
}

const fastify: FastifyInstance = Fastify({ logger: true });

fastify.register(fastifyCors);

let todos: TodoProps[] = [];

try {
	const data = fs.readFileSync('todos.json', 'utf8');
	todos = JSON.parse(data);
} catch (error) {
	console.error('Error loading todos:', error);
}

fastify.get('/todos', async (request: FastifyRequest, reply: FastifyReply) => {
	reply.code(200).send(todos);
});

fastify.post('/todos', async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const todoData = request.body as TodoRequestBody;
		const newTodo: TodoProps = { ...todoData, idx: uuidv4() };
		todos.push(newTodo);
		saveTodosToFile(todos);
		reply.code(201).send(newTodo);
	} catch (error) {
		reply.code(500).send({ error: 'Internal Server Error' });
	}
});

fastify.delete(
	'/todos/:idx',
	async (
		request: FastifyRequest<{ Params: { idx: string } }>,
		reply: FastifyReply
	) => {
		try {
			const idxToDelete = request.params.idx;
			todos = todos.filter((todo) => todo.idx !== idxToDelete);
			saveTodosToFile(todos);
			reply.code(200).send({ message: 'Todo deleted successfully' });
		} catch (error) {
			reply.code(500).send({ error: 'Internal Server Error' });
		}
	}
);

fastify.put(
	'/todos/:idx',
	async (
		request: FastifyRequest<{ Params: { idx: string } }>,
		reply: FastifyReply
	) => {
		try {
			const idxToUpdate = request.params.idx;
			const { completed } = request.body as TodoRequestBody;

			const todoToUpdateIndex = todos.findIndex(
				(todo) => todo.idx === idxToUpdate
			);

			if (todoToUpdateIndex === -1) {
				reply.code(404).send({ message: 'Todo not found' });
				return;
			}

			todos[todoToUpdateIndex].completed = completed;

			saveTodosToFile(todos);
			reply.code(200).send({ message: 'Todo updated successfully' });
		} catch (error) {
			reply.code(500).send({ error: 'Internal Server Error' });
		}
	}
);

function saveTodosToFile(todos: TodoProps[]) {
	fs.writeFile('todos.json', JSON.stringify(todos), 'utf8', (err) => {
		if (err) {
			console.error('Error saving todos:', err);
		}
	});
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

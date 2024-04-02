import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export async function fetchTodo({
	id,
	signal,
}: {
	id: string | undefined;
	signal: any;
}) {
	if (!id) {
		throw new Error('Todo ID is undefined');
	}

	const response = await fetch(`http://localhost:3000/todos`, {
		signal,
	});
	if (!response.ok) {
		const error = new Error('An error occurred while fetching todo');
		throw error;
	}
	const todo = await response.json();
	return todo;
}

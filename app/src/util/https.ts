import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export async function fetchTodo() {

	const response = await fetch(`http://localhost:3000/todos`)
	if (!response.ok) {
		const error = new Error('An error occurred while fetching todo');
		throw error;
	}
	const todo = await response.json();
	return todo;
}

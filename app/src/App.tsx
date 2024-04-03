import { useQuery } from '@tanstack/react-query';
import { fetchTodo } from './util/https';
import Todo from './Todo';

function App() {
	const { data: todos, refetch } = useQuery({
		queryKey: ['todos'],
		queryFn: () => fetchTodo(),
	});

	async function handleAddTodo(newTodo: string) {
		try {
			const response = await fetch('http://localhost:3000/todos', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name: newTodo, completed: false }),
			});
			if (!response.ok) {
				throw new Error('Failed to add todo');
			}
			const addedTodo = await response.json();

			refetch();
			return addedTodo;
		} catch (error) {
			console.error('Error adding todo:', error);

			return null;
		}
	}
	async function handleDeleteTodo(idx: string) {
		try {
			const response = await fetch(`http://localhost:3000/todos/${idx}`, {
				method: 'DELETE',
			});
			if (!response.ok) {
				throw new Error('Failed to delete todo');
			}
			refetch();
		} catch (error) {
			console.error('Error deleting todo:', error);
		}
	}

	async function handleMarkCompletedTodo(idx: string, completed: boolean) {
		try {
			const response = await fetch(`http://localhost:3000/todos/${idx}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ completed }),
			});
			if (!response.ok) {
				throw new Error('Failed to mark todo as completed');
			}
			refetch();
		} catch (error) {
			console.error('Error marking todo as completed:', error);
		}
	}

	if (!todos) return <p>Loading...</p>;
	return (
		<Todo
			addTodo={handleAddTodo}
			todos={todos}
			deleteTodo={handleDeleteTodo}
			refetchTodos={refetch}
			markTodo={handleMarkCompletedTodo}
		/>
	);
}

export default App;

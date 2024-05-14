import styled from 'styled-components';
export const Container = styled.section`
	.todos {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20px;

		input[type='text'] {
			padding: 8px;
			font-size: 16px;
			margin-right: 10px;
			border-radius: 5px;
			border: 1px solid #ccc;
		}

		button {
			padding: 8px 16px;
			font-size: 16px;
			background-color: #bf4f74;
			color: white;
			border: none;
			border-radius: 5px;
			cursor: pointer;
		}
	}

	.list {
		list-style: none;
		padding: 0;

		.todo-box {
			background-color: #f0f0f0;
			border-radius: 5px;
			margin-bottom: 10px;

			.todo {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10px;

				p {
					margin: 0;
				}

				.buttons-box {
					button {
						background-color: #bf4f74;
						color: white;
						border: none;
						border-radius: 5px;
						cursor: pointer;
						margin-right: 5px;
					}

					input[type='checkbox'] {
						margin-right: 5px;
					}
				}
			}
		}
	}
`;

import Board from "../types/BoardType";
import APIResponse from "../types/APIResponseType";

class APIUtils {
    public static async createOrGetBoard(name: string) {
        const response = await fetch(`http://localhost:3000/api/v1/boards/${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const transformedResponse: APIResponse = await response.json();

        if (transformedResponse.data) {
            return transformedResponse.data.board;
        } else {
            throw new Error(transformedResponse.message);
        }
    }

    public static async createBoard(board: Board) {
        const response: APIResponse = await fetch('http://192.168.1.201:3001/api/v1/boards', {
            method: "POST",
            body: JSON.stringify(board)
        }) as unknown as APIResponse;

       if (response.data) {
           return response.data.board;
       } else {
           throw new Error(response.message);
       }
    }
}

export default APIUtils;

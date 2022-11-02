import Board from "../types/BoardType";
import APIResponse from "../types/APIResponseType";

class APIUtils {
    public static async getBoard(name: string) {
        const response: APIResponse = await fetch(`http://192.168.1.201:3001/api/v1/boards/${name}`) as unknown as APIResponse;

        if (response.data) {
            return response.data.board;
        } else {
            throw new Error(response.message);
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

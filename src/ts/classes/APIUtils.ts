import Board from "../types/BoardType";
import APIResponse from "../types/APIResponseType";
import Note from "./Note";
import NoteDB from '../types/NoteType';

type updateData = {
    notes?: Note[],
    mileage?: number
};

class APIUtils {
    public static async createOrGetBoard(name: string) {
        const response = await fetch(`http://localhost:3001/api/v1/boards/${name}`, {
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

    public static async updateBoard(name: string, data: updateData) {
        const preparedData: { mileage: number, notes?: NoteDB[] } = {
            mileage: data.mileage
        };

        if (data.notes) {
            preparedData.notes = data.notes.map(n => {
                return {
                    id: n.id,
                    content: n.content,
                    isFavorite: n.isFavorite
                }
            })
        }

        const response = await fetch(`http://localhost:3001/api/v1/boards/${name}`, {
            method: 'PATCH',
            body: JSON.stringify(preparedData),
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
        const response: APIResponse = await fetch('http://localhost:3001/api/v1/boards', {
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

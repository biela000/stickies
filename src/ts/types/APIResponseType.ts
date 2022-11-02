import Board from "./BoardType";

type APIResponse = {
    status: string,
    message?: string,
    data?: {
        board?: Board,
        boards?: [Board]
    }
}

export default APIResponse;

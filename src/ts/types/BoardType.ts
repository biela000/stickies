import Note from "./NoteType";

type Board = {
    name: string,
    notes: [Note?],
    mileage: number
}

export default Board;

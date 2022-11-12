import Note from "./Note";
import APIUtils from "./APIUtils";
import BoardType from "../types/BoardType";

class Board {
  readonly name: string;
  private HTMLContainer: HTMLDivElement;
  private HTMLNewNoteBtn: HTMLDivElement;
  private notes: Note[];
  public currZIndex: number;

  constructor(name: string, HTMLContainerClass: string, HTMLNewNoteBtnClass: string) {
    this.name = name;
    this.HTMLContainer = document.querySelector(HTMLContainerClass);
    this.HTMLNewNoteBtn = document.querySelector(HTMLNewNoteBtnClass);
    this.notes = [];
    this.currZIndex = 0;

    const getNotes = async () => {
      const board: BoardType = await APIUtils.createOrGetBoard(this.name);
      board.notes.forEach(note => {
        this.addNote(note.id, note.content, note.isFavorite);
        this.currZIndex++;
      });
    };

    getNotes();
 }

  public start() {
    this.HTMLNewNoteBtn.addEventListener("click", this.addNote.bind(this, null, null, null));
  }

  private addNote(id?: string, content?: string, isFavorite?: boolean) {
    const newNote: Note = new Note(id, content, isFavorite);
    const { container: newHTMLNote } = newNote.createElement();
    newHTMLNote.addEventListener('mousedown', () => {
      this.currZIndex++;
      newHTMLNote.style.zIndex = `${this.currZIndex}`;
    });
    this.HTMLContainer.appendChild(newHTMLNote);
    this.notes.push(newNote);
  }
}

export default Board;

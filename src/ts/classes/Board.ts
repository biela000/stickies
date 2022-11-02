import Note from "./Note";

class Board {
  readonly id: string;
  private HTMLContainer: HTMLDivElement;
  private HTMLNewNoteBtn: HTMLDivElement;
  private notes: Note[];

  constructor(HTMLContainerClass: string, HTMLNewNoteBtnClass: string) {
    this.HTMLContainer = document.querySelector(HTMLContainerClass);
    this.HTMLNewNoteBtn = document.querySelector(HTMLNewNoteBtnClass);

    this.notes = [];
 }

  public start() {
    this.HTMLNewNoteBtn.addEventListener("click", this.addNote.bind(this));
  }

  private addNote() {
    const newNote: Note = new Note();
    const { container: newHTMLNote } = newNote.createElement();
    this.HTMLContainer.appendChild(newHTMLNote);
    this.notes.push(newNote);
  }
}

export default Board;

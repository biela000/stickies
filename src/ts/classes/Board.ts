import Note from "./Note";
import APIUtils from "./APIUtils";
import BoardType from "../types/BoardType";

class Board {
  readonly name: string;
  private HTMLContainer: HTMLDivElement;
  private HTMLNewNoteBtn: HTMLDivElement;
  private notes: Note[];
  private mileage: number;
  private onBoardCount: number;
  private currZIndex: number;

  constructor(name: string, HTMLContainerClass: string, HTMLNewNoteBtnClass: string) {
    this.name = name;
    this.HTMLContainer = document.querySelector(HTMLContainerClass);
    this.HTMLNewNoteBtn = document.querySelector(HTMLNewNoteBtnClass);
    this.notes = [];
    this.currZIndex = 0;
    this.onBoardCount = 0;

    const getNotes = async () => {
      const board: BoardType = await APIUtils.createOrGetBoard(this.name);
      this.mileage = board.mileage;
      (document.querySelector('.board-mileage .info-value') as HTMLSpanElement).innerText = `${this.mileage}`;
      board.notes.forEach(note => {
        this.addNote(note.id, note.content, note.isFavorite);
        this.currZIndex++;
      });
    };

    getNotes();
 }

  public start() {
    this.HTMLNewNoteBtn.addEventListener("click", this.addNote.bind(this, null, null, null, true));
  }

  private addNote(id?: string, content?: string, isFavorite?: boolean, firstTime?: boolean) {
    const newNote: Note = new Note(id, content, isFavorite);
    const { container: newHTMLNote, actionBar: newHTMLNoteBar, content: newHTMLNoteContent } = newNote.createElement();

    newHTMLNote.addEventListener('mousedown', () => {
      this.currZIndex++;
      newHTMLNote.style.zIndex = `${this.currZIndex}`;
    });

    const noteContentObserver = new MutationObserver((mutations) => {
      APIUtils.updateBoard(this.name, { notes: this.notes }).catch(err => console.error(err.message));
      console.log('a');
    });

    noteContentObserver.observe(newHTMLNoteContent, {
      subtree: true,
      childList: true,
      characterData: true
    });

    const boardMileageHTMLElement: HTMLSpanElement = document.querySelector('.board-mileage .info-value');
    const boardNoteCountHTMLElement: HTMLSpanElement = document.querySelector('.board-notes .info-value');

    newHTMLNoteBar.querySelector('.note-bar-delete').addEventListener('click', (e: MouseEvent) => {
      const noteId = (e.target as HTMLDivElement).id || (e.target as HTMLDivElement).parentElement.id;
      const noteToRemove: Note = this.notes.find(n => n.id === noteId);
      this.notes = this.notes.filter(n => n.id !== noteId);
      APIUtils.updateBoard(this.name, { notes: this.notes }).catch(err => console.error(err.message));
      this.HTMLContainer.removeChild(noteToRemove.HTMLNote.container);
      this.onBoardCount--;
      boardNoteCountHTMLElement.innerText = `${this.onBoardCount}`;
    });

    this.HTMLContainer.appendChild(newHTMLNote);
    this.notes.push(newNote);
    this.onBoardCount++;
    boardNoteCountHTMLElement.innerText = `${this.onBoardCount}`;
    if (firstTime) {
      this.mileage++;
      boardMileageHTMLElement.innerText = `${this.mileage || 0}`
    }
    APIUtils.updateBoard(this.name, { notes: this.notes, mileage: this.mileage }).catch(err => console.error(err.message));
  }
}

export default Board;

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
        this.addNote(note.id, note.content, note.isFavorite, false, { left: note.left, top: note.top, width: note.width, height: note.height, zIndex: note.zIndex });
        if (note.zIndex > this.currZIndex) this.currZIndex = note.zIndex;
      });
    };

    getNotes();
 }

  public start() {
    this.HTMLNewNoteBtn.addEventListener("click", this.addNote.bind(this, null, null, null, true));
  }

  private addNote(id?: string, content?: string, isFavorite?: boolean, firstTime?: boolean, DOMProps?: { left: string, top: string, width: string, height: string, zIndex: number }) {
    const newNote: Note = new Note(id, content, isFavorite);
    const { container: newHTMLNote, actionBar: newHTMLNoteBar, content: newHTMLNoteContent } = newNote.createElement();

    newHTMLNote.addEventListener('mousedown', (e) => {
      this.currZIndex++;
      newHTMLNote.style.zIndex = `${this.currZIndex}`;
    });

    const noteContentObserver = new MutationObserver((mutations) => {
      APIUtils.updateBoard(this.name, { notes: this.notes }).catch(err => console.error(err.message));
    });

    noteContentObserver.observe(newHTMLNoteContent, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    newHTMLNote.addEventListener('mouseup', () => {
      newNote.left = newHTMLNote.style.left;
      newNote.top = newHTMLNote.style.top;
      newNote.width = newHTMLNote.style.width;
      newNote.height = newHTMLNote.style.height;
      newNote.zIndex = +newHTMLNote.style.zIndex;
      APIUtils.updateBoard(this.name, { notes: this.notes }).catch(err => console.error(err.message));
    });

    const boardMileageHTMLElement: HTMLSpanElement = document.querySelector('.board-mileage .info-value');
    const boardNoteCountHTMLElement: HTMLSpanElement = document.querySelector('.board-notes .info-value');

    newHTMLNoteBar.querySelector('.note-bar-delete').addEventListener('click', (e: MouseEvent) => {
      const noteId = newHTMLNote.id;
      this.notes = this.notes.filter(n => n.id !== noteId);
      APIUtils.updateBoard(this.name, { notes: this.notes }).catch(err => console.error(err.message));
      this.HTMLContainer.removeChild(newHTMLNote);
      this.onBoardCount--;
      boardNoteCountHTMLElement.innerText = `${this.onBoardCount}`;
    });

    let safeLeft = DOMProps.left || '50px';
    let safeTop = DOMProps.top || '50px';

    if (DOMProps.left && DOMProps.top) {
      const numberLeft = +DOMProps.left.slice(0, DOMProps.left.length - 2);
      const numberTop = +DOMProps.top.slice(0, DOMProps.top.length - 2);
      if (numberLeft >= window.innerWidth || numberLeft <= -DOMProps.width.slice(0, DOMProps.width.length - 2)) {
        safeLeft = `50px`;
      }
      if (numberTop >= window.innerHeight || numberTop < 0) {
        safeTop = `50px`;
      }
    }

    newNote.left = safeLeft;
    newNote.top = safeTop;
    newNote.width = DOMProps.width || '400px';
    newNote.height = DOMProps.height || '300px';
    newNote.zIndex = DOMProps.zIndex || ++this.currZIndex;

    newHTMLNote.style.left = safeLeft;
    newHTMLNote.style.top = safeTop;
    newHTMLNote.style.width = DOMProps.width || '400px';
    newHTMLNote.style.height = DOMProps.height || '300px';
    newHTMLNote.style.zIndex = `${DOMProps.zIndex || ++this.currZIndex}`;

    this.HTMLContainer.appendChild(newHTMLNote);
    this.notes.push(newNote);

    this.onBoardCount++;
    boardNoteCountHTMLElement.innerText = `${this.onBoardCount}`;

    if (firstTime) {
      this.mileage++;
      boardMileageHTMLElement.innerText = `${this.mileage || 0}`
      APIUtils.updateBoard(this.name, { notes: this.notes, mileage: this.mileage }).catch(err => console.error(err.message));
    }
  }
}

export default Board;

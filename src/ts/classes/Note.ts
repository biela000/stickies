import { v4 as uuidv4 } from "uuid";

export type HTMLNoteElement = {
  container: HTMLDivElement,
  actionBar: HTMLDivElement,
  title: HTMLTextAreaElement,
  content: HTMLTextAreaElement
}

class Note {
  readonly id: string;
  private _title: string;
  private _content: string;
  private _isFavorite: boolean;
  private _HTMLNote: HTMLNoteElement;

  public get title(): string {
    return this._title;
  }

  public set title(title: string) {
    this._title = title;
  }

  public get content(): string {
    return this._content;
  }

  public set content(content: string) {
    this._content = content;
  }

  public get isFavorite(): boolean {
    return this._isFavorite;
  }

  public toggleFavorite() {
    this._isFavorite = !this._isFavorite;
  }

  public get HTMLNote(): HTMLNoteElement {
    return this._HTMLNote;
  }

  public constructor() {
    this.id = uuidv4();
    this._title = "";
    this._content = "";
    this._isFavorite = false;
  }

  private textChangeHandler(event: Event) {
    const { name, value } = event.target as HTMLTextAreaElement;
    if (name === "content") {
      this._content = value;
    } else if (name === "title") {
      this._title = value;
    }
  }

  private removeNote() {
    this.HTMLNote.container.parentNode.removeChild(this.HTMLNote.container);
  }

  private dragNote = (event: MouseEvent) => {
    const { movementX, movementY } = event;
    const containerStyle: CSSStyleDeclaration = window.getComputedStyle(this._HTMLNote.container);
    const { left, top } = { left: parseFloat(containerStyle.left), top: parseFloat(containerStyle.top) };
    const exceedsWidth = left + movementX > window.innerWidth - parseFloat(containerStyle.width) || left + movementX < 0;
    const exceedsHeight = top + movementY > window.innerHeight - parseFloat(containerStyle.height) || top + movementY < 0;
    this._HTMLNote.container.style.left = `${!exceedsWidth ? left + movementX : left}px`;
    this._HTMLNote.container.style.top = `${!exceedsHeight ? top + movementY : top}px`;
  }

  private grabNote() {
    window.addEventListener("mousemove", this.dragNote);
  }

  private dropNote() {
    window.removeEventListener("mousemove", this.dragNote);
  }

  public createElement(): HTMLNoteElement {
    const newHTMLNote: HTMLDivElement = document.createElement("div");
    newHTMLNote.classList.add("note");
    
    const { noteBar, noteTitle, noteSeparator, noteContent } = {
      noteBar: document.createElement("div"),
      noteTitle: document.createElement("textarea"),
      noteSeparator: document.createElement("hr"),
      noteContent: document.createElement("textarea")
    }

    noteBar.classList.add("note-bar");
    const deleteButton: HTMLImageElement = document.createElement("img");
    deleteButton.classList.add("note-bar-delete");
    deleteButton.addEventListener("click", this.removeNote.bind(this));
    deleteButton.src = "images/trash.png";
    deleteButton.alt = "remove";
    noteBar.appendChild(deleteButton);
    noteBar.addEventListener("mousedown", this.grabNote.bind(this));
    document.addEventListener("mouseup", this.dropNote.bind(this));

    noteTitle.name = "title";
    noteTitle.classList.add("note-title");
    noteTitle.addEventListener("change", this.textChangeHandler.bind(this));
    
    noteSeparator.classList.add("note-separator");

    noteContent.name = "content";
    noteContent.classList.add("note-content");
    noteContent.addEventListener("change", this.textChangeHandler.bind(this));

    newHTMLNote.appendChild(noteBar);
    newHTMLNote.appendChild(noteTitle);
    newHTMLNote.appendChild(noteSeparator);
    newHTMLNote.appendChild(noteContent);
    
    this._HTMLNote = {
      container: newHTMLNote,
      actionBar: noteBar,
      title: noteTitle,
      content: noteContent
    }
    
    return this.HTMLNote;
  }
}

export default Note;

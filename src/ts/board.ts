import "../scss/board.scss";
import Board from "./classes/Board";
import tinymce from "tinymce";

const boardName: string = window.location.pathname.split('/').pop();

const board = new Board(boardName, ".stck-brd", ".n-note");
board.start();

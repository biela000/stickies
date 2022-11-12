import "../scss/board.scss";
import Board from "./classes/Board";

const boardName: string = window.location.pathname.split('/').pop();

const board = new Board('czerwonieak', ".stck-brd", ".n-note");
board.start();

import "../scss/board.scss";
import Board from "./classes/Board";

const board = new Board(".stck-brd", ".n-note");
board.start();

import "../scss/index.scss";
import FormUtils from "./classes/FormUtils";

FormUtils.addSubmitEventHandler(document.querySelector('.board-name-form'), document.querySelector('input[name=\"board-name\"]'));

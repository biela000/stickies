import APIUtils from "./APIUtils";

class FormUtils {
   public static validate(input: HTMLInputElement) {

   }

   public static addSubmitEventHandler(form: HTMLFormElement, nameInput: HTMLInputElement) {
       form.addEventListener('submit', async (e) => {
           e.preventDefault();

           try {
               await APIUtils.createBoard({
                   name: nameInput.value,
                   notes: []
               });
           } catch (err) {

           }

       });
   }
}

export default FormUtils;

class FormUtils {
   public static addSubmitEventHandler(form: HTMLFormElement, nameInput: HTMLInputElement) {
       form.addEventListener('submit', async (e) => {
           e.preventDefault();
           window.location.replace(`${window.location.protocol}//${window.location.host}/boards/${nameInput.value.trim()}`)
           //window.location.replace(`${window.location.protocol}//${window.location.host}/dist/sticky-page.html`)
       });
   }
}

export default FormUtils;

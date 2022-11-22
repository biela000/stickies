class FormUtils {
   public static addSubmitEventHandler(form: HTMLFormElement, nameInput: HTMLInputElement) {
       form.addEventListener('submit', async (e) => {
           e.preventDefault();
	   if (nameInput.value.trim().length >= 5 && nameInput.value.trim().length <= 20) {
           	window.location.replace(`${window.location.protocol}//${window.location.host}/boards/${nameInput.value.trim()}`)
           //window.location.replace(`${window.location.protocol}//${window.location.host}/dist/sticky-page.html`)
	   }
       });
   }
}

export default FormUtils;

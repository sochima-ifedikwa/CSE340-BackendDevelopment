document.addEventListener("DOMContentLoaded", () => {
  // Select all forms with the specific class
  const forms = document.querySelectorAll(".updateForm");

  // Iterate over each form
  forms.forEach((form) => {
    form.addEventListener("change", function () {
      //Select the button inside the form that changed
      const updateBtn = form.querySelector(".btn-account");
      if (updateBtn) {
        updateBtn.removeAttribute("disabled");
      }
    });
  });
});
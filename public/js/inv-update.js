const form = document.querySelector("#edit-inventory-form")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#edit-inventory-submit")
      updateBtn.removeAttribute("disabled")
    })

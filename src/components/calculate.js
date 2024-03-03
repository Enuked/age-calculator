function validateDate(day, month, year) {
  const errors = {};

  if (day === "--" || month === "--" || year === "--") {
    errors.date = "Please enter a valid date.";
  } else {
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (dayNum < 1 || dayNum > 31 || isNaN(new Date(yearNum, monthNum - 1, dayNum).getDate())) {
      errors.day = "Must be a valid day.";
    }

    if (monthNum < 1 || monthNum > 12) {
      errors.month = "Must be a valid month.";
    }

    const inputDate = new Date(yearNum, monthNum - 1, dayNum);
    const currentDate = new Date();

    if (inputDate > currentDate) {
      errors.future = "Please enter a date in the past or today.";
    }

    const minYear = 1900;
    if (yearNum < minYear || yearNum > currentDate.getFullYear()) {
      errors.year = "Must be a valid year.";
    }
  }

  return errors;
}


function displayErrors(errors) {
  for (const key in errors) {
    const errorMessage = errors[key];
    const errorElement = document.getElementById(key + "Error");
    if (errorElement) {
      errorElement.textContent = errorMessage;
      const parentDiv = errorElement.closest(".text-fields");
      const labelElement = parentDiv.querySelector(".label");
      const inputElement = parentDiv.querySelector("input");
      if (labelElement) {
        labelElement.style.color = "hsl(0, 100%, 67%)";
      }
      if (inputElement) {
        inputElement.style.borderColor = "hsl(0, 100%, 67%)";
      }
    }
  }
}



function clearErrors(inputIds) {
  inputIds.forEach((id) => {
    const errorElement = document.getElementById(id + "Error");
    if (errorElement) {
      errorElement.textContent = "";
    }
  });
}

function resetDisplayedValues() {
  document.getElementById("daysSince").textContent = "--";
  document.getElementById("monthsSince").textContent = "--";
  document.getElementById("yearsSince").textContent = "--";
}

function validateAndSubmit() {
  const inputIds = ["day", "month", "year"];
  clearErrors(inputIds);
  const dayInput = document.getElementById("dayInput");
  const monthInput = document.getElementById("monthInput");
  const yearInput = document.getElementById("yearInput");

  let day = dayInput.value.trim();
  let month = monthInput.value.trim();
  let year = yearInput.value.trim();

  day = day === "" || isNaN(day) ? "--" : parseInt(day);
  month = month === "" || isNaN(month) ? "--" : parseInt(month);
  year = year === "" || isNaN(year) ? "--" : parseInt(year);

  const errors = validateDate(day, month, year);
  displayErrors(errors);

  if (Object.keys(errors).length === 0) {
    const inputDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    let yearsSince = currentDate.getFullYear() - inputDate.getFullYear();
    let monthsSince = currentDate.getMonth() - inputDate.getMonth();
    let daysSince = currentDate.getDate() - inputDate.getDate();

    if (daysSince < 0) {
      monthsSince--;
      daysSince += new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      ).getDate();
    }
    if (monthsSince < 0) {
      yearsSince--;
      monthsSince += 12;
    }

    // Update the DOM with the calculated values
    document.getElementById("daysSince").textContent = daysSince;
    document.getElementById("monthsSince").textContent = monthsSince;
    document.getElementById("yearsSince").textContent = yearsSince;
  } else {
    // Reset displayed values if errors exist
    resetDisplayedValues();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const inputFields = document.querySelectorAll("input[type='text']");

  inputFields.forEach((input) => {
    input.addEventListener("input", () => {
      const inputId = input.getAttribute("id").replace("Input", "");
      const inputValue = input.value.trim();

      let inputError = "";

      if (inputValue === "") {
        inputError = "Please enter a value.";
      } else if (isNaN(inputValue) || parseInt(inputValue) < 1) {
        inputError = "positive number.";
      }

      const errorElement = document.getElementById(inputId + "Error");
      if (errorElement) {
        errorElement.textContent = inputError;
      }
    });

    input.addEventListener("keypress", function (event) {
      const inputValue = input.value.trim(); // Define inputValue here
    
      if (event.key === "Enter") {
        event.preventDefault();
        if (inputValue === "") {
          const inputId = input.getAttribute("id").replace("Input", "");
          const errorElement = document.getElementById(inputId + "Error");
          if (errorElement) {
            errorElement.textContent = "This field is required.";
          }
          // Change input border color to red
          input.style.borderColor = "red";
          
          // Change label color to red
          const parentDiv = input.closest(".text-fields");
          const labelElement = parentDiv.querySelector(".label");
          if (labelElement) {
            labelElement.style.color = "red";
          }
        } else {
          // If input is not empty, proceed with validation
          validateAndSubmit();
        }
      }
    });
    

    
  });

  // Set default values
  resetDisplayedValues();
});

const sleepForm = document.getElementById('input-container');

const sleepInput = document.getElementById('hours-slept');

sleepForm.addEventListener('submit', () => {
  event.preventDefault();
  const sleepData = {}
  sleepData.value = sleepInput.value

  console.log(sleepData)
})
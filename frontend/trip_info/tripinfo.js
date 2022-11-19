const tripInfo = document.getElementById('trip-info')

console.log(tripInfo)

const inputs = document.querySelectorAll('.required-input')

tripInfo.addEventListener('submit', () => {
  
  event.preventDefault();

  const dataArray = []

  inputs.forEach(input => {

    const inputObject = {}

    inputObject.name = input.id

    inputObject.value = input.value

    dataArray.push(inputObject)
    
  });

  console.log(dataArray)
})
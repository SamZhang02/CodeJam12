const tripInfo = document.getElementById('trip-info')

//console.log(tripInfo)

const inputs = document.querySelectorAll('.required-input')

tripInfo.addEventListener('submit', () => {
  
  event.preventDefault();

  const dataArray = []

  inputs.forEach(input => {

    dataArray.push(input.id)

    dataArray.push(input.value)
    
  });

  //console.log(dataArray)

  const dataObject = {}

  dataArray.forEach(function(value, index, key) {
    if(index % 2) {
      dataObject[key[index - 1]] = value;
    }
  })

  //console.log(dataObject)

  console.log(JSON.stringify(dataObject, null, 2))
})




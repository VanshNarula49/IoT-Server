let ledColour = "(000,1,1)"
let arr = ledColour.slice(1,ledColour.length-1).split(',')
let modifyFnc = (string)=>{
  let value = parseInt(string)
  console.log(value);
  if (value>0 && value < 10){
    console.log('10 one ran');

    return "00"+value

  }
  else if(value<100 && value >10){

    return "0"+value
  }
 else if(value == 0){
  console.log('0 one ran');
  return "000"
  }
else{
  console.log('direct return');

  return value
}
}




console.log(modifyFnc(arr[0]));
// console.log(modifyFnc(arr[1]));
// console.log(modifyFnc(arr[2]));
let array = [], maxLength = 200
const checkLength = ()=>{
  try{
    if(array.length > maxLength){
      console.log(array.length)
      while(array.length > maxLength) array.shift()
      console.log(array.length)
    }
    setTimeout(checkLength, 5000)
  }catch(e){
    setTimeout(checkLength, 5000)
    console.log(e)
  }
}
checkLength()
module.exports = async(data = {})=>{
  try{
    array.push(data)
  }catch(e){
    console.error(e);
  }
}

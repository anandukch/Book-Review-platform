
var inp = document.querySelector("#inp");
var main = document.querySelectorAll("#main");
let child = document.querySelectorAll("#child");
var opt=document.getElementById('opt')

function changer() {
  var categ=opt.options[opt.selectedIndex].value;
  console.log(categ);
  main.forEach((e) => {
    
    inp.value = inp.value.toLowerCase();
    var a = e.childNodes;
    if(categ==a[3].childNodes[1].classList[0]){
      var word = a[3].childNodes[1].innerHTML;
    word = word.toLowerCase();
    
    if (word.indexOf(inp.value) != -1) {
      
      e.style.display = "flex";
    } else {
      
      e.style.display = "none";
    }
    }
    if(categ==a[3].childNodes[5].classList[0]){
      var word = a[3].childNodes[5].innerHTML;
    word = word.toLowerCase();
    
    if (word.indexOf(inp.value) != -1) {
      
      e.style.display = "flex";
    } else {
      
      e.style.display = "none";
    }
    }
    if(categ==a[3].childNodes[3].classList[0]){
      var word = a[3].childNodes[3].innerHTML;
    word = word.toLowerCase();
    
    if (word.indexOf(inp.value) != -1) {
      
      e.style.display = "flex";
    } else {
      
      e.style.display = "none";
    }
    }
   
    
  });
  
}

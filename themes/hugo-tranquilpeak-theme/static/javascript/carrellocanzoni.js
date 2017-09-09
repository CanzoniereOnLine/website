function addtocart(canzone){
   try {
       var temp = JSON.parse(localStorage.carrellocanzoni);
       temp.push(canzone);
   } 
   catch (err) {
       var temp = new Array();
       temp[0] = canzone;
   }
   localStorage.carrellocanzoni = JSON.stringify(temp);
    rendercart();
}

function removefromcart(i){
    console.log(i);
    try {
       var temp = JSON.parse(localStorage.carrellocanzoni);
    } 
    catch (err) {
    return;
    }
    try{
        temp.splice(i,1);
    }
    catch (err){
        return;
    }
    localStorage.carrellocanzoni = JSON.stringify(temp);
    rendercart();
}

function rendercart(){
document.getElementById("badgecart").innerHTML = countcart();

    try {
        var carrello = "";
        var temp = JSON.parse(localStorage.carrellocanzoni);
        for (key in temp){
        song = temp[key];
        carrello = carrello + "<li class='appunti'><span class='left'>" + song.titolo + " di <i>" + song.autori + "</i> </span><span class='right'><a onclick='removefromcart("+key+")'> <i class='fa fa-trash' ></i></a><span class='spaced'>|</span><a onClick='singleaddtosongbook("+key+")' class='tooltip-top' data-tooltip='Aggiungi al canzoniere'><span class='glyphicon glyphicon-share-alt' aria-hidden='true'></span></a></span></li>";
        console.log(song);
        }
    } 
    catch (err) {
        var carrello="<p>Non hai aggiunto ancora nessuna canzone</p>";       
    }

document.getElementById("cardcart").innerHTML = carrello;
}

function countcart(){

   try {
       var temp = JSON.parse(localStorage.carrellocanzoni);
   } 
   catch (err) {
    return 0;   
    }
    console.log(temp.length)
   return temp.length;
}

function addtosongbook(){
    try {
        var temp = JSON.parse(localStorage.carrellocanzoni);
        var backup = JSON.parse(localStorage.backup);
    } 
   catch (err) {
    return 0;   
    }
    backup[0].selezionecanzoni = backup[0].selezionecanzoni.concat(temp);
    localStorage.backup = JSON.stringify(backup);
    localStorage.carrellocanzoni = "";
    window.location.replace('https://canzoniereonline.it/crea/canzoniere/');
}

function singleaddtosongbook(i){
    console.log(i);
    try {
       var temp = JSON.parse(localStorage.carrellocanzoni);
        var backup = JSON.parse(localStorage.backup);
    } 
    catch (err) {
    return;
    }
    try{
       var temp2 = temp[i];
    }
    catch (err){
        return;
    }
    backup[0].selezionecanzoni = backup[0].selezionecanzoni.concat(temp2);
    localStorage.backup = JSON.stringify(backup);    
    removefromcart(i);
    rendercart();
}


$(document).ready(function(){
    rendercart();
});
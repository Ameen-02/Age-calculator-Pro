const dob = document.getElementById("dob");
const tob = document.getElementById("tob");
const resultCard = document.getElementById("resultCard");
const loader = document.getElementById("loader");
const error = document.getElementById("error");

let secInterval;

// LOAD SAVED DOB
window.onload = ()=>{
 if(localStorage.dob) dob.value = localStorage.dob;
 renderHistory();
}

// CALCULATE
document.getElementById("calcBtn").onclick = ()=>{
 error.textContent="";
 if(!dob.value){error.textContent="Enter valid DOB"; shake(); return;}

 loader.classList.remove("hidden");
 resultCard.classList.add("hidden");

 setTimeout(calcAge,700);
}

function calcAge(){
 const birth = new Date(dob.value+" "+(tob.value||"00:00"));
 const now = new Date();

 if(birth>now){ error.textContent="Future date not allowed"; shake(); loader.classList.add("hidden"); return;}

 localStorage.dob = dob.value;

 let diff = now-birth;

 let seconds = Math.floor(diff/1000);
 let minutes = Math.floor(seconds/60);
 let hours = Math.floor(minutes/60);
 let days = Math.floor(hours/24);
 let weeks = Math.floor(days/7);

 let years = now.getFullYear()-birth.getFullYear();
 let months = now.getMonth()-birth.getMonth();
 let d = now.getDate()-birth.getDate();
 if(d<0){months--; d+=30}
 if(months<0){years--; months+=12}

 document.getElementById("ageResult").innerHTML=`${years} Years ${months} Months ${d} Days`;
 document.getElementById("days").textContent=days;
 document.getElementById("weeks").textContent=weeks;
 document.getElementById("hours").textContent=hours;
 document.getElementById("minutes").textContent=minutes;

 // LIVE SECONDS
 clearInterval(secInterval);
 secInterval=setInterval(()=>{
 seconds++;
 document.getElementById("seconds").textContent=seconds;
 },1000);

 nextBirthday(birth,now,years);
 zodiac(birth);
 lifePathCalc();
 progressBar(years);

 saveHistory(dob.value);

 loader.classList.add("hidden");
 resultCard.classList.remove("hidden");
 resultCard.scrollIntoView({behavior:"smooth"});
}

// NEXT BDAY
function nextBirthday(birth,now,years){
 let next = new Date(now.getFullYear(),birth.getMonth(),birth.getDate());
 if(next<now) next.setFullYear(next.getFullYear()+1);
 let diff = Math.ceil((next-now)/86400000);

 document.getElementById("nextBirthday").textContent=
 "Next Birthday: "+next.toDateString()+" ("+diff+" days left)";
 document.getElementById("countdown").textContent=
 "Turning Age: "+(years+1);
}

// ZODIAC
function zodiac(date){
 const m=date.getMonth()+1,d=date.getDate();
 const signs=[
 ["Capricorn",1,19],["Aquarius",2,18],["Pisces",3,20],
 ["Aries",4,19],["Taurus",5,20],["Gemini",6,20],
 ["Cancer",7,22],["Leo",8,22],["Virgo",9,22],
 ["Libra",10,22],["Scorpio",11,21],["Sagittarius",12,21],["Capricorn",12,31]
 ];
 let sign=signs.find(s=>m==s[1] && d<=s[2])[0];
 document.getElementById("zodiac").textContent=sign;
}

// LIFE PATH
function lifePathCalc(){
 let nums=dob.value.replaceAll("-","").split("").map(Number);
 let sum=nums.reduce((a,b)=>a+b,0);
 while(sum>9) sum=sum.toString().split("").reduce((a,b)=>+a+ +b);
 document.getElementById("lifePath").textContent=sum;
}

// PROGRESS
function progressBar(age){
 let percent=(age/80)*100;
 document.getElementById("progressBar").style.width=percent+"%";
}

// RESET
document.getElementById("resetBtn").onclick=()=>{
 dob.value="";
 tob.value="";
 resultCard.classList.add("hidden");
}

// COPY
document.getElementById("copyBtn").onclick=()=>{
 navigator.clipboard.writeText(document.getElementById("ageResult").innerText);
 alert("Copied!");
}

// SHARE
document.getElementById("shareBtn").onclick=()=>{
 if(navigator.share){
 navigator.share({text:document.getElementById("ageResult").innerText});
 }
}

// DARK MODE
document.getElementById("modeToggle").onclick=()=>{
 document.body.classList.toggle("dark");
}

// HISTORY
function saveHistory(date){
 let arr=JSON.parse(localStorage.history||"[]");
 arr.unshift(date);
 arr=[...new Set(arr)].slice(0,3);
 localStorage.history=JSON.stringify(arr);
 renderHistory();
}
function renderHistory(){
 let arr=JSON.parse(localStorage.history||"[]");
 document.getElementById("history").innerHTML=arr.map(d=>`<li>${d}</li>`).join("");
}

// ERROR SHAKE
function shake(){
 document.querySelector(".card").animate(
 [{transform:"translateX(-5px)"},{transform:"translateX(5px)"}],
 {duration:300,iterations:4}
);
}

// LANGUAGE TOGGLE
document.getElementById("langToggle").onclick=()=>{
 alert("Multi-language system ready — connect translation JSON later.");
}

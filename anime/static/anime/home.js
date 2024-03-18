var input = document.getElementById("search");



// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
  if(input.value.length==0){
    return;
  }
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    $(".loading").show();
    data={
      "search":input.value,
      "type":document.querySelector('input[name="type"]:checked').value
    }
    console.log(data);
    setRequestHeader();
    $.ajax({
      dataType: 'json',
      type: 'POST',
      url: "/getdata/",
      data: data,

      success: function (data) {
        $(".loading").hide();
          console.log("Success:", data);
          document.getElementById("holder").style.display = "block";
          document.getElementById("banner").src = data.banner_image;
          if(data.cover_image!=null){
          document.getElementById('cover').src = data.cover_image;
          }else{
            document.getElementById('cover').src = data.image;
          }
          document.getElementById('title').innerHTML = data.name_romaji+ " | "+data.name_english;
          document.getElementById('description').innerHTML = data.desc;
          document.getElementById('rating').parentElement.style.display="flex";
          document.getElementById('rating').innerHTML = data.average_score+"/100";
          if(data.type=="anime"){
          ele=document.createElement('div');
          ele.classList.add('info-box');
          ele_temp=document.createElement('h3')
          ele_temp.innerHTML='Season: ';
          ele.appendChild(ele_temp);
          ele_temp=document.createElement('h3')
          ele_temp.innerHTML=data.season;
          ele_temp.setAttribute('id','seasons');
          ele.appendChild(ele_temp);
          document.getElementById('info-container').appendChild(ele);
          console.log(ele);
          }else if(data.type=="manga"){
            ele=document.createElement('div');
            ele.classList.add('info-box');
            ele_temp=document.createElement('h3')
            ele_temp.innerHTML='Volumes: ';
            ele.appendChild(ele_temp);
            ele_temp=document.createElement('h3')
            ele_temp.innerHTML=data.volumes;
            ele_temp.setAttribute('id','volumes');
            ele.appendChild(ele_temp);
            document.getElementById('info-container').appendChild(ele);

            // add chapters
            ele=document.createElement('div');
            ele.classList.add('info-box');
            ele_temp=document.createElement('h3')
            ele_temp.innerHTML='Chapters: ';
            ele.appendChild(ele_temp);
            ele_temp=document.createElement('h3')
            ele_temp.innerHTML=data.chapters;
            ele_temp.setAttribute('id','chapters');
            ele.appendChild(ele_temp);
            document.getElementById('info-container').appendChild(ele);
          }else if(data.type=="character"){
            document.getElementById('title').innerHTML = data.first_name+" "+data.last_name!=null?data.last_name:" "+ " | "+data.native_name;
            document.getElementById('rating').parentElement.style.display="none"; 
          }
              //change source of banner image 
          var element = document.createElement("a");
          element.setAttribute("href", "#holder");
          element.click();

      },
      error: function (jqXHR, textStatus, errorThrown) {
        $(".loading").hide();
          console.log(data)
          alert("failed to get the data ")

      }
  });


  }
});

// detect scroll direction

// $(window).bind('mousewheel', function(event) {
//   if (event.originalEvent.wheelDelta >= 0) {
//       console.log('Scroll up');
//   }
//   else {
//       console.log('Scroll down');
//   }
// });




function hideResult(){
  document.getElementById("holder").style.display = "none";
  $("#info-container > *:gt(0)").remove();
}
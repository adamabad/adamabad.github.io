//https://interactjs.io/docs/draggable/
const position = { x: 0, y: 0 }
var locked = true;


interact('.draggable').draggable({
  listeners: {
    start (event) {
      console.log(event.type, event.target)
    },
    move (event) {
      position.x += event.dx
      position.y += event.dy

      event.target.style.transform =
        `translate(${position.x}px, ${position.y}px)`
    },
  }
})

function toggleVisible(e) {
  var x = document.getElementById(e);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function locktoggle() 
{
  let toggleable = document.querySelectorAll('.draggable-target');

  if(locked) 
  {
    locked = false;
    toggleable.forEach((e) => {
      e.classList.add("draggable");
    });
  }
  else
  {
    locked = true;
    toggleable.forEach((e) => {
      e.classList.remove("draggable");
    });
  }
}
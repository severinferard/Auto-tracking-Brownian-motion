$(document).ready(function() {
  // just querying the DOM...like a boss!
  var links = document.querySelectorAll(".settings-title-icon");

  links[0].setAttribute("data-pos", "0px");
  links[1].setAttribute("data-pos", "-200px");
  links[2].setAttribute("data-pos", "-400px");
  var wrapper = document.querySelector("#sliding-tab-wrapper");
  var visibleContainer = document.querySelector("#contentContainer");
  var iconPointer = document.querySelector("#select-tab-bar-selector");
  var titleDiv = document.querySelector("#setting-title");
  var titleColors = ["#2DD8B6", "#FF5270", "#FFB64D"]
  // the activeLink provides a pointer to the currently displayed item
  var activeLink = 0;
  // setup the event listeners
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    link.addEventListener("click", setClickedItem, false); // identify the item for the activeLink
    link.itemID = i;
  }

  function setPointer(n) {
    var pointerPos =
      links[n].getBoundingClientRect().left -
      visibleContainer.getBoundingClientRect().left;
    iconPointer.style.marginLeft = pointerPos + "px";
  }

  // set first item as active

  setPointer(activeLink);

  function setClickedItem(e) {
    removeActiveLinks();
    var clickedLink = e.target;

    activeLink = clickedLink.itemID;
    changePosition(clickedLink);
    setPointer(activeLink);
    titleDiv.style.backgroundColor = titleColors[activeLink];
  }

  function removeActiveLinks() {
    for (var i = 0; i < links.length; i++) {
      //   links[i].classList.remove("active");
    }
  }

  function changePosition(link) {
    var position = link.getAttribute("data-pos");

    var translateValue = "translate3d(" + position + ", 0px, 0)";
    wrapper.style.transform = translateValue;
    // link.classList.add("active");
  }

function toggleManualSelection(){
document.getElementById("selection-mode-wrapper").style.marginLeft = "0";
document.getElementsByClassName("left-arrow")[0].style.opacity = 0
document.getElementsByClassName("right-arrow")[0].style.opacity = 1
}

function toggleAutoSelection(){
    document.getElementById("selection-mode-wrapper").style.marginLeft = "-100px";
    document.getElementsByClassName("left-arrow")[0].style.opacity = 1
    document.getElementsByClassName("right-arrow")[0].style.opacity = 0
}
    
  document.getElementsByClassName("left-arrow")[0].addEventListener("click", (e) => {
    toggleManualSelection()
  }, false);

  document.getElementsByClassName("right-arrow")[0].addEventListener("click", (e) => {
    toggleAutoSelection()
}, false);
toggleManualSelection()
});

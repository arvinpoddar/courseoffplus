/* 
      DEVELOPED BY ARVIN PODDAR
      
      COMMON LINES EXPLAINED:

      var classes = document.getElementsByClassName("class");
      This is an array of all the classes on the side menu. Each of these classes has a class called "class." Confusing? I know, sorry.

      var classList = document.getElementById("classList");
      This is the wrapper div inside of which all classes are inserted

      var content = document.getElementById("reference").innerHTML;
      This grabs the innerHTML of a hidden div that serves as a template for the classes. See inside index.html
*/

function addBelow() {
  var classes = document.getElementsByClassName("class");
  var classList = document.getElementById("classList");
  var addBelow = document.activeElement.parentElement.parentElement;
  //addBelow is the active element, aka the double clicked class
  var content = document.getElementById("reference").innerHTML;

  var newClass = document.createElement("div");
  newClass.setAttribute("class", "class");
  newClass.innerHTML = content;

  addBelow.parentNode.insertBefore(newClass, addBelow.nextSibling);
  //inserts the new class right under the one that was double clicked
}
function addClass() {
  var classes = document.getElementsByClassName("class");
  var classList = document.getElementById("classList");
  var content = document.getElementById("reference").innerHTML;

  if (document.getElementById("empty")) {
    classList.removeChild(document.getElementById("empty"));
  }
  //since adding a class means that at least one class is present, the error message is deleted if present

  var newClass = document.createElement("div");
  newClass.setAttribute("class", "class");
  newClass.innerHTML = content;

  classList.appendChild(newClass);
  //new class is appended to the bottom of the list
}

function removeClass() {
  var classes = document.getElementsByClassName("class");
  var classList = document.getElementById("classList");
  for (var i = classes.length - 1; i > -1; i--) {
    //loop starts from the end of classes since each deletion is live and changes the length of the array
    var className = classes[i].children[0].children[0].value.trim();
    if (className == null || className == "") {
      //checks if classname is empty, and removes it from the classList if not present
      classes[i].parentNode.removeChild(classes[i]);
    }
  }
  //includes an error message if no classes are present
  if (classes.length == 0) {
    classList.innerHTML =
      "<p id='empty' style='text-align: center;'>You have no classes added.</p>";
  }
}

function saveAll() {
  //saves notes and classes
  removeClass(); //deletes any empty classes first
  var classes = document.getElementsByClassName("class");

  //grabs all current cookies, if any, and deletes them to be overwritten
  var savedClasses = Cookies.getJSON();
  for (var savedClass in savedClasses) {
    Cookies.remove(savedClass);
  }

  if (classes.length > 0) {
    for (var i = 0; i < classes.length; i++) {
      //for each class in the "class" class, the following values are grabbed from the inputs:
      var className = classes[i].children[0].children[0].value.trim();
      //classes[i] is the class div wrapping all the inputs. children[0] is the div wrapping the first input (class name). the second children[0] is the input itself
      var section = classes[i].children[1].children[0].value.trim();
      var crn = classes[i].children[2].children[0].value.trim();
      var status = classes[i].children[3].children[0].value;

      if (status === "-Status-") {
        status = "";
      }

      //a cookie is then set using those grabbed values. because there is lots of parameters, the cookie includes a JSON
      Cookies.set(
        "class" + i, //each cookie is named "class" followed by a number. by assiging a unique name to classes, two classes can share the same class name without cookie name conflicts
        {
          className: className,
          section: section,
          crn: crn,
          status: status
        },
        { expires: 365 } //1 year expiration date for the cookie
      );
    }
  }

  //sets the notes cookie (named "notes123") using value from textarea, only if textarea is not empty
  var notes = document.getElementById("notes").value.trim();
  if (!(notes == null || notes == "")) {
    Cookies.set("notes123", notes, { expires: 365 });
  }
}

function renderList() {
  //Renders list of classes on page load from cookie data.
  var notes = document.getElementById("notes");
  var savedNote = Cookies.get("notes123");
  var savedUrl = Cookies.get("website");

  var content = document.getElementById("reference").innerHTML;
  var classList = document.getElementById("classList");

  //Renders the notes section using data from the notes cookie, but only if cookie is present.
  if (savedNote) {
    notes.innerText = savedNote;
    notes.style.height = notes.scrollHeight; //changes textarea height so all content is present
  }

  var webContainer = document.getElementById("web");
  var website = document.getElementById("embed");
  var settings = document.getElementById("url");
  var builder = "https://gatech.courseoff.com/workspace"; //default value
  if (savedUrl) {
    //checks if website cookie exists. if yes, changes url for embed object
    var builder = savedUrl;
    settings.value = savedUrl;
  }
  var website = document.createElement("object"); //creates embed object containing website url
  website.setAttribute("id", "embed");
  website.setAttribute("class", "embed");
  website.setAttribute("type", "text/html");
  website.data = builder;
  webContainer.appendChild(website); //inserts object into page

  //converts JSON to javascript object
  var savedClasses = Cookies.getJSON();
  //loop goes through each JSON object in the JSON
  for (var savedClass in savedClasses) {
    //Because "notes" is also in the savedClasses JSON, this conditional checks for elements containing class in their name
    if (String(savedClass).indexOf("class") !== -1) {
      var saveName = savedClasses[savedClass].className;
      var saveSection = savedClasses[savedClass].section;
      var saveCrn = savedClasses[savedClass].crn;
      var saveStatus = savedClasses[savedClass].status;
      //renders new class using these values from the cookie
      var newClass = document.createElement("div");
      newClass.setAttribute("class", "class");
      newClass.innerHTML = content;
      //newClass is the class div wrapping all the inputs. children[0] is the div wrapping the first input (class name). the second children[0] is the input itself
      newClass.children[0].children[0].value = saveName;
      newClass.children[1].children[0].value = saveSection;
      newClass.children[2].children[0].value = saveCrn;
      newClass.children[3].children[0].value = saveStatus;
      classList.appendChild(newClass);
    }
  }

  //changes color of select element automatically when page loads.
  var classes = document.getElementsByClassName("class");
  if (classes.length > 0) {
    classList.removeChild(document.getElementById("empty"));
  }
}

function renderColor() {
  //changes color of select element automatically when page loads.
  var classes = document.getElementsByClassName("class");
  if (classes.length > 0) {
    for (var i = 0; i < classes.length; i++) {
      var selection = classes[i].children[3].children[0];
      //newClass is the class div wrapping all the inputs. children[3] is the div wrapping the fourth input (status). the second children[0] is the select itself
      var value = selection.value;
      if (value == "Add") {
        selection.style.backgroundColor = "#60F2D5";
      } else if (value == "Drop") {
        selection.style.backgroundColor = "#F6696E";
      } else if (value == "Still Needed") {
        selection.style.backgroundColor = "#F567D4";
      } else if (value == "Confirmed") {
        selection.style.backgroundColor = "#62F36F";
      } else if (value == "Waitlisted") {
        selection.style.backgroundColor = "#D4F26F";
      } else if (value == "Reference") {
        selection.style.backgroundColor = "#F59D6E";
      }
    }
  }
}

function recolor(obj) {
  //changes color of select element based on new input. uses "this" passed from object during onchange event.
  var value = obj.value;
  if (value == "Add") {
    obj.style.backgroundColor = "#60F2D5";
  } else if (value == "Drop") {
    obj.style.backgroundColor = "#F6696E";
  } else if (value == "Still Needed") {
    obj.style.backgroundColor = "#F567D4";
  } else if (value == "Confirmed") {
    obj.style.backgroundColor = "#62F36F";
  } else if (value == "Waitlisted") {
    obj.style.backgroundColor = "#D4F26F";
  } else if (value == "Reference") {
    obj.style.backgroundColor = "#F59D6E";
  }
}

function urlSave() {
  saveAll(); //saves all changes first
  var url = document.getElementById("url").value.trim(); //gets new URL from textbox
  if (!(url == null || url == "")) {
    Cookies.set("website", url, { expires: 365 }); //creates website cookie
  } else {
    Cookies.remove("website");
  }
}

/*--------------------------------------------------------------DRAG & DROP MAIN FUNCTIONNALITY---------------------------------------------------------------*/


//GOAHEAD function triggered after setting all divs with the images to be dragged
function GOAHEAD() {


  //two arrays of both filled and empty divs
  const fill = document.querySelectorAll('.fill');
  const empties = document.querySelectorAll('.empty');

  //Looping on the filled divs
  for (let i = 0; i < fill.length; i++) {
    const item = fill[i];

    //when te dragstart event starts the "draggedItem" that will be used is that dragged "item" itself
    item.addEventListener('dragstart', function (e) {
      draggedItem = item;

      // setting its initial position or display to none once it's dragged
      setTimeout(function () {
        item.style.display = 'none';
      }, 0)
    })

    //when the dragend event is triggered the item that was dragged returns to its initial position 
    //and it's no longer the draggedItem
    item.addEventListener('dragend', function () {
      setTimeout(function () {
        item.style.display = 'block';
        draggedItem = null;
      }, 0);
    })


    //looping on empties
    for (let j = 0; j < empties.length; j++) {

      const list = empties[j];

      //dragging over an empty div should result in a change on background color indicating the possibility of dropping the item
      list.addEventListener('dragover', function (e) {
        e.preventDefault();
        this.style.background = 'rgba(0, 0, 0, 0.2)';


      });
      list.addEventListener('dragenter', function (e) {
        e.preventDefault();


      });

      //once the dragged item leaves the empty div its background color should go back to normal
      list.addEventListener('dragleave', function (e) {
        e.preventDefault();
        this.style.background = 'whitesmoke';

      });


      list.addEventListener('drop', function (e) {

        //dropping a draged Item on a div that has children should result in returning to initial position
        if (this.hasChildNodes()) {

        }

        //if the div doesn't have children it means no image will override another and it's an empty div 
        else {

          draggedItem.style.margin = '-3px';

          //appending the draggedItem to the empty div
          this.append(draggedItem);

          //disabling the option of shuffling as keeping it has no sens after starting the game
          document.getElementById('shuffle').style = "display:none";


          //if all images are passed successfully to the empty divs then it's time to display the playAgain button
          if (document.getElementById("second").childNodes.length == 13) {
            document.getElementById('playagain').style = "display:block";

          }
        }
      });
    }
  }
}

/*

-----------------------------------------------------------------THE SHUFFLE METHOD ------------------------------------------------------------------
*/



//function that shuffles randomly the pictures
function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  //creates a random index and switches its value with the currentIndex variable in each iteration
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

//onclick function of the shuffle button:
function start() {

  //fetching the array of images
  let test = document.querySelectorAll(".fill");
  var array1 = [];
  for (let i = 0; i < test.length; i++) {
    array1[i] = test[i].style.background;
  }

  //calling the shuffle function:
  shuffle(array1);
  var shuffled_images = shuffle(array1);

  //displaying the shuffled images after calling the shuffle function 
  for (var i = 0; i < document.querySelectorAll('.fill').length; i++) {
    let x = document.querySelectorAll('.fill');
    x[i].style.background = shuffled_images[i];
  }

}

/*

---------------------------------------------------------THE RESIZE & SPLIT (ALSO PLAY YOUR PUZZLE)-------------------------------------------------------------------

*/

//onchange function triggered after uploading a picture:
function resize() {

  //preventing the "shuffle me!", "play our puzzle!" and "play your puzzle!" buttons from displaying:
  document.getElementById("shuffle").style = "visibility:visible";
  document.getElementById('yourP').style = "display: none";
  document.getElementById('ourP').style = "display: none";

  //displaying the "reveal" button:
  document.getElementById("test").style = "visibility:visible";


  //defining the resize width 
  var resize_width = 450;
  var resize_height = 300;

  //getting the image selected
  var item = document.querySelector('#uploader').files[0];

  //creating a FileReader
  var reader = new FileReader();

  //image turned to base64-encoded Data URI
  reader.readAsDataURL(item);

  //getting the image's size
  reader.size = item.size;


  reader.onload = function (event) {

    //create a image
    var img = new Image();

    //result is base64-encoded Data URI
    img.src = event.target.result;


    img.onload = function (el) {

      //create a canvas element
      var elem = document.createElement('canvas');

      //assigning the end result dimensions to the canvas element
      elem.width = resize_width;
      elem.height = resize_height;

      //drawing in canvas
      var ctx = elem.getContext('2d');
      ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

      //get the base64-encoded Data URI of the resized image (drawn canvas)
      var srcEncoded = ctx.canvas.toDataURL(el.target, 'image/jpeg', 0);

      //assign it to the image element in html
      document.querySelector('#image').src = srcEncoded;

    }
  }
}

//once the image is resized and loaded in the html element, it triggers an onload function which is CUT
function CUT(e) {

  let test = document.querySelectorAll(".fill");

  //creating a canvas:
  var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    parts = [],

    //create a image
    img = new Image();

  //getting the loaded img source and assigning it to ours (still base64 encoded)
  img.src = e.src;

  //calling split_6 function once the img is loaded
  img.onload = split_6;


  function split_6() {

    //splitting width and heights according to our divs positionning
    var w2 = img.width / 3,
      h2 = img.height / 2;

    for (var i = 0; i < 6; i++) {

      //calculating the positionning of the splitted images
      var x = (-w2 * i) % (w2 * 3),
        y = (h2 * i) <= 2 * h2 ? 0 : -h2;


      canvas.width = w2;
      canvas.height = h2;

      //drawing images in canvas accordingly:
      ctx.drawImage(this, x, y, w2 * 3, h2 * 2);
      parts.push(canvas.toDataURL());

      //Replacing our html filled divs with other elements that have the array canvas as a background
      let element = document.createElement("div");
      element.setAttribute("style", `background: url('${parts[i]}')`);
      element.draggable = "true";
      element.className = "fill";
      test[i].replaceWith(element);
    }

    //Calling the start function to display shuffled images
    start();

    //Calling the GOAHEAD function to enable the drag and drop functionnality
    GOAHEAD();

    //hiding the reveal button
    document.getElementById('test').style = "Visibility: visible";
  }
}




//onclick function on the test button
function reveal() {

  //displays image if not displayed:
  if (document.querySelector('#image').style.display == "none") {
    document.querySelector('#image').style = "display: block";
    document.getElementById('test').innerHTML = `<label style="cursor: pointer;">Hide Image</label>`;
  }
  //hides image if displayed:
  else {
    document.querySelector('#image').style = "display: none";
    document.getElementById('test').innerHTML = `<label style="cursor: pointer;">Reveal Image</label>`;
  }

}

/*

--------------------------------------------------------PLAYING OUR PUZZLE-------------------------------------------------------------------

*/


//onclick function on the "Play Our Puzzle" button:
function PuzzleOurs() {

  let test = document.querySelectorAll('.fill');
  try {
    for (let i = 0; test.length; i++) {

      //filling the background of divs with local pics in the img folder 
      test[i].setAttribute("style", `background: url('./img/game-0${i+1}.png')`);

    }
  } catch {}


  //hiding the "play our puzzle!" and "play your puzzle!" buttons 
  document.getElementById('yourP').style = "display: none";
  document.getElementById('ourP').style = "display: none";

  //displaying the "shuffle Me!" and "reveal image" buttons and filling the html img element
  document.getElementById("test").style = "visibility:visible";
  document.getElementById("shuffle").style = "visibility:visible";
  document.querySelector('#image').src = "./img/game-full.png";

  //Calling the start function to display shuffled images
  start();
  //Calling the GOAHEAD function to enable the drag and drop functionnality
  GOAHEAD();
}

/*

---------------------------------------------------------PLAY AGAIN------------------------------------------------------------------

*/
//onclick function of the "Play again?" button
function PlayAgain() {

  //reloading the page
  window.location.reload();

}
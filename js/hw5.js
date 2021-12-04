/*
    File: hw5.js
    GUI Assigment: Implementing a Bit of Scrabble with Drag-and-Drop
    Minh Le, Umass Lowell Computer Science, minhtri_le@student.uml.edu
    Copyright (C) 2021 by Minh Le. 
    Updated by ML on December 3, 2021 at 9:00pm
*/
$(document).ready(function () {
  // Data structure stores letters
  var ScrabbleTiles = [];
  ScrabbleTiles["A"] = { "value": 1, "distribution": 9, "remaining": 9 };
  ScrabbleTiles["B"] = { "value": 3, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["C"] = { "value": 3, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["D"] = { "value": 2, "distribution": 4, "remaining": 4 };
  ScrabbleTiles["E"] = { "value": 1, "distribution": 12, "remaining": 12 };
  ScrabbleTiles["F"] = { "value": 4, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["G"] = { "value": 2, "distribution": 3, "remaining": 3 };
  ScrabbleTiles["H"] = { "value": 4, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["I"] = { "value": 1, "distribution": 9, "remaining": 9 };
  ScrabbleTiles["J"] = { "value": 8, "distribution": 1, "remaining": 1 };
  ScrabbleTiles["K"] = { "value": 5, "distribution": 1, "remaining": 1 };
  ScrabbleTiles["L"] = { "value": 1, "distribution": 4, "remaining": 4 };
  ScrabbleTiles["M"] = { "value": 3, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["N"] = { "value": 1, "distribution": 6, "remaining": 6 };
  ScrabbleTiles["O"] = { "value": 1, "distribution": 8, "remaining": 8 };
  ScrabbleTiles["P"] = { "value": 3, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["Q"] = { "value": 10, "distribution": 1, "remaining": 1 };
  ScrabbleTiles["R"] = { "value": 1, "distribution": 6, "remaining": 6 };
  ScrabbleTiles["S"] = { "value": 1, "distribution": 4, "remaining": 4 };
  ScrabbleTiles["T"] = { "value": 1, "distribution": 6, "remaining": 6 };
  ScrabbleTiles["U"] = { "value": 1, "distribution": 4, "remaining": 4 };
  ScrabbleTiles["V"] = { "value": 4, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["W"] = { "value": 4, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["X"] = { "value": 8, "distribution": 1, "remaining": 1 };
  ScrabbleTiles["Y"] = { "value": 4, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["Z"] = { "value": 10, "distribution": 1, "remaining": 1 };
  ScrabbleTiles["_"] = { "value": 0, "distribution": 2, "remaining": 2 };

  // Store sample space
  sampleSpaceLetters = [];

  var i, j;
  var distribution;
  for (i = 0; i < Object.keys(ScrabbleTiles).length; i++) {
    distribution = ScrabbleTiles[Object.keys(ScrabbleTiles)[i]].distribution;
    for (j = 0; j < distribution; j++) {
      sampleSpaceLetters.push(Object.keys(ScrabbleTiles)[i]);
    }
  }

  // Store the result words
  var myString = new Array(15).fill('*');;

  // The dictionary lookup object
  var dict = {};

  var chosenLetter;
  var coef = 100; // coefficient random
  var totalScore = 0;
  var isValidWord = false;

  // Set dictionary to dict (data get from the file dict.txt)
  // Reference from : https://johnresig.com/blog/dictionary-lookups-in-javascript/
  $.get("dict/dict.txt", function (file) {
    // Get words
    var words = file.split("\n");
    //console.log(words);

    // Create an boolean array to store words
    // Set all words to true, then use it to check whether the word in dictionary 
    for (i = 0; i < words.length; i++) {
      dict[words[i]] = true;
    }

    //console.log(dict);
  });

  // Create Board
  $("#board").append("<table id='tableBoard'></table>");
  $("#tableBoard").append("<tr></tr>");
  for (i = 0; i < 15; i++) {
    if (i == 2 || i == 12) {
      $("#board tr").append("<td data-index='" + i + "' data-price='word-2' data-status='off'></td>");
    } else if (i == 6 || i == 8) {
      $("#board tr").append("<td data-index='" + i + "' data-price='letter-2' data-status='off'></td>");
    } else {
      $("#board tr").append("<td data-index='" + i + "' data-status='off'></td>");
    }
  }

  // Create holder
  $("#holder").append("<table id='tableHolder'></table>");

  $("#tableHolder").append("<tr></tr>");
  for (i = 0; i < 7; i++) {
    var randomLetter = Math.floor(Math.random() * coef);
    var nameLetter = sampleSpaceLetters[randomLetter];


    if (nameLetter != null) {
      ScrabbleTiles[nameLetter].remaining--;
      coef--;
      var index = sampleSpaceLetters.indexOf(nameLetter);
      sampleSpaceLetters.splice(index, 1);
    }

    if (nameLetter != "_") {
      $("#tableHolder tr").append(
        "<td data-status='on'><img data-name='" + nameLetter +
        "' src='./images/Scrabble_Tile_" + nameLetter + ".jpg'" + "data-index-holder=" + i + "></td>");
      $("#tableHolder td").eq(i).droppable({
        accept: "img[data-index-holder='" + i + "']"
      });
    } else {
      nameLetter = "Blank";
      $("#tableHolder tr").append(
        "<td data-status='on'><img data-name='" + nameLetter
        + "' src='./images/Scrabble_Tile_" + nameLetter + ".jpg'" + "data-index-holder=" + i + "></td>");
      $("#tableHolder td").eq(i).droppable({
        accept: "img[data-index-holder='" + i + "']"
      });
    }
  }

  /*###############################
    #   BUTTON HERE
    ###############################
  */
  // Button next word
  $("#btnNextWord").click(function () {
    // Calculate total score
    // Get score
    var containScore = $("#score").text();
    containScore = containScore.split(" ");
    var my_score = parseInt(containScore[1]);

    totalScore += my_score;

    if ($("#tableHolder td[data-status='off']").length > 0) { // if there is a word on the board
      if (isValidWord) { // if the word is valid
        printErrorMessages(""); // clear error message

        // Call back tiles to the rack
        $("img[data-status='on']").css({
          position: "relative",
          top: 0,
          left: 0
        });

        // Display word, score, and total score
        $("#myString").text("Word:");
        $("#score").text("Score: 0");
        $("#totalScore").text("Total Score: " + totalScore);

        // Display saved words
        var my_word = displayString();
        $("#save").append("<p>Word: " + my_word + " ---- Score: " + score(my_word) + "</p>");

        // Reset attribute on tiles
        $("#tableBoard td").attr("data-status", "off");
        $("img").removeAttr("data-index");
        $("#tableBoard td").droppable('option', 'accept', "img");
        myString.fill("*");

        // Create new tiles (only change the tiles that were on the board and saved)
        for (i = 0; i < 7; i++) {
          // status = 'off' that means the tiles on the board
          // status = 'on' that means the tiles on the rack
          if ($("#tableHolder td").eq(i).attr("data-status") == "off") { // allow only tiles that on the board
            //console.log($("#tableHolder td").eq(i).attr("data-status"))
            // Get letter name 
            var randomLetter = Math.floor(Math.random() * coef);
            var nameLetter = sampleSpaceLetters[randomLetter];

            if (nameLetter != null) {
              ScrabbleTiles[nameLetter].remaining--;
              coef--;
              var index = sampleSpaceLetters.indexOf(nameLetter);

              // remove letter from sample space
              if (sampleSpaceLetters.length > 0) {
                sampleSpaceLetters.splice(index, 1);
                updateRemainTable();
              }

              // Create new tiles
              if (nameLetter != "_") {
                $("#tableHolder img").eq(i).attr("data-name", nameLetter);
                $("#tableHolder img").eq(i).attr("src", "./images/Scrabble_Tile_" + nameLetter + ".jpg");
                $("#tableHolder img").eq(i).removeAttr("data-status");
                $("#tableHolder img").eq(i).removeAttr("data-index");
                $("#tableHolder img").eq(i).removeAttr("data-previous-letter");
              } else {
                nameLetter = "Blank";
                $("#tableHolder img").eq(i).attr("data-name", nameLetter);
                $("#tableHolder img").eq(i).attr("src", "./images/Scrabble_Tile_" + nameLetter + ".jpg");
                $("#tableHolder img").eq(i).removeAttr("data-status");
                $("#tableHolder img").eq(i).removeAttr("data-index");
                $("#tableHolder img").eq(i).removeAttr("data-previous-letter");
              }
            } else {
              printErrorMessages("There is no more letter.");
            }
            $("#tableHolder td").eq(i).attr("data-status", "on");
          }
        }
        isValidWord = false;
      } else {
        printErrorMessages("Word is not valid.");
      }
    } else {
      printErrorMessages("No words on the board.");
    }
  });

  // Button start over the game
  $("#btnStartOver").click(function () {

    // Call back tiles to the rack
    $("img[data-status='on']").css({
      position: "relative",
      top: 0,
      left: 0
    });

    // Reset and clear
    $("#tableBoard td").droppable('option', 'accept', "img");
    $("#tableBoard td").attr("data-status", "off");
    $("img").removeAttr("data-index");
    myString.fill("*");
    totalScore = 0;

    $("#myString").text("Word: " + displayString());
    $("#score").text("Score: 0");
    $("#error-message p").text("");

    $("#totalScore").text("Total Score: 0");
    $("#save p").text("");

    //console.log("Before remove: " + sampleSpaceLetters);
    // Reset sample space
    var indexOfLetter = 0;
    for (i = 0; i < Object.keys(ScrabbleTiles).length; i++) {
      distribution = ScrabbleTiles[Object.keys(ScrabbleTiles)[i]].distribution;
      ScrabbleTiles[Object.keys(ScrabbleTiles)[i]].remaining = ScrabbleTiles[Object.keys(ScrabbleTiles)[i]].distribution;
      for (j = 0; j < distribution; j++) {
        sampleSpaceLetters[indexOfLetter] = Object.keys(ScrabbleTiles)[i];
        indexOfLetter++;
      }
    }

    coef = 100;

    //console.log(sampleSpaceLetters);
    // Create new 7 tiles on the rack
    for (i = 0; i < 7; i++) {
      var randomLetter = Math.floor(Math.random() * coef);
      var nameLetter = sampleSpaceLetters[randomLetter];
      //console.log(nameLetter);

      if (nameLetter != null) {
        ScrabbleTiles[nameLetter].remaining--;
        coef--;
        var index = sampleSpaceLetters.indexOf(nameLetter);
        if (sampleSpaceLetters.length > 0) {
          sampleSpaceLetters.splice(index, 1);
        }
        updateRemainTable();
        if (nameLetter != "_") {
          $("#tableHolder img").eq(i).attr("data-name", nameLetter);
          $("#tableHolder img").eq(i).attr("src", "./images/Scrabble_Tile_" + nameLetter + ".jpg");
          $("#tableHolder img").eq(i).removeAttr("data-status");
        } else {
          nameLetter = "Blank";
          $("#tableHolder img").eq(i).attr("data-name", nameLetter);
          $("#tableHolder img").eq(i).attr("src", "./images/Scrabble_Tile_" + nameLetter + ".jpg");
          $("#tableHolder img").eq(i).removeAttr("data-status");
        }
      } else {
        printErrorMessages("There is no more letter.");
      }
    }
    //console.log("After remove: " + sampleSpaceLetters);

  });

  // Call back tiles on the board back to the rack
  $("#btnReset").click(function () {
    $("img[data-status='on']").css({
      position: "relative",
      top: 0,
      left: 0
    });

    for (i = 0; i < $("img[data-status='on']").length; i++) {
      //console.log($("img[data-status='on']").eq(i).attr("data-index"))
      $("#tableBoard td[data-index='" + $("img[data-status='on']").eq(i).attr("data-index") + "']")
        .attr("data-status", "off");
    }

    printErrorMessages("");
    $("#tableHolder td[data-status='off']").attr("data-status", 'on');
    $("#tableBoard td").droppable('option', 'accept', "img");
    $("#myString").text("Word:");
    myString.fill("*");
    $("#myString").text("Word: " + displayString());
    $("#score").text("Score: 0");

    $("img").removeAttr("data-status");
    $("img").removeAttr("data-index");
    $("#tableHolder img[data-previous-letter='_']").attr("src", "./images/Scrabble_Tile_Blank.jpg");
    $("#tableHolder img[data-previous-letter='_']").attr("data-name", "Blank");
  });

  $("#btnNewTiles").click(function () {
    printErrorMessages("");
    // Create new tiles (only change the tiles that were on the board and saved)
    for (i = 0; i < 7; i++) {
      // status = 'off' that means the tiles on the board
      // status = 'on' that means the tiles on the rack
      if ($("#tableHolder td").eq(i).attr("data-status") == "on") { // allow only tiles that on the rank
        //console.log($("#tableHolder td").eq(i).attr("data-status"))
        // Get letter name 
        var randomLetter = Math.floor(Math.random() * coef);
        var nameLetter = sampleSpaceLetters[randomLetter];

        if (nameLetter != null) {
          if ($("#tableHolder img").eq(i).attr("data-name") != "Blank") {
            ScrabbleTiles[nameLetter].remaining--;
            ScrabbleTiles[$("#tableHolder img").eq(i).attr("data-name")].remaining++;

            var index = sampleSpaceLetters.indexOf(nameLetter);

            // remove letter from sample space
            if (sampleSpaceLetters.length > 0) {
              sampleSpaceLetters.splice(index, 1);
              sampleSpaceLetters.splice(index, 0, $("#tableHolder img").eq(i).attr("data-name"));
              updateRemainTable();
            }

            // Create new tiles
            if (nameLetter != "_") {
              $("#tableHolder img").eq(i).attr("data-name", nameLetter);
              $("#tableHolder img").eq(i).attr("src", "./images/Scrabble_Tile_" + nameLetter + ".jpg");
              $("#tableHolder img").eq(i).removeAttr("data-status");
              $("#tableHolder img").eq(i).removeAttr("data-index");
              $("#tableHolder img").eq(i).removeAttr("data-previous-letter");
            } else {
              nameLetter = "Blank";
              $("#tableHolder img").eq(i).attr("data-name", nameLetter);
              $("#tableHolder img").eq(i).attr("src", "./images/Scrabble_Tile_" + nameLetter + ".jpg");
              $("#tableHolder img").eq(i).removeAttr("data-status");
              $("#tableHolder img").eq(i).removeAttr("data-index");
              $("#tableHolder img").eq(i).removeAttr("data-previous-letter");
            }
          }
        } else {
          printErrorMessages("There is no more letter.");
        }
        $("#tableHolder td").eq(i).attr("data-status", "on");
      }
    }
  });

  // Create remaining table
  $("#left-display").append("<table id='tableRemain'></table>");
  j = 0;
  for (i = 1; i <= 5; i++) {
    $("#tableRemain").append("<tr></tr>");
    while (j < 6 * i) {
      if (Object.keys(ScrabbleTiles)[j] != null) {
        $("#tableRemain tr").eq((i - 1)).append("<td>" +
          Object.keys(ScrabbleTiles)[j] + ": " +
          ScrabbleTiles[Object.keys(ScrabbleTiles)[j]].remaining + "</td>");
      }
      j++;
    }
  }

  // Create choose table letter when play has blank
  $("#dialog-message").append("<ul id='selectables'></ul>");
  for (i = 0; i < Object.keys(ScrabbleTiles).length - 1; i++) {
    $("#dialog-message ul").append("<li data-name='" +
      Object.keys(ScrabbleTiles)[i] + "'><img src='./images/Scrabble_Tile_" +
      Object.keys(ScrabbleTiles)[i] + ".jpg'></li>");
  }

  // Ask players about which letter is chosen when they pick the space tile
  $("#dialog-message").dialog({
    dialogClass: "no-close",
    autoOpen: false,
    modal: true,
    width: "500",
    buttons: {
      Ok: function () {
        if (chosenLetter != null) { // If a tile is chosen
          //console.log(chosenLetter)
          $("img[data-status='on'][data-name='Blank']").attr("data-name", chosenLetter);
          myString[$("img[data-status='on'][data-name='" + chosenLetter + "']").attr("data-index")] = chosenLetter;
          //console.log("update string: " + myString);
          var my_word = displayString();
          $("#myString").text("Word: " + my_word);
          // Display Score
          $("#score").text("Score: " + score(my_word));
          chosenLetter = null;
          $("li[class='ui-selectee ui-selected']").css("background-color", "black");
          $(this).dialog("close");
        } else { // not display error
          if ($("#dialog-message p").length) {
            $("#dialog-message p").remove();
          }
          $("#dialog-message").append("<p>Please choose one letter.</p>")
          $("#dialog-message p").css("color", "red");
        }

      }
    }
  });

  // selectable for dialog
  $("#selectables").selectable({
    selected: function (event, ui) {
      chosenLetter = $(ui.selected).attr("data-name");
      //console.log(chosenLetter)
      if (chosenLetter != null) { // If a tile is chosen
        if ($("#dialog-message p").length) {
          $("#dialog-message p").remove();
        }
        // Change the image of the tile depend on which tile players chose
        $("img[data-status='on'][data-name='Blank']").attr("data-previous-letter", "_");
        $("img[data-status='on'][data-name='Blank']").attr("src", "./images/Scrabble_Tile_" + chosenLetter + ".jpg")
        $(ui.selected).css("background-color", "red");
      } else {
        $("img[data-status='on'][data-name='Blank']").attr("src", "./images/Scrabble_Tile_Blank.jpg")
        $("li[class='ui-selectee ui-selected']").css("background-color", "black");
      }
    },
    unselected: function (event, ui) {
      $(ui.unselected).css("background-color", "black");
      chosenLetter = null;
    }
  });

  // Draggable for tiles on the rack
  $("#tableHolder td img").draggable({
    containment: "document",
    drag: function (event, ui) {
      $(this).draggable("option", "revert", "invalid");
      $("#tableHolder td").eq($(this).attr("data-index-holder")).css("box-shadow", "0px 0px 7px 8px blue");;
    },
    stop: function (event, ui) {
      $("#tableHolder td").eq($(this).attr("data-index-holder")).css("box-shadow", "");;
    }
  });

  // Board Droppable
  $("#tableBoard td").droppable({
    drop: function (event, ui) {
      $(this).css("box-shadow", "");
      //console.log("accept items from holder");
      //console.log(myString);

      // set holder off
      $("#tableHolder td").eq(ui.draggable.attr("data-index-holder")).attr("data-status", "off");
      var letterResult = ui.draggable.attr("data-name"); // get letter

      if (letterResult == "Blank") {
        $("#dialog-message").dialog("open");
      }

      // Get index of the letter (where it is)
      var index = $(this).attr("data-index");
      myString[index] = letterResult;

      // delete old position of letter
      if (ui.draggable.attr("data-index") != null) {
        myString[ui.draggable.attr("data-index")] = "*";
      }

      //console.log(myString);
      //console.log($(this).attr("data-index"));
      //console.log(ui.draggable.attr("data-index"));
      // Check if the first tile place at icon star or not
      // Check if there is a space between 2 letters
      if ($(this).attr("data-index") != ui.draggable.attr("data-index")
        && $("#tableBoard td[data-status='on']").length > 0
        && ui.draggable.attr("data-index") != null) {
        // Here means error, once the tile is placed, it cannot be moved
        printErrorMessages("Once the tile is placed on the Scrabble board, it can not be moved. Take it back to the rack to move it.");
        ui.draggable.draggable("option", "revert", true);
        myString[index] = "*";
        myString[ui.draggable.attr("data-index")] = ui.draggable.attr("data-name");
        //console.log(myString);
      } else {
        if (isAdjacent()) {
          // Here is valid move
          printErrorMessages("");
          // accept specific draggable item
          // Set position fit to the drop
          // https://forum.jquery.com/topic/drag-and-drop-issue-fit-my-drop
          var offset = $(this).offset();
          ui.draggable.css({
            position: 'absolute',
            top: offset.top,
            left: offset.left
          });

          // Setup data for img
          ui.draggable.attr("data-index", index);
          ui.draggable.attr("data-status", "on");

          // Update and display string
          myString[index] = ui.draggable.attr("data-name");
          
          //console.log(myString);
          // Display string result
          var my_word = displayString();
          $("#myString").text("Word: " + my_word);

          // Display Score
          $("#score").text("Score: " + score(my_word));

          // Does not accept two letters on the same square
          $(this).droppable('option', 'accept', ui.draggable);
          $(this).attr("data-status", "on");
          $("#tableBoard td[data-status='off']").droppable('option', 'accept', "img");
        } else {
          // Unvalid move: there is space between 2 letters
          ui.draggable.draggable("option", "revert", true); // set the tile back to the eack
          $("#tableBoard td[data-status='off']").droppable('option', 'accept', "img"); // allow only one img at one <td>

          // Delete and set back value to myString
          //var index = $(this).attr("data-index");
          myString[index] = "*";

          //console.log(myString);
          printErrorMessages("Do not allow space between two letters.");
          //console.log("After remove:");
          //console.log(myString);
        }
      }
    },

    // Out of board
    out: function (event, ui) {
      //console.log("out from board");    
      $(this).css("box-shadow", "");
    },

    over: function (event, ui) {
      $(this).css("box-shadow", "0px 0px 7px 8px red");
    }
  });


  // Holder droppable (the rack)
  $("#tableHolder td").droppable({
    drop: function (event, ui) {
      //console.log("accept items from board");
      printErrorMessages("");
      myString[ui.draggable.attr("data-index")] = "*";
      if (isAdjacent()) { // do not allow space between 2 letters
        $(this).css("box-shadow", "");

        $(this).attr("data-status", "on");

        var previousLetter = ui.draggable.attr("data-previous-letter");
        if (previousLetter != null) {
          ui.draggable.attr("src", "./images/Scrabble_Tile_Blank.jpg");
          ui.draggable.attr("data-name", "Blank");
        }

        // Set position fit to the drop
        ui.draggable.css({
          position: 'relative',
          top: 0,
          left: 0
        });
        $("#tableBoard td[data-index='" + ui.draggable.attr("data-index") + "']").attr("data-status", "off");
        ui.draggable.removeAttr("data-status");
        ui.draggable.removeAttr("data-index");
        ui.draggable.removeAttr("data-previous-letter");
        var my_word = displayString();
        $("#myString").text("Word: " + my_word);
        $("#score").text("Score: " + score(my_word));

        $("#tableBoard td[data-status='off']").droppable('option', 'accept', "img");
      } else {
        ui.draggable.draggable("option", "revert", true);
        myString[ui.draggable.attr("data-index")] = ui.draggable.attr("data-name");
        printErrorMessages("Do not allow space between two letters.");
      }

    },

    out: function (event, ui) {
      //console.log("out from holder");
      $(this).css("box-shadow", "");
    },

    over: function (event, ui) {
      $(this).css("box-shadow", "0px 0px 7px 8px blue");
    }

  });

  /*##################################################
    #   FUNCTIONS LOCATED HERE
    ##################################################
  */
  // Check if there must be two blocks are adjacent
  function isAdjacent() {
    // Check error (no allow space between letters)
    var firstLetter = false;

    for (var i = 0; i < myString.length - 1; i++) {
      if (!firstLetter) {
        if (myString[i] != "*") {
          firstLetter = true;
        }
      } else {
        if (myString[i] == "*" && myString[i + 1] != "*") {
          return false;
        }
      }
    }
    //console.log(myString);
    //console.log(isAdjacent);
    return true;
  }

  // print error messages
  function printErrorMessages(msg) {
    $("#error-message p").text(msg);
    $("#error-message p").css("color", "red");
  }

  // update remaining table 
  function updateRemainTable() {
    var i;
    for (i = 0; i < $("#tableRemain td").length; i++) {
      var letter = Object.keys(ScrabbleTiles)[i];
      $("#tableRemain td").eq(i).text(letter + ": " + ScrabbleTiles[letter].remaining);
    }
  }

  // return a string that contants the result word
  function displayString() {
    var str = "";
    var firstLetterIndex;
    var lastLetterIndex;
    var i;
    for (i = 0; i < myString.length; i++) {
      if (myString[i] != "*") {
        firstLetterIndex = i;
        break;
      }
    }

    for (i = myString.length - 1; i >= 0; i--) {
      if (myString[i] != "*") {
        lastLetterIndex = i;
        break;
      }
    }

    //console.log("first: " + firstLetterIndex);
    //console.log("last: " + lastLetterIndex);

    for (i = firstLetterIndex; i <= lastLetterIndex; i++) {
      if (myString[i] == "Blank") {
        str += "_";
      } else {
        str += myString[i];
      }
    }

    return str;
  }

  // Return the result score
  function score(my_word) {
    var score = 0;
    var status = $("img[data-status='on']");
    var condition;
    var wordPrice = [];
    var price;

    if (findWord(my_word)) {
      isValidWord = true;
      for (i = 0; i < status.length; i++) {
        var index = status.eq(i).attr("data-name");
        if (index == "Blank") {
          index = "_";
        }

        var v = ScrabbleTiles[index].value;

        var dataFromTd = $("#tableBoard td[data-index='" + status.eq(i).attr("data-index") + "']").attr("data-price");
        //console.log(v);
        // data-price contains x2 or x3 and word or letter
        if (dataFromTd != null) {
          dataFromTd = dataFromTd.split("-");
          condition = dataFromTd[0];
          price = parseInt(dataFromTd[1]);
          if (condition == "letter") { // if letter
            score += v * price; // multiply the value to x2 or x3
          } else {
            wordPrice.push(price); // save word for after finding a valid word
            score += v; // increase score by v
          }
        } else { // no x2 or x3
          score += v; // increase score by v
        }
      }
      //console.log(totalScore);
      //console.log(wordPrice);
      // Calculate the word price (x2 or x3 a word)
      if (wordPrice.length > 0) {
        for (i = 0; i < wordPrice.length; i++) {
          score = score * parseInt(wordPrice[i]);
        }
      }
      return score;
    } else {
      return 0; // error return 0
    }
  }

  // Find the word in the dictionary
  // Reference from : https://johnresig.com/blog/dictionary-lookups-in-javascript/
  function findWord(word) {
    //console.log("word search: " + word);
    // If the word on the dictionary
    if (word.length > 1) {
      if (dict[word]) { // if found the word, return true
        return true;
      }
    }

    // if go here that means not found the word
    // if not, return false
    return false;
  }
});
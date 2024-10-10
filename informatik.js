"use strict";

let TASKS_ARR = [];
let DATA_ID;

function generateTaskArray(path, callback)
{
  TASKS_ARR.length = 0;
  fetch(path)
    .then(response => response.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(data => {
      const tasks = data.querySelectorAll('Task');
      tasks.forEach(task => {
        let question = task.querySelector('question').textContent;
        let answer = task.querySelector('answer').textContent;

        question = question.replace(/\\n/g, '<br>');
        answer = answer.replace(/\\n/g, '<br>');
        question = question.replace(/"/g, '').trim();
        answer = answer.replace(/"/g, '').trim();
        
        // Füge die Frage und Antwort dem Array hinzu
        TASKS_ARR.push({
          question: question,
          answer: answer,
        });
      });
    console.log(TASKS_ARR);
    if(callback) callback(); // Rufe die Callback-Funktion auf, wenn fertig
    })
    .catch(error => console.error('Error loading XML:', error)); 
}

let RandomIPv4TaskCount = [];
function generateRandomIPv4Task() {
  writeTask(RandomIPv4TaskCount);
}

let RandomElectricTaskCount = [];
function generateRandomElectricTask() {
  writeTask(RandomElectricTaskCount);
}

let RandomExpressionCount = [];
function generateRandomExpression() {
  writeTask(RandomExpressionCount);
}

let RandomISoOsiCount = [];
function generateRandomISoOsi() {
  writeTask(RandomISoOsiCount);
}

let RandomDatenbankCount = [];
function generateRandomDatenbank() {
  writeTask(RandomDatenbankCount);
}

let RandomProgrammierspracheCount = [];
function generateRandomProgrammiersprache() {
  writeTask(RandomProgrammierspracheCount);
}

let RandomSoftwareCount = [];
function generateRandomSoftware() {
  writeTask(RandomSoftwareCount);
}

let RandomByteUmrechnungCount = [];
function generateRandomByteUmrechnung() {
  writeTask(RandomByteUmrechnungCount);
}

let RandomSqlEasyCount = [];
const tableEasy = `<div class="responsive-table">
                          <table>
                            <tr>
                              <td colspan="5">Bestellungen</td>
                            </tr>
                            <tr>
                              <th>Id</th>
                              <th>Name</th>
                              <th>ProduktId</th>
                              <th>Datum</th>
                              <th>Betrag</th>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Max Mustermann</td>
                              <td>001</td>
                              <td>2002.08.23</td>
                              <td>150</td>
                            </tr>
                          </table>
                        </div>`;
function generateRandomSqlEasy() {
  writeTask(RandomSqlEasyCount, tableEasy);
}
//middle Zeige den durchschnittlichen Betrag pro Produkt, aber nur für Produkte, von denen mehr als 3 Einträge existieren.
//SELECT ProduktId, AVG(Betrag) AS DurchschnittsBetrag FROM Bestellungen GROUP BY ProduktId HAVING COUNT(ProduktId) > 3;
//Wähle alle Namen von Einträgen, deren Betrag höher als der DurchschnittsBetrag ist.
//SELECT Name FROM Bestellungen WHERE Betrag > (SELECT AVG(Betrag) FROM Bestellungen);
//Wähle alle Einträge, deren ProduktId in einer vorgegebenen Liste liegt (z.B. 1, 2, 3).
//SELECT * FROM Bestellungen WHERE ProduktId IN (1, 2, 3);
//Berechne die durchschnittliche Anzahl von Bestellungen pro Tag.
//SELECT AVG(AnzahlBestellungen) AS DurchschnittBestellungenProTagFROM(SELECT COUNT(*) AS AnzahlBestellungen FROM Bestellungen GROUP BY Datum) AS BestellungenProTag;

function writeTask(countArr, addition = false) {
  if (TASKS_ARR.length == countArr.length) {
    document.getElementById("task").innerText = "Alle Fragen beantwortet.";
    countArr.length = 0;
  } else {
    let idx;
    do {
      idx = Math.floor((crypto.getRandomValues(new Uint8Array(1))[0] / Math.pow(2, 8)) * TASKS_ARR.length); // import `crypto` by `const crypto = require('crypto')`
    } while (countArr.includes(idx));
    countArr.push(idx);
    const randomTask = TASKS_ARR[idx];

    document.getElementById("correct-solution").innerHTML = "";
    if (addition != false) {
      document.getElementById("task").innerHTML = randomTask.question + addition;
    }else{
      document.getElementById("task").innerHTML = randomTask.question;
    }
    document.getElementById("workingarea").value = "";
    document.getElementById("correct-solution").style.display = "none";
    document.getElementById("correct-solution").innerHTML = randomTask.answer;
  }
}

let countProg = 0;
function checkSolution() {
  let solution = document.getElementById("correct-solution");
  let solutionText = solution.innerHTML;
  let workingAreaText = document.getElementById("workingarea").value;

  if (DATA_ID == "sqlEasy") {
    if (workingAreaText == "SELECT Matrix") {
      createMatrixAnimation();
    }
    solutionText = compareStringsAndHighlight(solution.innerText, workingAreaText);
  }
  if (DATA_ID == "programmiersprachen" && workingAreaText == "") {
    countProg++;
    document.getElementById("programmiersprachen").addEventListener("click", () => {
      countProg = 0;
    });
    if (countProg == 5) {
      document.getElementById("category").innerText = "if (clicked) { chooseCategory(); }";
      document.getElementById("programmiersprachen").innerText = "if (clicked) { generateTask(); }";
      document.getElementById("heading").innerText = "function loadSchoolExercises()";
      document.getElementById("result").innerText = "console.log('result')";
      document.getElementById("labelWorkingarea").innerText = "const workingArea = 'Arbeitsfeld'";
      document.getElementById("checkSolution").innerText = "onclick = checkSolution()";
    }
  }
  solution.innerHTML = solutionText;
  solution.style.display = "block";
}

function showTask() {
  let modal = document.getElementById("modal1");
  modal.style.display = "flex";
}

let actualButton;
function ChooseTask(e) {
  let modal = document.getElementById("modal1");
  if (actualButton) {
    actualButton.style.display = "none";
  }
  modal.style.display = "none";
  DATA_ID = e.getAttribute("data-id");
  actualButton = document.getElementById(DATA_ID);
  actualButton.style.display = "block";
  
  generateTaskArray('Tasks/' + DATA_ID + '.xml', () => {
    actualButton.click();
  });

}

const compareStringsAndHighlight = (str1, str2) => {
  // Zerlegt beide Strings in Arrays von Buchstaben.
  const arrStr1 = Array.from(str1);
  const arrStr2 = Array.from(str2);
  // Iteriert über arrStr1, um jeden Buchstaben zu vergleichen.
  const result = arrStr1
    .map((char, index) => {
      // Überprüft, ob der Buchstabe an der gleichen Stelle in beiden Strings vorhanden und gleich ist.
      // Dabei wird auch die Groß- und Kleinschreibung berücksichtigt.
      if (index < arrStr2.length && char === arrStr2[index]) {
        return char; // Wenn ja, füge den Buchstaben unverändert hinzu.
      } else {
        return `<span class="wrong">${char}</span>`; // Wenn nein, markiere den Buchstaben.
      }
    })
    .join("");
  return result;
};

const createMatrixAnimation = () => {
// Initialising the canvas
  let canvas = document.getElementById("canva");
  let ctx = canvas.getContext('2d');
  let speed = 40;

  // Setting the width and height of the canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = "block";

  // Setting up the letters
  let letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ';
  letters = letters.split('');

  // Setting up the columns
  let fontSize = 12;
  let columns = canvas.width / fontSize;

  // Setting up the drops
  let drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }

  // Setting up the draw function
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, .02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < drops.length; i++) {
      let text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillStyle = 'rgba(0, 255, 0, .8)';
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      drops[i]++;
      if (drops[i] * fontSize > canvas.height && Math.random() > .99) {
        drops[i] = 0;
      }
    }
  }

  // Loop the animation
  let matrixInterval = setInterval(draw, speed);
  canvas.addEventListener("click", (e) => {
    e.target.style.display = "none";
    clearInterval(matrixInterval);
  });
};

showTask();
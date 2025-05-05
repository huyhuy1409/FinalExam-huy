document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById("startButton");
    const endBtn = document.getElementById("endButton");
    const timerDisplay = document.getElementById("timer");
    const grid = document.querySelector(".grid");
    const moveHistory = document.getElementById("moveHistory");
    const winModal = document.getElementById("winModal");
    const closeWinModal = document.getElementById("closeWinModal");
  
    let timerInterval;
    let seconds = 0;
    let moveCount = 0;
    let startTime;
    let movesMade = [];
  
    const columns = 4;
  
    const originalTiles = [
      { number: 1, color: 'bg-green-100', textColor: 'text-green-500' },
      { number: 2, color: 'bg-red-100', textColor: 'text-red-500' },
      { number: 3, color: 'bg-blue-100', textColor: 'text-blue-500' },
      { number: 4, color: 'bg-purple-100', textColor: 'text-purple-500' },
      { number: 5, color: 'bg-pink-100', textColor: 'text-pink-500' },
      { number: 6, color: 'bg-yellow-100', textColor: 'text-yellow-500' },
      { number: 7, color: 'bg-indigo-100', textColor: 'text-indigo-500' },
      { number: 8, color: 'bg-gray-100', textColor: 'text-gray-500' },
      { number: 9, color: 'bg-emerald-100', textColor: 'text-emerald-500' },
      { number: 10, color: 'bg-amber-100', textColor: 'text-amber-500' },
      { number: 11, color: 'bg-lime-100', textColor: 'text-lime-500' },
      { number: '', color: 'bg-black', textColor: 'text-white' }
    ];
  
    function formatTime(sec) {
      const minutes = Math.floor(sec / 60);
      const seconds = sec % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  
    function startTimer() {
      seconds = 0;
      timerDisplay.textContent = formatTime(seconds);
      startTime = Date.now();
      timerInterval = setInterval(() => {
        seconds++;
        timerDisplay.textContent = formatTime(seconds);
      }, 1000);
    }
  
    function stopTimer() {
      clearInterval(timerInterval);
      timerDisplay.textContent = "0:00";
    }
  
    function shuffleTiles(times = 100) {
      const tiles = Array.from(document.querySelectorAll(".tile"));
      for (let i = 0; i < times; i++) {
        const [tile1, tile2] = [
          tiles[Math.floor(Math.random() * tiles.length)],
          tiles[Math.floor(Math.random() * tiles.length)]
        ];
        tile1.parentElement.insertBefore(tile1, tile2);
        tile2.parentElement.insertBefore(tile2, tile1);
      }
    }
  
    function resetGrid() {
      const tiles = Array.from(grid.querySelectorAll(".tile"));
      tiles.forEach((tile, index) => {
        const { number, color, textColor } = originalTiles[index];
        tile.textContent = number;
        tile.className = `tile w-20 h-20 sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] rounded-md font-bold shadow flex items-center justify-center ${color} ${textColor}`;
      });
    }
  
    function getEmptyTile() {
      return Array.from(grid.querySelectorAll(".tile")).find(tile => tile.textContent === "");
    }
  
    function swapTiles(tile1, tile2) {
      const tempText = tile1.textContent;
      const tempClass = tile1.className;
  
      tile1.textContent = tile2.textContent;
      tile1.className = tile2.className;
  
      tile2.textContent = tempText;
      tile2.className = tempClass;
    }
  
    function checkWinningCondition() {
      const tiles = Array.from(grid.querySelectorAll(".tile"));
      let isWin = true;
  
      tiles.forEach((tile, index) => {
        const { number, color, textColor } = originalTiles[index];
        if (
          tile.textContent !== number.toString() ||
          !tile.classList.contains(color) ||
          !tile.classList.contains(textColor)
        ) {
          isWin = false;
        }
      });
  
      if (isWin) {
        winModal.classList.remove("hidden");
        stopTimer();
      }
    }
  
    function moveTile(direction) {
      const emptyTile = getEmptyTile();
      const tiles = Array.from(grid.querySelectorAll(".tile"));
      const emptyIndex = tiles.indexOf(emptyTile);
  
      let targetIndex;
  
      if (direction === "up" && emptyIndex - columns >= 0) {
        targetIndex = emptyIndex - columns;
      } else if (direction === "down" && emptyIndex + columns < tiles.length) {
        targetIndex = emptyIndex + columns;
      } else if (direction === "left" && emptyIndex % columns !== 0) {
        targetIndex = emptyIndex - 1;
      } else if (direction === "right" && (emptyIndex + 1) % columns !== 0) {
        targetIndex = emptyIndex + 1;
      } else {
        return;
      }
  
      const targetTile = tiles[targetIndex];
      swapTiles(emptyTile, targetTile);
      moveCount++;
      checkWinningCondition();
    }
  
    function addKeyboardListeners() {
      window.addEventListener("keydown", function(event) {
        if (event.key === "w" || event.key === "ArrowUp") {
          moveTile("up");
        } else if (event.key === "s" || event.key === "ArrowDown") {
          moveTile("down");
        } else if (event.key === "a" || event.key === "ArrowLeft") {
          moveTile("left");
        } else if (event.key === "d" || event.key === "ArrowRight") {
          moveTile("right");
        }
      });
    }
  
    startBtn.addEventListener("click", () => {
      startBtn.classList.add("hidden");
      endBtn.classList.remove("hidden");
      startTimer();
      shuffleTiles(100);
      addKeyboardListeners();
    });
  
    endBtn.addEventListener("click", () => {
        endBtn.classList.add("hidden");
        startBtn.classList.remove("hidden");
        stopTimer();
    
        const totalTime = Math.floor((Date.now() - startTime) / 1000);
        const formattedTime = formatTime(totalTime);
    
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
          <td class="px-4 py-2">${moveHistory.children.length + 1}</td>
          <td class="px-4 py-2">${moveCount}</td>
          <td class="px-4 py-2">${formattedTime}</td>
        `;
        moveHistory.appendChild(newRow);
    
        resetGrid();
        moveCount = 0;
        movesMade = [];
      });
    
      closeWinModal.addEventListener("click", () => {
        winModal.classList.add("hidden");
        resetGrid();
      });
  });
  
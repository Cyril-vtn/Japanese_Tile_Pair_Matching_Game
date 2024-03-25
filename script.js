const startButton = document.getElementById("startButton");
const againButton = document.getElementById("againButton");
let isFlipping = false;

// Function to check if all pairs have been found
function checkWin() {
  const allTiles = document.querySelectorAll(".tile");
  const matchedTiles = document.querySelectorAll(".tile.matched");

  // If all tiles have been matched
  if (allTiles.length === matchedTiles.length) {
    alert("Congratulations! You found all the pairs!");
    againButton.classList.toggle("hidden"); // Show the 'Play Again' button
    againButton.textContent = "Play Again";
  }
}

// Event listener for the 'Play Again' button
againButton.addEventListener("click", () => {
  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = ""; // Clear the game area
  createPairGame(); // Start a new game
  againButton.classList.toggle("hidden"); // Hide the 'Play Again' button
});

async function createPairGame() {
  const response = await fetch("data.json");
  const data = await response.json();
  let characters = [];

  // Merge the hiragana and katakana arrays into one array
  characters = [...data.hiragana, ...data.katakana];
  const selectedCharacters = [];

  // Select 10 random characters
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    selectedCharacters.push(characters[randomIndex]);
  }

  // Duplicate the selected characters to create pairs
  const pairs = [...selectedCharacters, ...selectedCharacters];

  // Shuffle the order of the pairs
  pairs.sort(() => Math.random() - 0.5);

  // Create the tiles
  const gameArea = document.getElementById("gameArea");
  pairs.forEach((character, index) => {
    const tile = document.createElement("div");
    tile.textContent = ""; // Don't show the character initially
    tile.dataset.character = character.caractere; // Store the character in a data attribute
    tile.className = "tile";
    gameArea.appendChild(tile);

    // Add an event listener to the tile
    tile.addEventListener("click", function () {
      // If the game is not flipping tiles and the tile is not already flipped
      if (!isFlipping && this.textContent === "") {
        this.textContent = this.dataset.character; // Show the character

        // Check if there's another flipped tile
        const flippedTiles = document.querySelectorAll(
          ".tile:not(.matched):not(:empty)"
        );
        if (flippedTiles.length === 2) {
          isFlipping = true; // The game is now flipping tiles
          if (flippedTiles[0].textContent === flippedTiles[1].textContent) {
            // If the characters match, mark the tiles as matched
            flippedTiles.forEach((tile) => tile.classList.add("matched"));
            isFlipping = false; // The game is no longer flipping tiles
          } else {
            // If the characters don't match, flip the tiles back after a delay
            setTimeout(() => {
              flippedTiles.forEach((tile) => (tile.textContent = ""));
              isFlipping = false; // The game is no longer flipping tiles
            }, 500);
          }
          checkWin(); // Check if the player has won
        }
      }
    });
  });

  startButton.style.display = "none"; // Hide the start button
}

// Event listener for the start button
startButton.addEventListener("click", () => {
  createPairGame(); // Start the game
});

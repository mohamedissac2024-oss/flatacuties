
const BASE_URL = 'http://localhost:3000';
const CHARACTERS_URL = `${BASE_URL}/characters`;

const listEl = document.getElementById('character-list');
const detailNameEl = document.getElementById('detail-name');
const detailImageEl = document.getElementById('detail-image');
const detailVotesEl = document.getElementById('detail-votes');
const voteButtonEl = document.getElementById('vote-button');

let currentCharacter = null;

// Fetch all animals and show list
function fetchCharacters() {
  fetch(CHARACTERS_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(chars => {
      renderCharacterList(chars);
    })
    .catch(err => {
      console.error(error)
    });
}

// Render list of characters
function renderCharacterList(chars) {
  listEl.innerHTML = '';
  chars.forEach(char => {
    const li = document.createElement('li');
    li.textContent = char.name;
    li.addEventListener('click', () => {
      showDetails(char.id);
    });
    listEl.appendChild(li);
  });
}

// Fetch one character’s details and show
function showDetails(id) {
  fetch(`${CHARACTERS_URL}/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(char => {
      currentCharacter = char;
      detailNameEl.textContent = char.name;
      detailImageEl.src = char.image;
      detailImageEl.style.display = 'block';
      detailVotesEl.textContent = char.votes;
      voteButtonEl.style.display = 'inline-block';
    })
    .catch(err => {
      console.error('Error fetching detail:', err);
    });
}

// Handle voting
voteButtonEl.addEventListener('click', () => {
  if (!currentCharacter) return;

  const newVotes = currentCharacter.votes + 1;

  fetch(`${CHARACTERS_URL}/${currentCharacter.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ votes: newVotes })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(updatedChar => {
      currentCharacter = updatedChar;
      detailVotesEl.textContent = updatedChar.votes;
    })
    .catch(err => {
      console.error('Error updating votes:', err);
    });
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  fetchCharacters();


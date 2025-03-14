document.querySelectorAll(".kanban-card").forEach((card) => {
  card.addEventListener("dragstart", (e) => {
    e.currentTarget.classList.add("dragging");
  });
  card.addEventListener("dragend", (e) => {
    e.currentTarget.classList.remove("dragging");
  });
});

document.querySelectorAll(".kanban-cards").forEach((column) => {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("cards-hover");
  });
  column.addEventListener("dragleave", (e) => {
    e.currentTarget.classList.remove("cards-hover");
  });
  column.addEventListener("drop", (e) => {
    e.currentTarget.classList.remove("cards-hover");

    const dragCard = document.querySelector(".kanban-card.dragging");
    e.currentTarget.appendChild(dragCard);
  });
});

document.querySelectorAll(".add-card").forEach((button) => {
  button.addEventListener("click", (e) => {
    const modal = document.querySelector(".modal-overlay");
    const column = e.target.closest(".kanban-column");

    modal.dataset.originColumn = column.querySelector(".kanban-cards").id;

    modal.style.display = "flex";
  });
});

document.querySelector(".modal-overlay").addEventListener("click", (e) => {
  if (
    e.target.classList.contains("modal-overlay") ||
    e.target.classList.contains("cancel-btn")
  ) {
    closeModal();
  }
});

document.getElementById("cardForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("cardTitle").value;
  const priority = document.getElementById("cardPriority").value;
  const description = document.getElementById("cardDescription").value;

  if (!title) {
    alert("Por favor, insira um título para o card");
    return;
  }

  const modal = document.querySelector(".modal-overlay");
  const targetColumn = document.querySelector(`#${modal.dataset.originColumn}`);

  const newCard = createCardElement({ title, priority, description });

  targetColumn.appendChild(newCard);
  closeModal();
  saveToLocalStorage();
});

function createCardElement({ title, priority, description }) {
  const card = document.createElement("div");
  card.className = "kanban-card";
  card.draggable = true;

  const priorityLabels = {
    high: "Alta prioridade",
    medium: "Média prioridade",
    low: "Baixa prioridade",
  };

  card.innerHTML = `
        <div class="badge ${priority}">
            <span>${priorityLabels[priority]}</span>
        </div>
        <p class="card-title">${title}</p>
        <div class="card-infos">
            <div class="card-icons">
                <p><i class="fa-regular fa-comment"></i>0</p>
                <p><i class="fa-solid fa-paperclip"></i>0</p>
            </div>
        </div>
    `;

  // Adiciona eventos de drag
  card.addEventListener("dragstart", (e) => {
    e.currentTarget.classList.add("dragging");
  });

  card.addEventListener("dragend", (e) => {
    e.currentTarget.classList.remove("dragging");
  });

  return card;
}

function closeModal() {
  document.querySelector(".modal-overlay").style.display = "none";
  document.getElementById("cardForm").reset();
}

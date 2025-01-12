const newHabitButton = document.getElementById("addNewHabit");
const newHabitForm = document.getElementById("newHabitForm");
const overlay = document.getElementById("overlay");
const formButton = document.getElementById("formButton");
const habitName = document.getElementById("habitName");
const habitTrackingStyle = document.getElementById("habitTrackingStyle");

const newEntryForm = document.getElementById("newEntry");
const entryHabitName = document.getElementById("entryHabitName");
const currentStreakValue = document.getElementById("currentStreakValue");
const dateValue = document.getElementById("dateValue");
const minutes = document.getElementById("minutes");
const saveEntry = document.getElementById("saveEntry");

let entryForm;
let habits;
if (localStorage.length != 0) {
  habits = JSON.parse(localStorage.getItem("habits"));
  habits.forEach((habit) => displayHabit(habit));
} else {
  habits = [];
}

function Entry(value, containingHabit, date) {
  var weight = 0;
  Object.defineProperties(this, {
    value: {
      value: value,
      writable: true,
      configurable: true,
      enumerable: true,
    },
    containingHabit: {
      value: containingHabit,
    },
    setWeight: {
      value: function (val) {
        weight = val;
      },
    },
    getWeight: {
      value: function () {
        return weight;
      },
    },
    date: {
      value: date,
      writable: false,
    },
  });
}

Entry.updateWeights = function (heatmap, habit) {
  habit.entries.forEach((entry) => {
    if (parseInt(entry.value) > habit.highestWeightEntry.value) {
      habit.highestWeightEntry.setWeight(
        habit.highestWeightEntry.value / entry.value
      );
      habit.highestWeightEntry = entry;
      habit.highestWeightEntry.setWeight(1);
      Entry.updateWeights(heatmap, habit);
    } else {
      entry.setWeight(entry.value / habit.highestWeightEntry.value);
    }
  });
  for (let i = 0; i < heatmap.children.length; i++) {
    habit.entries[i].weight = habit.entries[i].getWeight();
    heatmap.children[i].style.backgroundColor = `rgba(255,69,59,${habit.entries[
      i
    ].getWeight()})`;
  }
};

function Habit(name, trackingStyle) {
  Object.defineProperties(this, {
    name: {
      value: name,
      writable: true,
      enumerable: true,
    },
    trackingStyle: {
      value: trackingStyle,
      writable: false,
      enumerable: true,
    },
    entries: {
      value: new Array(365),
      writable: true,
      enumerable: true,
    },
    avgTime: {
      value: 0,
      writable: true,
      enumerable: true,
    },
    currentStreak: {
      value: 0,
      writable: true,
      enumerable: true,
    },
    longestStreak: {
      value: 0,
      writable: true,
      enumerable: true,
    },
    highestWeightEntry: {
      value: null,
      writable: true,
      enumerable: true,
    },
    updateCurrentStreak: {
      value: function () {},
      enumerable: true,
    },
    updateLongestStreak: {
      value: function () {},
      enumerable: true,
    },
  });

  let startDate = new Date(2025, 0, 1);

  for (let i = 0; i < this.entries.length; i++) {
    let currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    console.log(currentDate);
    this.entries[i] = new Entry(0, this, currentDate.toLocaleDateString());
  }

  this.highestWeightEntry = this.entries[0];
  this.entries[0].setWeight(1);
}

newHabitButton.addEventListener("click", function () {
  show(overlay);
  show(newHabitForm);
});

overlay.addEventListener("click", function () {
  hide(newHabitForm);
  hide(overlay);
  hide(newEntryForm);
});

function hide(element) {
  element.style.display = "none";
}

function show(element) {
  element.style.display = "block";
}

formButton.addEventListener("click", newHabitHandler);

// (function () {
//   const habitContainer = document.createElement("div");
//   const newHabitName = document.createElement("div");
//   const newHabitAverageTime = document.createElement("span");
//   const newHabitCurrentStreak = document.createElement("span");
//   const newHabitLongestStreak = document.createElement("span");
//   const infoContainer = document.createElement("div");

//   const newHabit = new Habit("Meditation", "numerical");
//   habits.push(newHabit);

//   newHabitName.innerText = "Meditation";
//   newHabitAverageTime.innerText = `Average Time: 25`;
//   newHabitCurrentStreak.innerText = `Current Streak: 9 days`;
//   newHabitLongestStreak.innerText = `Longest Streak: 30 days`;

//   habitContainer.setAttribute("id", `${newHabit.name}Container`);
//   habitContainer.classList.add("habitContainer");
//   infoContainer.classList.add("infoContainer");
//   habitContainer.appendChild(newHabitName);
//   createHeatmap(newHabit, habitContainer);
//   infoContainer.appendChild(newHabitAverageTime);
//   infoContainer.appendChild(newHabitCurrentStreak);
//   infoContainer.appendChild(newHabitLongestStreak);

//   habitContainer.appendChild(infoContainer);

//   newHabitName.classList.add("habitName");
//   newHabitAverageTime.classList.add("info");
//   newHabitCurrentStreak.classList.add("info");
//   newHabitLongestStreak.classList.add("info");

//   document.body.appendChild(habitContainer);
// })();

function newHabitHandler(e) {
  e.preventDefault();
  hide(overlay);
  hide(newHabitForm);

  const newHabit = new Habit(habitName.value, habitTrackingStyle.value);
  habits.push(newHabit);
  localStorage.setItem("habits", JSON.stringify(habits));

  displayHabit(newHabit);
}

function displayHabit(habit) {
  const habitContainer = document.createElement("div");
  const newHabitName = document.createElement("div");
  const newHabitAverageTime = document.createElement("span");
  const newHabitCurrentStreak = document.createElement("span");
  const newHabitLongestStreak = document.createElement("span");
  const infoContainer = document.createElement("div");

  newHabitName.innerHTML = habit.name;
  newHabitAverageTime.innerText = `Average Time: ${habit.avgTime}`;
  newHabitCurrentStreak.innerText = `Current Streak: ${habit.currentStreak}`;
  newHabitLongestStreak.innerText = `Longest Streak: ${habit.longestStreak}`;

  habitContainer.setAttribute("id", `${habit.name}Container`);
  habitContainer.classList.add("habitContainer");
  newHabitName.classList.add("habitName");
  infoContainer.classList.add("infoContainer");

  habitContainer.appendChild(newHabitName);
  createHeatmap(habit, habitContainer);
  infoContainer.appendChild(newHabitAverageTime);
  infoContainer.appendChild(newHabitCurrentStreak);
  infoContainer.appendChild(newHabitLongestStreak);
  habitContainer.appendChild(infoContainer);

  document.body.appendChild(habitContainer);
}

function createHeatmap(habit, container) {
  const habitHeatmap = document.createElement("div");
  habitHeatmap.classList.add("heatmap");
  habit.entries.forEach((entry) => {
    let entryDiv = document.createElement("div");
    entryDiv.classList.add("entry");
    entryDiv.addEventListener("click", function () {
      show(overlay);
      showEntryForm(habit, entry, container);
    });
    habitHeatmap.appendChild(entryDiv);
  });
  container.appendChild(habitHeatmap);
}

function showEntryForm(habit, entry, container) {
  entryHabitName.innerText = habit.name;
  dateValue.innerText = entry.date;
  minutes.innerText = entry.value;
  currentStreakValue.innerText = habit.currentStreak;

  saveEntry.addEventListener("click", function (event) {
    event.preventDefault();
    hide(overlay);
    hide(newEntryForm);
    entry.value = minutes.value;
    Entry.updateWeights(container.children[1], habit);
  });

  show(newEntryForm);
}

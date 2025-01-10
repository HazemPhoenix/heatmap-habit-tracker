const newHabitButton = document.getElementById("addNewHabit");
const newHabitForm = document.getElementById("newHabitForm");
const overlay = document.getElementById("overlay");
const formButton = document.getElementById("formButton");
const habitName = document.getElementById("habitName");
const habitTrackingStyle = document.getElementById("habitTrackingStyle");

let habits = [];

function Entry(value, containingHabit) {
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
  });
}

Entry.updateWeights = function (heatmap, habit) {
  console.log(habit);
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
    },
    trackingStyle: {
      value: trackingStyle,
      writable: false,
    },
    entries: {
      value: new Array(365),
      writable: true,
    },
    avgTime: {
      value: 0,
      writable: true,
    },
    currentStreak: {
      value: 0,
      writable: true,
    },
    longestStreak: {
      value: 0,
      writable: true,
    },
    highestWeightEntry: {
      value: null,
      writable: true,
    },
    updateCurrentStreak: {
      value: function () {},
    },
    updateLongestStreak: {
      value: function () {},
    },
  });

  for (let i = 0; i < this.entries.length; i++) {
    this.entries[i] = new Entry(0, this);
  }

  this.highestWeightEntry = this.entries[0];
  this.entries[0].setWeight(1);
}

newHabitButton.addEventListener("click", showOverlay);

overlay.addEventListener("click", hideOverlay);

function hideOverlay() {
  overlay.style.display = "none";
  newHabitForm.style.display = "none";
}
function showOverlay() {
  overlay.style.display = "block";
  newHabitForm.style.display = "block";
}

formButton.addEventListener("click", newHabitHandler);

(function () {
  const habitContainer = document.createElement("div");
  const newHabitName = document.createElement("div");
  const newHabitAverageTime = document.createElement("span");
  const newHabitCurrentStreak = document.createElement("span");
  const newHabitLongestStreak = document.createElement("span");
  const infoContainer = document.createElement("div");

  const newHabit = new Habit(habitName.value, habitTrackingStyle.value);
  habits.push(newHabit);
  newHabitName.innerText = "Meditate";
  newHabitAverageTime.innerText = `Average Time: 25`;
  newHabitCurrentStreak.innerText = `Current Streak: 9 days`;
  newHabitLongestStreak.innerText = `Longest Streak: 30 days`;

  habitContainer.setAttribute("id", `${newHabit.name}Container`);
  habitContainer.classList.add("habitContainer");
  infoContainer.classList.add("infoContainer");
  habitContainer.appendChild(newHabitName);
  createHeatmap(newHabit, habitContainer);
  infoContainer.appendChild(newHabitAverageTime);
  infoContainer.appendChild(newHabitCurrentStreak);
  infoContainer.appendChild(newHabitLongestStreak);

  habitContainer.appendChild(infoContainer);

  newHabitName.classList.add("habitName");
  newHabitAverageTime.classList.add("info");
  newHabitCurrentStreak.classList.add("info");
  newHabitLongestStreak.classList.add("info");

  document.body.appendChild(habitContainer);
})();
function newHabitHandler(e) {
  e.preventDefault();
  hideOverlay();

  const habitContainer = document.createElement("div");
  const newHabitName = document.createElement("div");
  const newHabitAverageTime = document.createElement("span");
  const newHabitCurrentStreak = document.createElement("span");
  const newHabitLongestStreak = document.createElement("span");
  const infoContainer = document.createElement("div");

  const newHabit = new Habit(habitName.value, habitTrackingStyle.value);
  habits.push(newHabit);
  newHabitName.innerHTML = habitName.value;

  newHabitAverageTime.innerText = `Average Time: ${newHabit.avgTime}`;
  newHabitCurrentStreak.innerText = `Current Streak: ${newHabit.currentStreak}`;
  newHabitLongestStreak.innerText = `Longest Streak: ${newHabit.longestStreak}`;

  habitContainer.setAttribute("id", `${newHabit.name}Container`);
  habitContainer.classList.add("habitContainer");
  newHabitName.classList.add("habitName");
  infoContainer.classList.add("infoContainer");

  infoContainer.appendChild(newHabitAverageTime);
  infoContainer.appendChild(newHabitCurrentStreak);
  infoContainer.appendChild(newHabitLongestStreak);

  habitContainer.appendChild(newHabitName);
  createHeatmap(newHabit, habitContainer);
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
      let val = prompt("val: ");
      entry.value = val;
      Entry.updateWeights(container.children[1], habit);
      // for (let i = 0; i < year.children.length; i++) {
      //   newHabit.entries[i].weight = newHabit.entries[i].getWeight();
      //   year.children[i].style.backgroundColor = `rgba(255,69,59,${entries[
      //     i
      //   ].getWeight()})`;
      // }
    });
    habitHeatmap.appendChild(entryDiv);
  });
  container.appendChild(habitHeatmap);
}

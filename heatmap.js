const newHabitButton = document.getElementById("addNewHabit");
const newHabitForm = document.getElementById("newHabitForm");
const overlay = document.getElementById("overlay");
const formButton = document.getElementById("formButton");

let habits = [];
Entry.highestWeightEntry = null;

newHabitButton.addEventListener("click", function (e) {
  overlay.style.display = "block";
  newHabitForm.style.visibility = "visible";
  newHabitForm.style.zIndex = 3;
  overlay.addEventListener("click", function () {
    overlay.style.display = "none";
    newHabitForm.style.visibility = "hidden";
  });
});

formButton.addEventListener("click", function (e) {
  e.preventDefault();
  const habitName = document.getElementById("habitName");
  const habitTrackingStyle = document.getElementById("habitTrackingStyle");
  overlay.style.display = "none";
  newHabitForm.style.visibility = "hidden";
  const newHabit = new Habit(habitName.value, habitTrackingStyle.value);
  const year = document.createElement("div");
  year.classList.add("year");

  for (let i = 0; i < 365; i++) {
    newHabit.entries.push(new Entry("entry", 0));
    let entry = document.createElement("div");
    entry.classList.add("entry");
    entry.addEventListener("click", function (event) {
      let val = prompt("val: ");
      newHabit.entries[i].value = val;
      Entry.updateWeights();
      for (let i = 0; i < year.children.length; i++) {
        newHabit.entries[i].weight = newHabit.entries[i].getWeight();
        year.children[i].style.backgroundColor = `rgba(255,69,59,${entries[
          i
        ].getWeight()})`;
      }
    });
    year.appendChild(entry);
  }
  console.log(year);
  document.body.appendChild(year);
});

function Entry(value) {
  var weight;
  Object.defineProperties(this, {
    value: {
      value: value,
      writable: true,
      configurable: true,
      enumerable: true,
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
  if (Entry.highestWeightEntry == null) {
    Entry.highestWeightEntry = this;
    this.setWeight(1);
  }
}

Entry.updateWeights = function () {
  let divs = document.getElementsByClassName("entry");
  entries.forEach((entry) => {
    if (parseInt(entry.value) > Entry.highestWeightEntry.value) {
      Entry.highestWeightEntry.setWeight(
        Entry.highestWeightEntry.value / entry.value
      );
      Entry.highestWeightEntry = entry;
      Entry.highestWeightEntry.setWeight(1);
      Entry.updateWeights();
    } else {
      entry.setWeight(entry.value / Entry.highestWeightEntry.value);
    }
  });
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
    currentStreak: {
      value: 0,
      writable: true,
    },
    longestStreak: {
      value: 0,
      writable: true,
    },
  });
}

const containers = document.getElementsByClassName("year");
let entries = [];
let divs = document.getElementsByClassName("entry");
Entry.highestWeightEntry = null;
for (let i = 0; i < 365; i++) {
  entries.push(new Entry("entry", 0));
  let div = document.createElement("div");
  div.classList.add("entry");
  div.addEventListener("click", function (event) {
    let name = prompt("Name: ");
    let val = prompt("Value: ");
    entries[i].name = name;
    entries[i].value = val;
    Entry.updateWeights();
  });
  containers[0].appendChild(div);
}

function Entry(name, value) {
  var weight;
  Object.defineProperties(this, {
    name: {
      value: name,
      writable: true,
      configurable: true,
      enumerable: true,
    },
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
    Entry.highestWeightEntry ??= this;
    this.setWeight(1);
  }
}

Entry.updateWeights = function () {
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
    for (let i = 0; i < divs.length; i++) {
      divs[i].style.backgroundColor = `rgba(255,69,59,${entries[
        i
      ].getWeight()})`;
    }
  });
};

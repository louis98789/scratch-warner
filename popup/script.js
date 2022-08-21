function updateCensoredDisplay() {
    var censoredDisplay = document.getElementById("censored-list")
    while (censoredDisplay.firstChild) {
        censoredDisplay.removeChild(censoredDisplay.firstChild);
    }

    chrome.storage.local.get(["censored_text"], (stored) => {
        var censored = stored.censored_text;
        censored.forEach((censoredItem) => {
            var censoredItemContainer = document.createElement("div");
            censoredItemContainer.setAttribute("class", "censored-item-container");

            var li = document.createElement("li");
            li.innerHTML = censoredItem;
            li.setAttribute("class", "censored-li");
            censoredItemContainer.appendChild(li);

            var removeButton = document.createElement("button");
            removeButton.innerHTML = "X";
            removeButton.setAttribute("class", "remove-button");
            removeButton.addEventListener("click", (event) => {
                var buttonIndex = [...document.getElementsByClassName("remove-button")].indexOf(event.target);
                censored.splice(buttonIndex, 1);
                chrome.storage.local.set({"censored_text": censored}, () => {});
                updateCensoredDisplay();
            });
            censoredItemContainer.appendChild(removeButton);

            var dummy = document.createElement("div");
            dummy.setAttribute("class", "censored-item-dummy");
            censoredItemContainer.appendChild(dummy);

            censoredDisplay.appendChild(censoredItemContainer);
        });
    });
}

function submit() {
    chrome.storage.local.get(["censored_text"], (censored) => {
        var newCensored = censored.censored_text;
        newCensored.push(document.getElementById("text-input").value);
        chrome.storage.local.set({"censored_text": newCensored}, () => {});

        updateCensoredDisplay();

        document.getElementById("text-input").value = "";
    });
}

document.getElementById("submit-button").addEventListener("click", (event) => {
    submit();
});

document.getElementById("text-input").addEventListener("keypress", (event) => {
    if (event.code === "Enter") {
        submit();
    }
});

chrome.storage.local.get(["censored_text"], (censored) => {
    var newCensored = censored.censored_text;
    if (!(newCensored)) {
        chrome.storage.local.set({"censored_text": ["repl.co", "discord", "scratch addons"]}, () => {});
    }

    updateCensoredDisplay();
});

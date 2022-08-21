function main() {
    chrome.storage.local.get(["censored_text"], (blockedText) => {
        blockedText = blockedText.censored_text;
        var willCensor = false;
        var inputs = [...document.getElementsByTagName("textarea")];
        inputs.forEach((elt) => {
            if (["content", "compose-comment"].includes(elt.getAttribute("name"))) {
                blockedText.forEach((site) => {
                    if (elt.value.toLowerCase().includes(site.toLowerCase())) {
                        willCensor = true;
                        if (!document.getElementById("censor-warning-text")) {
                            var warning = document.createElement("p");
                            warning.innerHTML = "Your comment will be censored because it contains the following text: " + site;
                            warning.style.color = "red";
                            warning.style["margin-bottom"] = "5px";
                            warning.style["margin-top"] = "5px";
                            warning.setAttribute("id", "censor-warning-text");
                            elt.insertAdjacentElement("afterend", warning);
                        }
                    }
                });
            }
        });

        if (!willCensor) {
            document.getElementById("censor-warning-text").remove();
        }
    });
}

chrome.storage.local.get(["censored_text"], (censored) => {
    var newCensored = censored.censored_text;
    if (!(newCensored)) {
        chrome.storage.local.set({"censored_text": ["repl.co", "discord"]}, () => {
            setInterval(main, 300);
        });
    } else {
        setInterval(main, 300);
    }
});

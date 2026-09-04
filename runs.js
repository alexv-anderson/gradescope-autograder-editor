
function hideAllChildren(parentID) {
    for (let child of document.getElementById(parentID).children) {
        if (!child.classList.contains("hide")) {
            child.classList.add("hide");
        }
    }
}


function isStdOutFmtSrc_Rubric() {
    return document.querySelector("input[name=stdOutFmtSrc]:checked").value === "rubric";
}


function isStdOutFmt_JSON() {
    return document.querySelector("input[name=stdOutFmtSrc]:checked").value === "stdOutJSON";
}


function stdOutFmtSrcChange(input) {
    hideAllChildren("stdOutFmtSrc");

    let childID = "stdOutFmtSrc_" + input.value;
    document.getElementById(childID).classList.remove("hide");
}


function stdOutRubricFmtChange(input) {
    hideAllChildren("runsStdOutEditor");

    document.getElementById(input.value).classList.remove("hide");

    if (input.value === "stdOutExp") {
        stdOutTblToExp();
    } else {
        stdOutExpToTbl();
    }
}


function stdOutExpToTbl() {
    let tbl = document.getElementById("runTblBdy");
    while (tbl.firstChild) {
        tbl.removeChild(tbl.firstChild);
    }

    let expTxt = document.getElementById("runTxt");

    for (let l of expTxt.value.split("\n")) {
        let endsWithInput = l.endsWith("<input>");

        let criterion = {
            requirement: "pattern",
            expected: endsWithInput ? l.slice(0, -7) : l,
            endsWithInput: endsWithInput
        };

        if (l.startsWith("//")) {
            criterion.requirement = "ignore";
            delete criterion.expected;
            delete criterion.endsWithInput;
        }

        tbl.appendChild(buildCriterionRow(criterion));
    }
}


function stdOutTblToExp() {
    let tbl = document.getElementById("runTblBdy");
    let expTxt = document.getElementById("runTxt")

    expTxt.value = "";

    let criteria = extractCriteria(tbl); // Pulls from table
    let criteriaLen = criteria.length;

    let criterionI = 0;
    for (let criterion of criteria) {
        if (criterion.requirement === "ignore") {
            l = "//"
        } else {
            let l = criterion.expected;

            if (criterion.endsWithInput) {
                l += "<input>\n";
            }

            let lastLine = criterionI+1 === criteriaLen;
            if (lastLine && l.endsWith("\n")) {
                l = l.slice(0, -1);
            }

        }

        expTxt.value += l;

        criterionI++;
    }
}


function extractCriteriaPath() {
    let path = document.getElementById("stdOutFp").value.trim();

    if (path.length === 0) {
        window.alert("No path was set for test case!\nReturn to fix before exporting.");
    }

    return path;
}


function extractCriteria(tbl) {
    let criteria = [];

    for (let row of tbl.children) {
        let criterion = extractCriterionFromRow(row);

        criteria.push(criterion);
    }

    return criteria;
}

function extractCriterionFromRow(row) {
    let criterion = {};

    let i = 0;
    for (let datum of row.children) {
        let tag = datum.children[0];
        if (i === 0) {
            // Checkbox
        } else if (i === 1) {
            criterion.requirement = tag.value;
        } else if (i === 2) {
            criterion.expected = tag.value;
        } else if (i == 3) {
            criterion.endsWithInput = tag.checked;
        } else {
            window.alert("Too many columns in criteria table");
        }

        i++;
    }

    if (!criterion.endsWithInput) {
        criterion.expected += "\n";
    }

    console.log(criterion);

    return criterion;
}
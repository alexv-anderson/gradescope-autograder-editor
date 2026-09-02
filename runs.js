
function hideAllChildren(parentID) {
    for (let child of document.getElementById(parentID).children) {
        if (!child.classList.contains("hide")) {
            child.classList.add("hide");
        }
    }
}


function stdOutRubricFmtChange(input) {
    hideAllChildren("runsStdOutEditor");

    document.getElementById(input.value).classList.remove("hide");
}


function stdOutTblToExp() {
    let tbl = document.getElementById("runTblBdy");
    let expTxt = document.getElementById("runTxt")

    let criteria = extractCriteria(); // Pulls from table
    for (let criterion of criteria) {
        let l = criterion.expected;

        if (criterion.endsWithInput) {
            l += "<input>";
        }

        l += "\n";

        expTxt.value += l;
    }
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
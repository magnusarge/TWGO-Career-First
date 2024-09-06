let pilotName = ""

function updateName(restoredSettings) {
    pilotName = restoredSettings.pilotName || "";
    modifyTable();
}
function onError(e) {
    console.error(e);
}
const gettingStoredSettings = chrome.storage.local.get();
gettingStoredSettings.then(updateName, onError);



function getIdFromTitleCode(titleCode) {
    //get_leaderboard('Tiny Whoop GO__Mowing Rabbit Island@Whoop Rabbit Island','Whoop_Rabbit_Island.jpg','Micro','57Q4I769A6d819o8r9')
    const codeParts = titleCode.split(",");
    if ( codeParts[3]) {
        const id = codeParts[3].replace(/\W/g, '');
        return id;
    }
    return false;
}

if ( document.title == "Leaderboards" ) { // tinywhoopgo.com/leaderboards

    const favoritesContainer = document.createElement("div");
    const listOfTrackContainers = document.querySelectorAll("div.container");

    const favorites = {
        groupTitles: ["Novice","Intermediate","Pro"],
        domBuffer: {}, // {id1: dom, id1: dom, ..}
        domItems: {}, // {'Novice': [dom, dom, dom, ..], 'Intermediate': [dom...]}
        ids: {
            'H7t4p8F6l0H7C853A6': {title: "Welcome to TWGO Career Mode", groupIndex: 0},
            'h7o4k8z7G1i4E285S3': {title: "Slalom Station", groupIndex: 0},
            'S7E4c7c711q4I6u318': {title: "Cruising Rabbit Island", groupIndex: 0},
            '27W45811y2g9v0M8X4': {title: "Kicking up Dust", groupIndex: 0},
            'b7m4I9l2J3z7e4U7M0': {title: "Blowing Snow", groupIndex: 0},
            'Q734p8B7X3t056b218': {title: "Midnight Dockyard Sprint", groupIndex: 0},
            'X7v4t9H4w4V1L5j5P7': {title: "Whooping the Haus", groupIndex: 0},
            'A7G2z6D4Z2O1f1y4H7': {title: "Rock Garden Rip", groupIndex: 0},
            'a7l4i8i8H42163P0N8': {title: "Library Takeover", groupIndex: 0},
            'G754b7e7A9u1t7e5F0': {title: "Tiger Territory", groupIndex: 0},
            'g7p4D9L5R6A0E1f984': {title: "Taming the Towers", groupIndex: 1},
            'M7r5P1E9L2S1r3x4Z3': {title: "Shoelaces", groupIndex: 1},
            'T76407o7y8L8T557D2': {title: "Rabbit Island Medium", groupIndex: 1},
            'x7A4484731K5A2K2Q3': {title: "Whooping the Iron Horse", groupIndex: 1},
            'd7z4K8L1v3W223g790': {title: "Hay Bale Relay", groupIndex: 1},
            'Z7q5P264P6i4m7l330': {title: "Split S Haus", groupIndex: 1},
            'A7G4x981f6t3F9u1u8': {title: "Race on the Railing", groupIndex: 1},
            '3734g8m7C3k2v3W5X4': {title: "Flip Flop Drop", groupIndex: 1},
            'r7B4a826U5W2r3C692': {title: "Left to go Right", groupIndex: 1},
            'x7f4E7T9e6A9c2q3E4': {title: "Chinese Courtyard Medium", groupIndex: 1},
        }
    };

    for (const trackContainer of listOfTrackContainers) {
        // Copy nodes to buffer

        const trackImage = trackContainer.querySelector("img");

        if ( trackImage) {

            const onClickValue = trackImage.getAttribute("onclick");

            if ( onClickValue ) {

                const id = getIdFromTitleCode(onClickValue);

                if ( favorites.ids[id] ) {

                    favorites.domBuffer[id] = trackContainer//.cloneNode(true);
                }   
            }
        } 
    }

    for ( const item in favorites.ids ) {
        // Copy nodes from buffer to groups

        if ( favorites.domBuffer[item] ) {

            const groupIndex = favorites.ids[item].groupIndex;
            const groupTitle = favorites.groupTitles[groupIndex];

            if ( !favorites.domItems[groupTitle] ) {

                favorites.domItems[groupTitle] = [];
            }

            favorites.domItems[groupTitle].push(favorites.domBuffer[item]);
        }
    }

    for ( const favorite in favorites.domItems ) {
        // Put nodes to page

        const groupTitle = document.createElement("h3");
        groupTitle.textContent = "Career: " + favorite;
        favoritesContainer.appendChild(groupTitle);

        if ( favorite.length ) {

            for (const domItem of favorites.domItems[favorite]) {

                favoritesContainer.appendChild(domItem);
            }
        }
    }

    // Put favorites to the top of the page
    const list = document.querySelectorAll("td")
    list[1].insertBefore(favoritesContainer, list[1].children[5]);

}

///////////// LEADERBOARD tinywhoopgo.com/leaderboard
function modifyTable() {
    if(document.title == "Leaderboard") {

        const leaderboardTable = document.querySelector('table[width="Auto"]');
        if ( leaderboardTable ) {
            const leaderboardRows = leaderboardTable.querySelectorAll("tr");

            const pilotRow = document.querySelector("#pilot");

            if ( leaderboardRows && !pilotRow ) {

                const pilotsCount = leaderboardRows.length - 3;

                for (const tr of leaderboardRows) {
                    const cells = tr.querySelectorAll("td");
                    
                    let thisPilotName = "";
                    if (cells[2]) thisPilotName = cells[2].innerText;
                    if ( pilotName.length > 0 && thisPilotName == pilotName ) {

                        const pilotPlaceNo = cells[0].textContent;

                        const copyOfPilotRow = tr.cloneNode(true);
                        cells[1].textContent = "*";
                        tr.style.color = "yellow";

                        copyOfPilotRow.id = "pilot";
                        copyOfPilotRow.style.color = "yellow";
                        const firstCell = copyOfPilotRow.querySelectorAll("td")[0];
                        const secondCell = copyOfPilotRow.querySelectorAll("td")[1];
                        firstCell.innerHTML = "<b>" + pilotPlaceNo + "</b> of " + pilotsCount;
                        secondCell.innerHTML = "<br><br>";
                        leaderboardRows[0].parentNode.insertBefore(copyOfPilotRow, leaderboardRows[0].nextSibling);


                        break;
                    }
                }            
            }
            
        }

    }
}

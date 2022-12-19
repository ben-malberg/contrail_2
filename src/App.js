import * as React from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import "./App.css";
import Projection from "./components/projection";
import TopHeader from "./components/topHeader.js";
import Archive from "./components/archive.js";
import { handleSave } from "./components/handleSave";

export default function App() {
    const [entries, setEntries] = React.useState(
        () =>
            JSON.parse(localStorage.getItem("entries")) || [
                {
                    id: createId(),
                    timeStamp: createTimeStamp(),
                    body: createTimeStamp(),
                },
            ]
    );

    const [currentId, setCurrentId] = React.useState(entries[0].id);

    React.useEffect(() => {
        localStorage.setItem("entries", JSON.stringify(entries));
    }, [entries]);

    function createId() {
        // creates random id consisting of max 8 digits and 5 random letters
        const nums =
            Math.floor(Math.random() * 9999) * Math.floor(Math.random() * 9999);

        let count = 0;
        let chosenLetters = "";
        while (count < 10) {
            chosenLetters += "abcdefghijklmnopqrstuvwxyz"[
                Math.floor(Math.random() * 26)
            ];
            count++;
        }
        return nums + chosenLetters;
    }

    function createTimeStamp() {
        const timeData = new Date();
        return `${timeData
            .toDateString()
            .slice(4)} ${timeData.toLocaleTimeString()}`;
    }

    function createEntry() {
        setEntries((currentEntries) => {
            const newEntry = {
                id: createId(),
                timeStamp: createTimeStamp(),
                body: createTimeStamp(),
            };
            setCurrentId(newEntry.id);
            const newArray = currentEntries.map((entry) => entry);
            newArray.unshift(newEntry);
            return newArray;
        });
    }

    function removeEntry() {
        // clears body if only 1 entry exists
        if (entries.length === 1) {
            return setEntries((oldEntries) => {
                const oldEntry = oldEntries[0];
                localStorage.clear();
                return [{ ...oldEntry, body: createTimeStamp() }];
            });
        }
        // will set currentIdx of entry succeeding removed entry to hold place
        setEntries((currentEntries) => {
            let flag = false;
            let nextCurrentEntry = undefined;
            for (let idx = 0; idx < currentEntries.length; idx++) {
                if (flag) {
                    nextCurrentEntry = currentEntries[idx].id;
                    break;
                }
                if (idx < currentEntries.length - 1) {
                    if (currentEntries[idx].id === currentId) {
                        flag = true;
                    }
                } else {
                    // will set currentIdx to 2nd to last entry if last entry is removed
                    nextCurrentEntry =
                        currentEntries[currentEntries.length - 2].id;
                }
            }
            // filters out selected entry from entries
            const newArray = currentEntries.filter(
                (entry) => currentId !== entry.id
            );
            setCurrentId(nextCurrentEntry);
            return newArray;
        });
    }

    function loadCurrentId(event) {
        //controlled by Archive, will send selected ID from onClick handler and update currentId state
        const { id } = event.target;
        setCurrentId(id);
    }

    function updateEntry(event) {
        //controlled by Projection, will send updated body state (value) of current entry by matching its ID
        const { id, value } = event.target;
        setEntries((oldEntries) => {
            return oldEntries.map((oldEntry) => {
                if (oldEntry.id === id) {
                    return { ...oldEntry, body: value };
                } else {
                    return oldEntry;
                }
            });
        });
    }

    return (
        <main className="outerBorder">
            <div className="outerContainer">
                <TopHeader />

                <Allotment defaultSizes={[1, 2]}>
                    <Allotment.Pane minSize={0} maxSize={200}>
                        <div className="archivePanel">
                            <div className="archiveControl">
                                <div className="add" onClick={createEntry}>
                                    +
                                </div>
                                <div className="del" onClick={removeEntry}>
                                    -
                                </div>
                                {/* <div className="box"></div> */}
                                <div
                                    className="saveBox"
                                    // invokes save function to download text file
                                    onClick={() =>
                                        handleSave(
                                            entries,
                                            currentId,
                                            createTimeStamp,
                                            1
                                        )
                                    }
                                >
                                    <div className="hddIconContainer1">
                                        <span
                                            id="material-symbols-outlines"
                                            className="material-symbols-outlined"
                                        >
                                            save
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="saveBox"
                                    // invokes save function to download text file
                                    onClick={() =>
                                        handleSave(
                                            entries,
                                            currentId,
                                            createTimeStamp,
                                            2
                                        )
                                    }
                                >
                                    <div className="hddIconContainer2">
                                        save all
                                    </div>
                                </div>
                            </div>

                            <Archive
                                entries={entries}
                                loadCurrentId={loadCurrentId}
                            />
                        </div>
                    </Allotment.Pane>
                    <div className="projectionPanel">
                        <Projection
                            entries={entries}
                            currentId={currentId}
                            updateEntry={updateEntry}
                        />
                    </div>
                </Allotment>
            </div>
        </main>
    );
}

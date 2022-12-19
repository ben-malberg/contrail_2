import { saveAs } from "file-saver";

export const handleSave = (entries, currentId, createTimeStamp, size) => {
    console.log(entries);
    if (size === 1) {
        const current = entries.find((entry) => entry.id === currentId);
        const currentEntry = current.body;
        const currentTimeStamp = current.timeStamp;

        let blob = new Blob([currentEntry], {
            type: "text/plain;charset=utf-8",
        });
        saveAs(blob, `${currentTimeStamp}.txt`);
    } else if (size > 1) {
        const allEntries = entries
            .map((entry) => {
                return "ENTRY\n".concat(entry.body).concat("\n\n");
            })
            .reverse();
        let blob = new Blob([allEntries], {
            type: "text/plain;charset=utf-8",
        });

        const earliestEntry = entries[
            allEntries.length - 1
        ].timeStamp.replaceAll(" ", "");
        const latestEntry = entries[0].timeStamp.replaceAll(" ", "");

        saveAs(blob, `${earliestEntry}-${latestEntry}.txt`);
    }
};

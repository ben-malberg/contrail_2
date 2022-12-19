import { saveAs } from "file-saver";

export const handleSave = (entries, currentId, createTimeStamp, size) => {
    if (size === 1) {
        const currentEntry = entries.find(
            (entry) => entry.id === currentId
        ).body;
        let blob = new Blob([currentEntry], {
            type: "text/plain;charset=utf-8",
        });
        saveAs(blob, `${createTimeStamp()}.txt`);
    } else if (size > 1) {
        const allEntries = entries.map((entry) => {
            return entry.body.concat("\n\n");
        });
        let blob = new Blob([allEntries], {
            type: "text/plain;charset=utf-8",
        });
        saveAs(blob, `${createTimeStamp()}.txt`);
    }
};

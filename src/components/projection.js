import React from "react";
import { saveAs } from "file-saver";

export default function Projection({
    entries,
    currentId,
    updateEntry,
}) {
    const currentEntry = entries.filter((entry) => currentId === entry.id)[0];

    return (
        <textarea
            className="projectionBox"
            value={currentEntry.body}
            id={currentId}
            onChange={(event) => updateEntry(event)}
            placeholder="the sky's the limit..."
        />
    );
}

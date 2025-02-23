"use client";

import React from "react";

interface Props {
    activeView: any,
    setActiveView: any
}
const ViewToggle: React.FC<Props> = ({activeView, setActiveView}) => {

    function handleClick(view: string) {
        setActiveView(view);
    }

    return <div className="project-view-toggle">
        view: <a
        className={activeView === 'overview' ? 'active' : ''}
        onClick={() => handleClick('overview')}
    >overview
    </a> | <a
        className={activeView === 'index' ? 'active' : ''}
        onClick={() => handleClick('index')}
    >index</a>
    </div>
}

export default ViewToggle;

"use client";

import React, {ReactElement} from "react";

interface Props {
    activeView: any,
    setActiveView: any
}
const ViewToggle: React.FC<Props> = ({activeView, setActiveView}: Props): ReactElement<any, any> => {

    function handleClick(view: string): void {
        setActiveView(view);
    }

    return <div className="project-view-toggle">
        view: <a
        className={activeView === 'overview' ? 'active' : ''}
        onClick={() => handleClick('overview')}
    >overview
    </a>  &nbsp;|&nbsp; <a
        className={activeView === 'index' ? 'active' : ''}
        onClick={() => handleClick('index')}
    >index</a>
    </div>
}

export default ViewToggle;

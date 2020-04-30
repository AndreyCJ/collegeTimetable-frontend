import React, { useState, useEffect } from 'react';

import useGroupContext from '../../hooks/useGroupContext';
import useAllGroupsContext from '../../hooks/useAllGroupsContext';

const Groups = (props) => {
  const [clicked, setClicked] = useState(false);
  const [groupRows, setGroupRows] = useState([]);
  const { currentGroup, setCurrentGroup } = useGroupContext();
  const { setAllGroups } = useAllGroupsContext();

  useEffect(() => {
    setCurrentGroup(localStorage.getItem('currentGroup'));
    const getGroups = async () => {
      const response = await fetch('/api/classTimetable/groups');
      const data = await response.json();
      const distinctGroups = [...new Set(data.map(group => group.group ))];
      const copy = [...distinctGroups];
      setAllGroups(copy);
      renderGroups(copy);
    }
    getGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetCurrentGroup = (myGroup) => {
    // setTheCurrentGroup(myGroup);
    setCurrentGroup(myGroup)
    localStorage.setItem('currentGroup', myGroup);
  }

  const renderGroups = (copy) => {
    const rows = copy.map((theGroup, i) => (
      <li className="header-tooltip__group__item" onClick={() => handleSetCurrentGroup(theGroup)} id={i} key={i}>{theGroup}</li>
      )
    );
    setGroupRows(rows);
  };

  const showMenu = () => {
    setClicked(prev => !prev);
  }

  const closeMenu = () => {
    setClicked(false);
  }

  const renderGroupBox = () => {
    return (
      <div
        className={`header-tooltip-group-wrapper select-wrapper ${clicked ? '--clicked' : ''}`}
        onClick={() => showMenu()}
        tabIndex="0"
        onBlur={ closeMenu }
      >
      <label className="header-tooltip-group__label --ul-label --current">{currentGroup}</label>
      <ul className={`header-tooltip-group ${clicked ? '--shown' : ''}`}>
        {
          groupRows
        }
      </ul>
      </div>
    );
  };

  return (
    <span>{currentGroup === null ? '' : renderGroupBox()}</span>
  );
};

export default Groups;
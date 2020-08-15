import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { useHistory } from 'react-router-dom';
import { useViewport } from '../ViewportProvider';

initializeIcons();

function NavBar(props) {
  const { width, height } = useViewport();
  const breakpoint = 620;

  let history = useHistory();

  const items = [
    {
      key: 'home',
      text: 'Home',
      cacheKey: 'myCacheKey',
      iconProps: { iconName: 'Home' },
      onClick: () => history.push("/"),
    },
    {
      key: 'signout',
      text: 'Signout',
      iconProps: { iconName: 'Signout' },
      onClick: props.logout
    },
  ]

  return (
      <CommandBar
        items={items}
        ariaLabel="Use left and right arrow keys to navigate between commands"
        styles={width < breakpoint ? mobileItemStyles : desktopItemStyles }
      />
  );
};

const desktopItemStyles = {

  primarySet: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: 200,
    marginRight: 200
  },
  item: {
    margin: 'auto'
  },
  label: {
    fontSize: 20
  },
  icon: {
    fontSize: 20
  }
};

const mobileItemStyles = {
  primarySet: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  item: {
    margin: 'auto'
  },
  label: {
    fontSize: 20
  },
  icon: {
    fontSize: 20
  }
};

export default NavBar;
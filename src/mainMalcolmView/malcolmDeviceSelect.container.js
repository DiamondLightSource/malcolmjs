import React from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import MalcolmMobile from './malcolmMobile.container';
import MainMalcolmView from './mainMalcolmView.container';

const MalcolmDeviceSelect = () => (
  <div>
    <MobileView>
      <MalcolmMobile />
    </MobileView>
    <BrowserView>
      <MainMalcolmView />
    </BrowserView>
  </div>
);

export default MalcolmDeviceSelect;

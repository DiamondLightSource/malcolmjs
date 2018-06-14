import axios from 'axios';
import { updateVersionNumber } from '../../viewState/viewState.actions';
import { MalcolmSocketConnect } from '../malcolm.types';

export const registerSocketAndConnect = (socketContainer, socketUrl) => ({
  type: MalcolmSocketConnect,
  payload: {
    socketContainer,
    socketUrl,
  },
});

export const configureSocket = socketContainer => dispatch => {
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  axios.get(`${baseUrl}/settings.json`).then(res => {
    const settings = res.data;
    console.log(settings);
    dispatch(updateVersionNumber(settings.version));

    // in production no socket will be defined and it will default to ws://{{host}}/ws
    if (settings.malcolmSocket) {
      dispatch(
        registerSocketAndConnect(socketContainer, settings.malcolmSocket)
      );
    }
  });
};

export default {
  configureSocket,
  registerSocketAndConnect,
};

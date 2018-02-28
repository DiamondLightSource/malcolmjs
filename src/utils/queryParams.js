import ReactQueryParams from 'react-query-params';

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.1/8 is considered localhost for IPv4.
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

class QueryParams extends ReactQueryParams {

  getDeviceId() {
    return this.queryParams.path[0];
  };

  getTheme() {
    let theme = this.queryParams.theme;
    if (theme === undefined) {
      theme = "dark";
      this.setQueryParams({theme: theme})
    }
    return theme;
  };

  getWsHost() {
    if (isLocalhost) {
      return this.queryParams.wsHost;
    } else {
      return window.location.host;
    }
  }

  defaultQueryParams = {
    path: JSON.stringify(["PANDABOX"]),
    wsHost: window.location.host
  }
}

let params = new QueryParams({});

export default params;
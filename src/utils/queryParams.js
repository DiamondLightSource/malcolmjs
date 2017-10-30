import ReactQueryParams from 'react-query-params';

export default class QueryParams extends ReactQueryParams {

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

  defaultQueryParams = {
    path: JSON.stringify(["PANDABOX"])
  }
}

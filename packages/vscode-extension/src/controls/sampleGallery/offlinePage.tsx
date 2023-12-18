// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import "./offlinePage.scss";

import * as React from "react";

import OfflineImage from "../../../img/webview/sample/offline.svg";

export default class OfflinePage extends React.Component<unknown, unknown> {
  constructor(props: unknown) {
    super(props);
  }

  render() {
    return (
      <div className="offlinePage">
        <div className="offlineImage">
          <OfflineImage height="118px" width="118px" />
        </div>
        <div className="offlineTitle">You're offline.</div>
        <div className="offlineMessage">
          Connect to the internet to browse Teams Toolkit samples.
        </div>
      </div>
    );
  }
}

"use client";

import { MaritimePreparationEnterpriseBridge } from "./MaritimePreparationEnterpriseBridge";
import { MaritimeReportSwitcher } from "./MaritimeReportSwitcher";

export function MaritimeMultiReportWorkspace() {
  return <>
    <MaritimeReportSwitcher />
    <MaritimePreparationEnterpriseBridge />
  </>;
}

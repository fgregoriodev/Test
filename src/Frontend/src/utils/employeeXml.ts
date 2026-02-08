import { EmployeeApiResponse } from "../models/employee";


function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function employeesToXml(employees: EmployeeApiResponse[]): string {
  return `
<Employees>
${employees
  .map(
    (e) => `
  <Employee>
    <Id>${e.id}</Id>
    <Code>${escapeXml(e.code)}</Code>
    <FirstName>${escapeXml(e.firstName)}</FirstName>
    <LastName>${escapeXml(e.lastName)}</LastName>
    <Email>${escapeXml(e.email)}</Email>
    <Phone>${escapeXml(e.phone)}</Phone>
    <Address>${escapeXml(e.address)}</Address>
    <Department>
      <Code>${escapeXml(e.department?.code ?? "")}</Code>
      <Description>${escapeXml(e.department?.description ?? "")}</Description>
    </Department>
  </Employee>`
  )
  .join("")}
</Employees>`.trim();
}

export function downloadXml(xml: string, filename: string) {
  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

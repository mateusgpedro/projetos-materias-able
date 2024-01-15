import { Sheet, Table } from "@mui/joy";

export default function SkuTable() {
  return (
    <Sheet
      variant="outlined"
      sx={{
        display: "flex",
        width: "100%",
        borderRadius: "sm",
        overflow: "auto",
      }}
    >
      <Table
        size="sm"
        stickyHeader
        sx={{
          "--TableCell-headBackground": "var(--joy-palette-background-level1)",
          "--Table-headerUnderlineThickness": "1px",
          "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
          "--TableCell-paddingY": "4px",
          "--TableCell-paddingX": "8px",
        }}
      >
        <thead>
          <tr>
            <th style={{ width: "10%", verticalAlign: "middle" }}>Código</th>
            <th style={{ width: "45%", verticalAlign: "middle" }}>Nome</th>
            <th style={{ width: "40%", verticalAlign: "middle" }}>
              Locais de enchimento
            </th>
            <th style={{ width: "5%", verticalAlign: "middle" }}></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </Sheet>
  );
}

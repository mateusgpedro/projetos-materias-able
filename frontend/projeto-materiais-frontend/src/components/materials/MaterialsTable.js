import {Box, Chip, Sheet, Table, Typography} from "@mui/joy";

export default function MaterialsTable({ materials }) {
  return (
    <Sheet
      variant="outlined"
      sx={{
        mt: 3,
        display: { xs: "none", sm: "initial" },
        width: 1,
        borderRadius: "sm",
        overflow: "auto",
        mb: 3
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
            <th style={{ width: "15%", verticalAlign: "middle" }}>Código</th>
            <th style={{ width: "25%", verticalAlign: "middle" }}>
              Descrição Material
            </th>
            <th style={{ width: "45%", verticalAlign: "middle" }}>
              Fabricantes
            </th>
            <th style={{ width: "15%", verticalAlign: "middle" }}>Custo (€)</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material.id}>
              <td>
                <Typography sx={{height: "30px", display: "flex", alignItems: "center",}} fontSize="0.725rem">{material.code}</Typography>
              </td>
              <td>
                <Typography fontSize="0.725rem">{material.name}</Typography>
              </td>
              <td>
                  <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
                      {material.manufacturers?.map((manufacturer, index) => (
                          <Chip key={index} variant="soft" size="sm" color="primary">
                              {manufacturer.name}
                          </Chip>
                      ))}
                  </Box>
                {/*<Typography fontSize="0.725rem">*/}
                {/*  */}
                {/*</Typography>*/}
              </td>
              <td>
                <Typography fontSize="0.725rem">{material.cost}</Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}

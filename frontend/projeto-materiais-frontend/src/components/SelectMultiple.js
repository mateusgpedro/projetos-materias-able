import { Box, Chip, ChipDelete, Option, Select } from "@mui/joy";

export default function SelectMultiple() {
  return (
    <Select
      size="sm"
      multiple
      placeholder="Escolha os locais de enchimento"
      renderValue={(selected) => (
        <Box sx={{ display: "flex", gap: "0.25rem" }}>
          {selected.map((selectedOption) => (
            <Chip variant="soft" color="primary" key={selectedOption.value}>
              {selectedOption.label}
            </Chip>
          ))}
        </Box>
      )}
      sx={{
        minWidth: "15rem",
        color: "neutral.400",
      }}
      slotProps={{
        listbox: {
          sx: {
            width: "100%",
          },
        },
      }}
    >
      <Option value="Mista">Mista</Option>
      <Option value="Garrafao">Garrafão</Option>
      <Option value="BiB">BiB</Option>
      <Option value="Vidro">Vidro</Option>
    </Select>
  );
}

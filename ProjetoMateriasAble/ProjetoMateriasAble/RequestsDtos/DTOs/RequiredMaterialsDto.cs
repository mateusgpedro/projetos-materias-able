namespace ProjetoMateriasAble.DTOs;

public record RequiredMaterialsDto(int MaterialId, string MaterialName, int Amount, int AvailableStock, int Balance);
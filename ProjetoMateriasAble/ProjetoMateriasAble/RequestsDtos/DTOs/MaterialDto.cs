namespace ProjetoMateriasAble.DTOs;

public record MaterialDto(int Id, string Code, string Name, string Cost, List<ManufacturersDto> Manufacturers);

public record ListMaterialDto(List<MaterialDto> MaterialDtos, int totalPages);
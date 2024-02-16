namespace ProjetoMateriasAble.Models.Platform;

public record NewMaterialRequest(string Name, string Type, int StockSeguranca, string EstimatedValue, List<(int ManufacturerName, string ManufacturerCode)> Manufacturers);
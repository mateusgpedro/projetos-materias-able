namespace ProjetoMateriasAble.Models.Platform;

public record NewMaterialRequest(string Name, string Type, int StockSeguranca, string EstimatedValue, List<(string ManufacturerId, string ManufacturerCode)> Manufacturers);
using ProjetoMateriasAble.RequestsDtos.Requests.Platform;

namespace ProjetoMateriasAble.Models.Platform;

public record NewMaterialRequest(string Name, string Type, string StockSeguranca, string EstimatedValue,
    List<ManufacturerCodeRequest> Manufacturers, List<SkuCodeAmount>? SkuCodesAmounts)
{
    public NewMaterialRequest() : 
        this("", "", "", "", new List<ManufacturerCodeRequest>(), new List<SkuCodeAmount>()) { }
}

public record ManufacturerCodeRequest(string ManufacturerId, string ManufacturerCode);
namespace ProjetoMateriasAble.RequestsDtos.Requests.Platform;

public record UpdateRecipesRequest(string MaterialId, List<SkuCodeAmount> SkuCodesQuantities);

public record SkuCodeAmount(string SkuCode, string Amount);
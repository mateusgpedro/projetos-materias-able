namespace ProjetoMateriasAble.RequestsDtos.Requests.Platform;

public record AddProductionOrderToPlanRequest(int PlanId, int SkuId, int UnitiesToProduce);
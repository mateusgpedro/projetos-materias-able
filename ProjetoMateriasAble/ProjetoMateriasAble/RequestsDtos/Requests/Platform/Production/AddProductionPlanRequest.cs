using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.RequestsDtos.Requests.Platform;

public record AddProductionPlanRequest(string CreatedByUsername, DateTime StartDate, 
    DateTime EndDate, ICollection<NewProductionOrderRequest>? ProductionOrders);
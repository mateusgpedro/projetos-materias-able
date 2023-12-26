namespace ProjetoMateriasAble.Models.Platform;

public class ProductionOrder
{
    public int Id { get; set; }
    public int SkuId { get; set; }
    public Sku Sku { get; set; }
    public int PlanId { get; set; }
    public ProductionPlan ProductionPlan { get; set; }
    public int UnitiesToProduce { get; set; }
}
namespace ProjetoMateriasAble.Models.Platform;

public class ProductionPlan
{
    public int Id { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public string CreatedBy { get; set; }
    public ICollection<ProductionOrder>? ProductionOrders { get; set; }
}
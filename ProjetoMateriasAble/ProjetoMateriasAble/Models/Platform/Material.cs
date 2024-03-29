using System.ComponentModel.DataAnnotations.Schema;
using ProjetoMateriasAble.Infra.User;
using ProjetoMateriasAble.Models.JoinTables;
using ProjetoMateriasAble.RequestsDtos.Requests.Platform;

namespace ProjetoMateriasAble.Models.Platform;

public class Material
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public int Amount { get; set; }
    public int PositionsCount { get; set; }
    public int Quebra { get; set; }
    public int StockSeguranca { get; set; }
    public decimal Cost { get; set; }
    public string Type { get; set; }
    public bool Approved { get; set; }
    public int MaterialApprovalId { get; set; }
    public MaterialApproval MaterialApproval { get; set; }
    public ICollection<ManufacturerCodeRelation> ManufacturerCodeRelations { get; set; }
    public ICollection<WarehouseSlot> WarehouseSlots { get; set; }
    public ICollection<RecipeMaterialsAmount> RecipeMaterialsAmounts { get; set; }
}
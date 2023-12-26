namespace ProjetoMateriasAble.Models.Platform;

public class Warehouse
{
    public int Id { get; set; }
    public char Letter { get; set; }
    public ICollection<WarehouseSlot> WarehouseSlots { get; set; }
}
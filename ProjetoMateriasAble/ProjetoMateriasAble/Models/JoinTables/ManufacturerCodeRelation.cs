namespace ProjetoMateriasAble.Models.Platform;

public class ManufacturerCodeRelation
{
    public int Id { get; set; }
    public string Code { get; set; }
    public int ManufacturerId { get; set; }
    public Manufacturer Manufacturer { get; set; }
    public int MaterialId { get; set; }
    public Material Material { get; set; }
}
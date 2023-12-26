namespace ProjetoMateriasAble.Models.Platform;

public class Recipe
{
    public int Id { get; set; }
    public Dictionary<int , int> QuantitiesData { get; set; }
    public int SkuId { get; set; }
    public Sku Sku { get; set; }
}
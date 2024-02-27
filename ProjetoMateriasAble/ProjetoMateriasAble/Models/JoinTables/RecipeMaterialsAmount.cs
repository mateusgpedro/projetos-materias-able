using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.Models.JoinTables;

public class RecipeMaterialsAmount
{
    public int Id { get; set; }
    public int RecipeId { get; set; }
    public Recipe Recipe { get; set; }
    public int MaterialId { get; set; }
    public Material Material { get; set; }
    public int Amount { get; set; }
}
namespace ProjetoMateriasAble.RequestsDtos.DTOs;

public record UnapprovedMaterialDTO(string Name, int StockSeguranca, decimal Cost, List<ManufacturersList> Manufacturers, List<RecipesList> Recipes);

public record ManufacturersList(string ManufacturerName, string ManufacturerCode);
    
public record RecipesList(string SkuName, int Amount);
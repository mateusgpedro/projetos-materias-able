namespace ProjetoMateriasAble.DTOs;

public record RecipeDto(int SkuId, string skuCode, string SkuName, List<RecipeMaterialDto> RecipeMaterials);

public record RecipeMaterialDto(int MaterialId, string Code, string Name, int Amount, int Quebra, string Custo);

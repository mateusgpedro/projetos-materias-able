namespace ProjetoMateriasAble.DTOs;

public record RecipeDto(int SkuId, string SkuName, List<RecipeMaterialDto> RecipeMaterialDtos);

public record RecipeMaterialDto(int MaterialId, string Name, int Amount);

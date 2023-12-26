using ProjetoMateriasAble.Infra;

namespace ProjetoMateriasAble.Services.Materials;

public class MaterialService : IMaterialService
{
    private ApplicationDbContext _dbContext;

    public MaterialService(ApplicationDbContext context)
    {
        _dbContext = context;
    }
    
    public bool MaterialExists(int materialId)
    {
        return _dbContext.Materials.Any(m => m.Id == materialId);
    }
}
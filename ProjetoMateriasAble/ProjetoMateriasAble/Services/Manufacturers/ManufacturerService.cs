using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Infra.Utils;
using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.Services.Manufacturers;

public class ManufacturerService : IManufacturerService
{
    private ApplicationDbContext _dbContext;

    public ManufacturerService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ServiceResponse<List<ManufacturersDto>>> GetAllManufacturersAsync()
    {
        var response = new ServiceResponse<List<ManufacturersDto>>();

        response.data = _dbContext.Manufacturers.Select(m => new ManufacturersDto( m.Id.ToString(), m.Name)).ToList();
        response.isSuccess = true;
        
        return response;
    }
    public async Task<ServiceResponse<Manufacturer>> GetManufacturerAsync(int id)
    {
        var response = new ServiceResponse<Manufacturer>();

        var manufacturer = await _dbContext.Manufacturers
            .Include(m => m.ManufacturerCodeRelations)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (manufacturer == null)
        {
            response.isSuccess = false;
            response.Errors.Add($"Nao foi encontrado nenhum fabricante com o id {id}");
            return response;
        }

        if (manufacturer.ManufacturerCodeRelations.IsNullOrEmpty())
        {
            manufacturer.ManufacturerCodeRelations = new List<ManufacturerCodeRelation>();
        }
        
        response.isSuccess = true;
        response.data = manufacturer;
        return response;
    }
}
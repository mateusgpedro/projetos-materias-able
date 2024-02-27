using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Infra.Utils;
using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.Services.Manufacturers;

public interface IManufacturerService
{
    Task<ServiceResponse<List<ManufacturersDto>>> GetAllManufacturersAsync();

    Task<ServiceResponse<Manufacturer>> GetManufacturerAsync(int id);
}
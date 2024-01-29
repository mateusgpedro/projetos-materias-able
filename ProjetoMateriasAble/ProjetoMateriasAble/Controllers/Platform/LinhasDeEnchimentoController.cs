using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Infra;

namespace ProjetoMateriasAble.Controllers.Platform;

[ApiController]
[Route("api/linhas")]
public class LinhasDeEnchimentoController : ControllerBase
{
    private ApplicationDbContext _dbContext;

    public LinhasDeEnchimentoController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("get_linhas")]
    public async Task<ActionResult<List<LinhaDeEnchimentoDTO>>> GetLinhasDeEnchimento()
    {
        var response = await _dbContext.LinhasDeEnchimento.Select(le => new LinhaDeEnchimentoDTO(le.Id, le.Name)).ToListAsync();
        
        return Ok(response);
    }
}
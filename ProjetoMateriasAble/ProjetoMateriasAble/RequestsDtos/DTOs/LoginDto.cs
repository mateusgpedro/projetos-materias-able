namespace ProjetoMateriasAble.DTOs;

public record LoginDto(string Fullname, string Email, List<string>? Roles);
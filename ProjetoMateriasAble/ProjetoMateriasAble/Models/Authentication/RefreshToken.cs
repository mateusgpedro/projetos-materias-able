namespace ProjetoMateriasAble.Models.Authentication;

public class RefreshToken
{
    public Guid Id { get; set; }
    public required string UserId { get; set; }
    public required string Token { get; set; }
    public required DateTime Expires { get; set; }
}